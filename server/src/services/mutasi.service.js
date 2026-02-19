const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllMutasi(query) {
  const { jenisMutasi, page = 1, limit = 10, search } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (jenisMutasi) where.jenisMutasi = jenisMutasi;
  if (search) {
    where.penduduk = {
      OR: [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search } },
      ],
    };
  }

  const [data, total] = await Promise.all([
    prisma.mutasi.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { tanggalMutasi: 'desc' },
      include: {
        penduduk: { select: { id: true, namaLengkap: true, nik: true } },
        createdBy: { select: { id: true, namaLengkap: true } },
      },
    }),
    prisma.mutasi.count({ where }),
  ]);

  return {
    data,
    meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  };
}

async function getMutasiById(id) {
  const mutasi = await prisma.mutasi.findUnique({
    where: { id },
    include: {
      penduduk: true,
      createdBy: { select: { id: true, namaLengkap: true, role: true } },
    },
  });
  if (!mutasi) throw { statusCode: 404, message: 'Data mutasi tidak ditemukan.' };
  return mutasi;
}

async function createMutasi(data, userId) {
  const { jenisMutasi, tanggalMutasi, keterangan, desaTujuan, desaAsal, pendudukId, kkId, ...pendudukData } = data;

  return prisma.$transaction(async (tx) => {
    let targetPendudukId = pendudukId;

    if (jenisMutasi === 'LAHIR') {
      // Buat penduduk baru (bayi)
      const bayi = await tx.penduduk.create({
        data: {
          nik: pendudukData.nik,
          namaLengkap: pendudukData.namaLengkap,
          tempatLahir: pendudukData.tempatLahir || 'Kotamobagu',
          tanggalLahir: new Date(tanggalMutasi),
          jenisKelamin: pendudukData.jenisKelamin || 'LAKI_LAKI',
          alamat: pendudukData.alamat || '',
          rt: pendudukData.rt || '001',
          rw: pendudukData.rw || '001',
          agama: pendudukData.agama || 'ISLAM',
          statusPerkawinan: 'BELUM_KAWIN',
          pekerjaan: 'Belum Bekerja',
          pendidikanTerakhir: 'TIDAK_SEKOLAH',
          namaAyah: pendudukData.namaAyah || '',
          namaIbu: pendudukData.namaIbu || '',
          statusDalamKK: 'ANAK',
          kkId: kkId || null,
        },
      });
      targetPendudukId = bayi.id;

    } else if (jenisMutasi === 'MENINGGAL') {
      const penduduk = await tx.penduduk.findUnique({ where: { id: pendudukId } });
      if (!penduduk) throw { statusCode: 404, message: 'Penduduk tidak ditemukan.' };
      if (penduduk.statusPenduduk !== 'AKTIF') throw { statusCode: 400, message: 'Penduduk harus berstatus AKTIF.' };

      await tx.penduduk.update({ where: { id: pendudukId }, data: { statusPenduduk: 'MENINGGAL' } });

    } else if (jenisMutasi === 'PINDAH_KELUAR') {
      const penduduk = await tx.penduduk.findUnique({ where: { id: pendudukId } });
      if (!penduduk) throw { statusCode: 404, message: 'Penduduk tidak ditemukan.' };
      if (penduduk.statusPenduduk !== 'AKTIF') throw { statusCode: 400, message: 'Penduduk harus berstatus AKTIF.' };
      if (!desaTujuan) throw { statusCode: 400, message: 'Desa tujuan wajib diisi untuk PINDAH_KELUAR.' };

      await tx.penduduk.update({ where: { id: pendudukId }, data: { statusPenduduk: 'PINDAH', kkId: null } });

    } else if (jenisMutasi === 'PINDAH_MASUK') {
      // Buat penduduk baru dari daerah lain
      if (!desaAsal) throw { statusCode: 400, message: 'Desa asal wajib diisi untuk PINDAH_MASUK.' };

      const pendudukBaru = await tx.penduduk.create({
        data: {
          nik: pendudukData.nik,
          namaLengkap: pendudukData.namaLengkap,
          tempatLahir: pendudukData.tempatLahir || 'Kotamobagu',
          tanggalLahir: new Date(pendudukData.tanggalLahir),
          jenisKelamin: pendudukData.jenisKelamin || 'LAKI_LAKI',
          alamat: pendudukData.alamat || '',
          rt: pendudukData.rt || '001',
          rw: pendudukData.rw || '001',
          agama: pendudukData.agama || 'ISLAM',
          statusPerkawinan: pendudukData.statusPerkawinan || 'BELUM_KAWIN',
          pekerjaan: pendudukData.pekerjaan || 'Tidak Bekerja',
          pendidikanTerakhir: pendudukData.pendidikanTerakhir || 'SMA',
          namaAyah: pendudukData.namaAyah || '',
          namaIbu: pendudukData.namaIbu || '',
          statusDalamKK: 'FAMILI_LAIN',
          kkId: kkId || null,
          statusPenduduk: 'AKTIF',
        },
      });
      targetPendudukId = pendudukBaru.id;
    }

    // Buat record mutasi
    const mutasi = await tx.mutasi.create({
      data: {
        pendudukId: targetPendudukId,
        jenisMutasi,
        tanggalMutasi: new Date(tanggalMutasi),
        keterangan,
        desaTujuan,
        desaAsal,
        createdById: userId,
      },
      include: {
        penduduk: { select: { id: true, namaLengkap: true, nik: true } },
        createdBy: { select: { id: true, namaLengkap: true } },
      },
    });

    return mutasi;
  });
}

module.exports = { getAllMutasi, getMutasiById, createMutasi };
