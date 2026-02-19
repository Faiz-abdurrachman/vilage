const userService = require('../services/user.service');

async function getAll(req, res, next) {
  try {
    const data = await userService.getAllUsers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await userService.createUser(req.body);
    res.status(201).json({ success: true, message: 'User berhasil dibuat.', data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User berhasil diperbarui.', data });
  } catch (err) {
    next(err);
  }
}

async function toggleActive(req, res, next) {
  try {
    const data = await userService.toggleActive(req.params.id, req.user.id);
    res.json({ success: true, message: `User berhasil ${data.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, toggleActive };
