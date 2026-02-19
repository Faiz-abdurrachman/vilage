const kkService = require('../services/kartuKeluarga.service');

async function getAll(req, res, next) {
  try {
    const result = await kkService.getAllKK(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await kkService.getKKById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await kkService.createKK(req.body);
    res.status(201).json({ success: true, message: 'Kartu Keluarga berhasil dibuat.', data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await kkService.updateKK(req.params.id, req.body);
    res.json({ success: true, message: 'Kartu Keluarga berhasil diperbarui.', data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await kkService.deleteKK(req.params.id);
    res.json({ success: true, message: 'Kartu Keluarga berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
}

async function addAnggota(req, res, next) {
  try {
    const { pendudukId, statusDalamKK } = req.body;
    const data = await kkService.addAnggota(req.params.id, pendudukId, statusDalamKK);
    res.json({ success: true, message: 'Anggota berhasil ditambahkan ke KK.', data });
  } catch (err) {
    next(err);
  }
}

async function removeAnggota(req, res, next) {
  try {
    await kkService.removeAnggota(req.params.id, req.params.pendudukId);
    res.json({ success: true, message: 'Anggota berhasil dikeluarkan dari KK.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, addAnggota, removeAnggota };
