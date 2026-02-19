const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllKK(query) {
  const { search, page = 1, limit = 10 } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (search) {
    where.OR = [{ noKk: { contains: search } }];
  }

  // Get all KK with their members count
  const [kkList, total] = await Promise.all([
    prisma.kartuKeluarga.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        anggota: {
          where: { statusPenduduk: 'AKTIF' },
          select: { id: true },
        },
      },
    }),
    prisma.kartuKeluarga.count({ where }),
  ]);

  // Get kepala keluarga info separately to avoid circular reference
  const kkWithKepala = await Promise.all(
    kkList.map(async (kk) => {
      let kepalaKeluarga = null;
      if (kk.kepalaKeluargaId) {
        kepalaKeluarga = await prisma.penduduk.findUnique({
          where: { id: kk.kepalaKeluargaId },
          select: { id: true, namaLengkap: true, nik: true },
        });
      }
      return { ...kk, kepalaKeluarga, jumlahAnggota: kk.anggota.length };
    })
  );

  return {
    data: kkWithKepala,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

async function getKKById(id) {
  const kk = await prisma.kartuKeluarga.findUnique({
    where: { id },
    include: {
      anggota: {
        where: { statusPenduduk: 'AKTIF' },
        orderBy: { statusDalamKK: 'asc' },
      },
    },
  });

  if (!kk) throw { statusCode: 404, message: 'Kartu Keluarga tidak ditemukan.' };

  let kepalaKeluarga = null;
  if (kk.kepalaKeluargaId) {
    kepalaKeluarga = await prisma.penduduk.findUnique({
      where: { id: kk.kepalaKeluargaId },
      select: { id: true, namaLengkap: true, nik: true, jenisKelamin: true },
    });
  }

  return { ...kk, kepalaKeluarga };
}

async function createKK(data) {
  const existing = await prisma.kartuKeluarga.findUnique({ where: { noKk: data.noKk } });
  if (existing) throw { statusCode: 409, message: 'No. KK sudah terdaftar dalam sistem.' };

  return prisma.kartuKeluarga.create({ data });
}

async function updateKK(id, data) {
  const kk = await prisma.kartuKeluarga.findUnique({ where: { id } });
  if (!kk) throw { statusCode: 404, message: 'Kartu Keluarga tidak ditemukan.' };

  if (data.noKk && data.noKk !== kk.noKk) {
    const existing = await prisma.kartuKeluarga.findUnique({ where: { noKk: data.noKk } });
    if (existing) throw { statusCode: 409, message: 'No. KK sudah digunakan KK lain.' };
  }

  return prisma.kartuKeluarga.update({ where: { id }, data });
}

async function deleteKK(id) {
  const kk = await prisma.kartuKeluarga.findUnique({
    where: { id },
    include: { anggota: { where: { statusPenduduk: 'AKTIF' } } },
  });

  if (!kk) throw { statusCode: 404, message: 'Kartu Keluarga tidak ditemukan.' };
  if (kk.anggota.length > 0) {
    throw { statusCode: 400, message: 'KK tidak dapat dihapus karena masih memiliki anggota aktif.' };
  }

  return prisma.kartuKeluarga.delete({ where: { id } });
}

async function addAnggota(kkId, pendudukId, statusDalamKK) {
  const kk = await prisma.kartuKeluarga.findUnique({ where: { id: kkId } });
  if (!kk) throw { statusCode: 404, message: 'Kartu Keluarga tidak ditemukan.' };

  const penduduk = await prisma.penduduk.findUnique({ where: { id: pendudukId } });
  if (!penduduk) throw { statusCode: 404, message: 'Penduduk tidak ditemukan.' };
  if (penduduk.statusPenduduk !== 'AKTIF') {
    throw { statusCode: 400, message: 'Hanya penduduk aktif yang bisa ditambahkan ke KK.' };
  }

  if (statusDalamKK === 'KEPALA_KELUARGA' && kk.kepalaKeluargaId) {
    throw { statusCode: 400, message: 'KK sudah memiliki kepala keluarga.' };
  }

  const updateData = { kkId, statusDalamKK };

  await prisma.penduduk.update({ where: { id: pendudukId }, data: updateData });

  if (statusDalamKK === 'KEPALA_KELUARGA') {
    await prisma.kartuKeluarga.update({ where: { id: kkId }, data: { kepalaKeluargaId: pendudukId } });
  }

  return getKKById(kkId);
}

async function removeAnggota(kkId, pendudukId) {
  const penduduk = await prisma.penduduk.findUnique({ where: { id: pendudukId } });
  if (!penduduk) throw { statusCode: 404, message: 'Penduduk tidak ditemukan.' };
  if (penduduk.kkId !== kkId) throw { statusCode: 400, message: 'Penduduk tidak terdaftar di KK ini.' };

  // Cek apakah ini kepala keluarga
  const kk = await prisma.kartuKeluarga.findUnique({ where: { id: kkId } });
  if (kk && kk.kepalaKeluargaId === pendudukId) {
    await prisma.kartuKeluarga.update({ where: { id: kkId }, data: { kepalaKeluargaId: null } });
  }

  return prisma.penduduk.update({ where: { id: pendudukId }, data: { kkId: null } });
}

module.exports = { getAllKK, getKKById, createKK, updateKK, deleteKK, addAnggota, removeAnggota };
