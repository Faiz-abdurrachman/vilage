const { PrismaClient } = require('@prisma/client');
const { generateNomorSurat } = require('../utils/generateNomorSurat');

const prisma = new PrismaClient();

async function getDesaProfil() {
  return prisma.desaProfil.findFirst();
}

async function getAllSurat(query) {
  const { status, jenisSurat, search, page = 1, limit = 10 } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  if (status) where.status = status;
  if (jenisSurat) where.jenisSurat = jenisSurat;
  if (search) {
    where.penduduk = {
      OR: [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search } },
      ],
    };
  }

  const [data, total] = await Promise.all([
    prisma.surat.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        penduduk: { select: { id: true, namaLengkap: true, nik: true } },
        createdBy: { select: { id: true, namaLengkap: true } },
        approvedBy: { select: { id: true, namaLengkap: true } },
      },
    }),
    prisma.surat.count({ where }),
  ]);

  return {
    data,
    meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  };
}

async function getSuratById(id) {
  const surat = await prisma.surat.findUnique({
    where: { id },
    include: {
      penduduk: { include: { kartuKeluarga: true } },
      createdBy: { select: { id: true, namaLengkap: true, role: true } },
      approvedBy: { select: { id: true, namaLengkap: true } },
    },
  });
  if (!surat) throw { statusCode: 404, message: 'Surat tidak ditemukan.' };
  return surat;
}

async function createSurat(data, userId) {
  const penduduk = await prisma.penduduk.findUnique({ where: { id: data.pendudukId } });
  if (!penduduk) throw { statusCode: 404, message: 'Penduduk tidak ditemukan.' };
  if (penduduk.statusPenduduk !== 'AKTIF') {
    throw { statusCode: 400, message: 'Surat hanya bisa dibuat untuk penduduk aktif.' };
  }

  return prisma.surat.create({
    data: {
      ...data,
      status: 'DRAFT',
      createdById: userId,
    },
    include: {
      penduduk: { select: { id: true, namaLengkap: true, nik: true } },
      createdBy: { select: { id: true, namaLengkap: true } },
    },
  });
}

async function updateSurat(id, data, userId) {
  const surat = await prisma.surat.findUnique({ where: { id } });
  if (!surat) throw { statusCode: 404, message: 'Surat tidak ditemukan.' };

  if (!['DRAFT', 'DITOLAK'].includes(surat.status)) {
    throw { statusCode: 400, message: 'Surat hanya bisa diedit saat status DRAFT atau DITOLAK.' };
  }

  if (surat.createdById !== userId) {
    throw { statusCode: 403, message: 'Hanya pembuat surat yang bisa mengedit.' };
  }

  return prisma.surat.update({
    where: { id },
    data,
    include: {
      penduduk: { select: { id: true, namaLengkap: true, nik: true } },
    },
  });
}

async function submitSurat(id, userId) {
  const surat = await prisma.surat.findUnique({ where: { id } });
  if (!surat) throw { statusCode: 404, message: 'Surat tidak ditemukan.' };

  if (surat.status !== 'DRAFT') {
    throw { statusCode: 400, message: 'Hanya surat berstatus DRAFT yang bisa diajukan.' };
  }

  if (surat.createdById !== userId) {
    throw { statusCode: 403, message: 'Hanya pembuat surat yang bisa mengajukan.' };
  }

  return prisma.surat.update({ where: { id }, data: { status: 'MENUNGGU' } });
}

async function approveSurat(id, approverId) {
  const surat = await prisma.surat.findUnique({ where: { id } });
  if (!surat) throw { statusCode: 404, message: 'Surat tidak ditemukan.' };

  if (surat.status !== 'MENUNGGU') {
    throw { statusCode: 400, message: 'Hanya surat berstatus MENUNGGU yang bisa disetujui.' };
  }

  const desaProfil = await getDesaProfil();
  const kodeDesa = desaProfil?.kodeDesa || 'MB';
  const nomorSurat = await generateNomorSurat(surat.jenisSurat, kodeDesa);

  return prisma.surat.update({
    where: { id },
    data: {
      status: 'DISETUJUI',
      nomorSurat,
      approvedById: approverId,
      approvedAt: new Date(),
    },
    include: {
      penduduk: true,
      approvedBy: { select: { id: true, namaLengkap: true } },
    },
  });
}

async function rejectSurat(id, approverId, reason) {
  const surat = await prisma.surat.findUnique({ where: { id } });
  if (!surat) throw { statusCode: 404, message: 'Surat tidak ditemukan.' };

  if (surat.status !== 'MENUNGGU') {
    throw { statusCode: 400, message: 'Hanya surat berstatus MENUNGGU yang bisa ditolak.' };
  }

  return prisma.surat.update({
    where: { id },
    data: {
      status: 'DITOLAK',
      rejectedReason: reason,
      approvedById: approverId,
    },
  });
}

async function exportSuratList(query) {
  const { status, jenisSurat } = query;
  const where = {};
  if (status) where.status = status;
  if (jenisSurat) where.jenisSurat = jenisSurat;

  return prisma.surat.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      penduduk: { select: { namaLengkap: true, nik: true } },
      createdBy: { select: { namaLengkap: true } },
      approvedBy: { select: { namaLengkap: true } },
    },
  });
}

module.exports = { getAllSurat, getSuratById, createSurat, updateSurat, submitSurat, approveSurat, rejectSurat, exportSuratList, getDesaProfil };
