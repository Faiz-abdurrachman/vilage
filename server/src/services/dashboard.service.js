const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [
    totalPenduduk,
    totalKK,
    totalSuratBulanIni,
    totalMutasiBulanIni,
    pendudukLakiLaki,
    pendudukPerempuan,
    totalPendudukMeninggal,
    totalPendudukPindah,
  ] = await Promise.all([
    prisma.penduduk.count({ where: { statusPenduduk: 'AKTIF' } }),
    prisma.kartuKeluarga.count(),
    prisma.surat.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.mutasi.count({ where: { tanggalMutasi: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.penduduk.count({ where: { jenisKelamin: 'LAKI_LAKI', statusPenduduk: 'AKTIF' } }),
    prisma.penduduk.count({ where: { jenisKelamin: 'PEREMPUAN', statusPenduduk: 'AKTIF' } }),
    prisma.penduduk.count({ where: { statusPenduduk: 'MENINGGAL' } }),
    prisma.penduduk.count({ where: { statusPenduduk: 'PINDAH' } }),
  ]);

  return {
    totalPenduduk,
    totalKK,
    totalSuratBulanIni,
    totalMutasiBulanIni,
    pendudukLakiLaki,
    pendudukPerempuan,
    totalPendudukMeninggal,
    totalPendudukPindah,
  };
}

async function getDemografi() {
  const pendudukAktif = await prisma.penduduk.findMany({
    where: { statusPenduduk: 'AKTIF' },
    select: {
      agama: true,
      pekerjaan: true,
      pendidikanTerakhir: true,
      tanggalLahir: true,
      kartuKeluarga: { select: { dusun: true } },
    },
  });

  // Per agama
  const agamaMap = {};
  pendudukAktif.forEach((p) => {
    agamaMap[p.agama] = (agamaMap[p.agama] || 0) + 1;
  });
  const perAgama = Object.entries(agamaMap).map(([agama, jumlah]) => ({ agama, jumlah }));

  // Per pekerjaan (top 10)
  const pekerjaanMap = {};
  pendudukAktif.forEach((p) => {
    pekerjaanMap[p.pekerjaan] = (pekerjaanMap[p.pekerjaan] || 0) + 1;
  });
  const perPekerjaan = Object.entries(pekerjaanMap)
    .map(([pekerjaan, jumlah]) => ({ pekerjaan, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 10);

  // Per pendidikan
  const pendidikanMap = {};
  pendudukAktif.forEach((p) => {
    pendidikanMap[p.pendidikanTerakhir] = (pendidikanMap[p.pendidikanTerakhir] || 0) + 1;
  });
  const perPendidikan = Object.entries(pendidikanMap).map(([pendidikan, jumlah]) => ({ pendidikan, jumlah }));

  // Per dusun
  const dusunMap = {};
  pendudukAktif.forEach((p) => {
    const dusun = p.kartuKeluarga?.dusun || 'Tidak Diketahui';
    dusunMap[dusun] = (dusunMap[dusun] || 0) + 1;
  });
  const perDusun = Object.entries(dusunMap)
    .map(([dusun, jumlah]) => ({ dusun, jumlah }))
    .sort((a, b) => a.dusun.localeCompare(b.dusun));

  // Per kelompok umur
  const today = new Date();
  const kelompokUmurMap = {
    'Balita (0-5)': 0,
    'Anak (6-12)': 0,
    'Remaja (13-17)': 0,
    'Pemuda (18-25)': 0,
    'Dewasa (26-40)': 0,
    'Paruh Baya (41-60)': 0,
    'Lansia (60+)': 0,
  };

  pendudukAktif.forEach((p) => {
    const age = today.getFullYear() - new Date(p.tanggalLahir).getFullYear();
    if (age <= 5) kelompokUmurMap['Balita (0-5)']++;
    else if (age <= 12) kelompokUmurMap['Anak (6-12)']++;
    else if (age <= 17) kelompokUmurMap['Remaja (13-17)']++;
    else if (age <= 25) kelompokUmurMap['Pemuda (18-25)']++;
    else if (age <= 40) kelompokUmurMap['Dewasa (26-40)']++;
    else if (age <= 60) kelompokUmurMap['Paruh Baya (41-60)']++;
    else kelompokUmurMap['Lansia (60+)']++;
  });

  const perKelompokUmur = Object.entries(kelompokUmurMap).map(([kelompok, jumlah]) => ({ kelompok, jumlah }));

  return { perAgama, perPekerjaan, perPendidikan, perDusun, perKelompokUmur };
}

async function getMutasiBulanan() {
  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const bulanNama = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

    const [lahir, meninggal, pindahMasuk, pindahKeluar] = await Promise.all([
      prisma.mutasi.count({ where: { jenisMutasi: 'LAHIR', tanggalMutasi: { gte: startOfMonth, lte: endOfMonth } } }),
      prisma.mutasi.count({ where: { jenisMutasi: 'MENINGGAL', tanggalMutasi: { gte: startOfMonth, lte: endOfMonth } } }),
      prisma.mutasi.count({ where: { jenisMutasi: 'PINDAH_MASUK', tanggalMutasi: { gte: startOfMonth, lte: endOfMonth } } }),
      prisma.mutasi.count({ where: { jenisMutasi: 'PINDAH_KELUAR', tanggalMutasi: { gte: startOfMonth, lte: endOfMonth } } }),
    ]);

    result.push({ bulan: bulanNama, lahir, meninggal, pindahMasuk, pindahKeluar });
  }

  return result;
}

module.exports = { getStats, getDemografi, getMutasiBulanan };
