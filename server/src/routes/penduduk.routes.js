const express = require('express');
const router = express.Router();
const controller = require('../controllers/penduduk.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createPendudukSchema, updatePendudukSchema } = require('../validations/penduduk.validation');

router.get('/', authenticateToken, controller.getAll);
router.get('/export/excel', authenticateToken, authorize('export'), controller.exportExcel);
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorize('penduduk.create'), validate(createPendudukSchema), controller.create);
router.put('/:id', authenticateToken, authorize('penduduk.update'), validate(updatePendudukSchema), controller.update);
router.delete('/:id', authenticateToken, authorize('penduduk.delete'), controller.remove);

module.exports = router;
