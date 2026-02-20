const { PrismaClient } = require('@prisma/client');
const dashboardService = require('../services/dashboard.service');
const pengaturanService = require('../services/pengaturan.service');

const prisma = new PrismaClient();

async function getPublicStats(req, res, next) {
  try {
    const [stats, demografi] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getDemografi(),
    ]);
    res.json({
      success: true,
      data: {
        totalPenduduk: stats.totalPenduduk,
        totalKK: stats.totalKK,
        totalMutasiBulanIni: stats.totalMutasiBulanIni,
        totalSuratBulanIni: stats.totalSuratBulanIni,
        pendudukLakiLaki: stats.pendudukLakiLaki,
        pendudukPerempuan: stats.pendudukPerempuan,
        perAgama: demografi.perAgama,
        perDusun: demografi.perDusun,
        perKelompokUmur: demografi.perKelompokUmur,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getPublicProfilDesa(req, res, next) {
  try {
    const profil = await pengaturanService.getProfilDesa();
    res.json({ success: true, data: profil });
  } catch (err) {
    // Return empty object if not configured yet
    if (err.statusCode === 404) {
      return res.json({ success: true, data: {} });
    }
    next(err);
  }
}

async function cekStatusSurat(req, res, next) {
  try {
    const { nomor } = req.params;
    const surat = await prisma.surat.findFirst({
      where: {
        nomorSurat: nomor,
        status: 'DISETUJUI',
      },
      select: {
        nomorSurat: true,
        jenisSurat: true,
        status: true,
        createdAt: true,
        approvedAt: true,
        penduduk: {
          select: {
            namaLengkap: true,
          },
        },
      },
    });

    if (!surat) {
      return res.status(404).json({
        success: false,
        message: 'Surat tidak ditemukan atau belum disetujui',
      });
    }

    res.json({ success: true, data: surat });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicStats, getPublicProfilDesa, cekStatusSurat };
