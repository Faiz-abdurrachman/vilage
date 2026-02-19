const { PrismaClient } = require('@prisma/client');
const { SURAT_KODE, BULAN_ROMAWI } = require('./constants');

const prisma = new PrismaClient();

async function generateNomorSurat(jenisSurat, kodeDesa) {
  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = now.getMonth(); // 0-indexed
  const bulanRomawi = BULAN_ROMAWI[bulan];
  const kodeSurat = SURAT_KODE[jenisSurat];

  // Cari surat terakhir yang disetujui dengan jenis sama di tahun yang sama
  const suratTerakhir = await prisma.surat.findFirst({
    where: {
      jenisSurat,
      status: 'DISETUJUI',
      approvedAt: {
        gte: new Date(`${tahun}-01-01`),
        lte: new Date(`${tahun}-12-31`),
      },
      nomorSurat: { not: null },
    },
    orderBy: { approvedAt: 'desc' },
  });

  let urutan = 1;
  if (suratTerakhir && suratTerakhir.nomorSurat) {
    const parts = suratTerakhir.nomorSurat.split('/');
    const lastUrutan = parseInt(parts[0], 10);
    if (!isNaN(lastUrutan)) {
      urutan = lastUrutan + 1;
    }
  }

  const urutanStr = String(urutan).padStart(3, '0');
  return `${urutanStr}/${kodeSurat}/${kodeDesa}/${bulanRomawi}/${tahun}`;
}

module.exports = { generateNomorSurat };
