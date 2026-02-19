const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllPenduduk(query) {
  const {
    search, jenisKelamin, agama, status, dusun, rt, rw, pekerjaan, pendidikanTerakhir,
    page = 1, limit = 10, sortBy = 'namaLengkap', sortOrder = 'asc',
  } = query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (search) {
    where.OR = [
      { nik: { contains: search, mode: 'insensitive' } },
      { namaLengkap: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (jenisKelamin) where.jenisKelamin = jenisKelamin;
  if (agama) where.agama = agama;
  if (status) where.statusPenduduk = status;
  if (rt) where.rt = rt;
  if (rw) where.rw = rw;
  if (pekerjaan) where.pekerjaan = { contains: pekerjaan, mode: 'insensitive' };
  if (pendidikanTerakhir) where.pendidikanTerakhir = pendidikanTerakhir;

  if (dusun) {
    where.kartuKeluarga = { dusun: { contains: dusun, mode: 'insensitive' } };
  }

  const validSortFields = ['namaLengkap', 'nik', 'tanggalLahir', 'createdAt'];
  const orderBy = validSortFields.includes(sortBy) ? { [sortBy]: sortOrder } : { namaLengkap: 'asc' };

  const [data, total] = await Promise.all([
    prisma.penduduk.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        kartuKeluarga: { select: { id: true, noKk: true, dusun: true, rt: true, rw: true } },
      },
    }),
    prisma.penduduk.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

async function getPendudukById(id) {
  const penduduk = await prisma.penduduk.findUnique({
    where: { id },
    include: {
      kartuKeluarga: true,
      mutasi: {
        include: { createdBy: { select: { id: true, namaLengkap: true } } },
        orderBy: { tanggalMutasi: 'desc' },
      },
      surat: {
        select: { id: true, nomorSurat: true, jenisSurat: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!penduduk) throw { statusCode: 404, message: 'Data penduduk tidak ditemukan.' };
  return penduduk;
}

async function createPenduduk(data) {
  const existing = await prisma.penduduk.findUnique({ where: { nik: data.nik } });
  if (existing) throw { statusCode: 409, message: 'NIK sudah terdaftar dalam sistem.' };

  if (data.kkId) {
    const kk = await prisma.kartuKeluarga.findUnique({ where: { id: data.kkId } });
    if (!kk) throw { statusCode: 404, message: 'Kartu Keluarga tidak ditemukan.' };
  }

  const penduduk = await prisma.penduduk.create({
    data: {
      ...data,
      tanggalLahir: new Date(data.tanggalLahir),
    },
    include: { kartuKeluarga: true },
  });

  return penduduk;
}

async function updatePenduduk(id, data) {
  const penduduk = await prisma.penduduk.findUnique({ where: { id } });
  if (!penduduk) throw { statusCode: 404, message: 'Data penduduk tidak ditemukan.' };

  if (penduduk.statusPenduduk !== 'AKTIF') {
    throw { statusCode: 400, message: 'Penduduk dengan status tidak aktif tidak dapat diedit.' };
  }

  if (data.nik && data.nik !== penduduk.nik) {
    const existing = await prisma.penduduk.findUnique({ where: { nik: data.nik } });
    if (existing) throw { statusCode: 409, message: 'NIK sudah digunakan penduduk lain.' };
  }

  const updateData = { ...data };
  if (data.tanggalLahir) updateData.tanggalLahir = new Date(data.tanggalLahir);

  return prisma.penduduk.update({
    where: { id },
    data: updateData,
    include: { kartuKeluarga: true },
  });
}

async function deletePenduduk(id) {
  const penduduk = await prisma.penduduk.findUnique({ where: { id } });
  if (!penduduk) throw { statusCode: 404, message: 'Data penduduk tidak ditemukan.' };

  // Soft delete: set status ke MENINGGAL
  return prisma.penduduk.update({
    where: { id },
    data: { statusPenduduk: 'MENINGGAL' },
  });
}

async function exportPenduduk(query) {
  const { search, jenisKelamin, agama, status, dusun } = query;

  const where = {};
  if (search) {
    where.OR = [
      { nik: { contains: search, mode: 'insensitive' } },
      { namaLengkap: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (jenisKelamin) where.jenisKelamin = jenisKelamin;
  if (agama) where.agama = agama;
  if (status) where.statusPenduduk = status;
  if (dusun) where.kartuKeluarga = { dusun: { contains: dusun, mode: 'insensitive' } };

  return prisma.penduduk.findMany({
    where,
    orderBy: { namaLengkap: 'asc' },
    include: { kartuKeluarga: { select: { noKk: true, dusun: true } } },
  });
}

module.exports = { getAllPenduduk, getPendudukById, createPenduduk, updatePenduduk, deletePenduduk, exportPenduduk };
