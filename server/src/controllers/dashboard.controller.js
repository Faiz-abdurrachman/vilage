const dashboardService = require('../services/dashboard.service');

async function getStats(req, res, next) {
  try {
    const data = await dashboardService.getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getDemografi(req, res, next) {
  try {
    const data = await dashboardService.getDemografi();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getMutasiBulanan(req, res, next) {
  try {
    const data = await dashboardService.getMutasiBulanan();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getDemografi, getMutasiBulanan };
