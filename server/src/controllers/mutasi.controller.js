const mutasiService = require('../services/mutasi.service');

async function getAll(req, res, next) {
  try {
    const result = await mutasiService.getAllMutasi(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await mutasiService.getMutasiById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await mutasiService.createMutasi(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Mutasi berhasil dicatat.', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
