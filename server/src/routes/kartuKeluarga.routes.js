const express = require('express');
const router = express.Router();
const controller = require('../controllers/kartuKeluarga.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createKKSchema, updateKKSchema, addAnggotaSchema } = require('../validations/kartuKeluarga.validation');

router.get('/', authenticateToken, controller.getAll);
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorize('kk.create'), validate(createKKSchema), controller.create);
router.put('/:id', authenticateToken, authorize('kk.update'), validate(updateKKSchema), controller.update);
router.delete('/:id', authenticateToken, authorize('penduduk.delete'), controller.remove);
router.post('/:id/anggota', authenticateToken, authorize('kk.update'), validate(addAnggotaSchema), controller.addAnggota);
router.delete('/:id/anggota/:pendudukId', authenticateToken, authorize('kk.update'), controller.removeAnggota);

module.exports = router;
