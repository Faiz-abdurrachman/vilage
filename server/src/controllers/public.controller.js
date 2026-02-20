const dashboardService = require('../services/dashboard.service');
const pengaturanService = require('../services/pengaturan.service');

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

module.exports = { getPublicStats, getPublicProfilDesa };
