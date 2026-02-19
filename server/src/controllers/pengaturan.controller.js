const pengaturanService = require('../services/pengaturan.service');

async function getProfilDesa(req, res, next) {
  try {
    const data = await pengaturanService.getProfilDesa();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateProfilDesa(req, res, next) {
  try {
    const data = await pengaturanService.updateProfilDesa(req.body);
    res.json({ success: true, message: 'Profil desa berhasil diperbarui.', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfilDesa, updateProfilDesa };
