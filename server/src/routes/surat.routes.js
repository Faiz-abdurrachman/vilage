const express = require('express');
const router = express.Router();
const controller = require('../controllers/surat.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createSuratSchema, updateSuratSchema, rejectSuratSchema } = require('../validations/surat.validation');

router.get('/', authenticateToken, controller.getAll);
router.get('/export/excel', authenticateToken, authorize('export'), controller.exportExcel);
router.get('/:id', authenticateToken, controller.getById);
router.get('/:id/pdf', authenticateToken, controller.downloadPDF);
router.post('/', authenticateToken, authorize('surat.create'), validate(createSuratSchema), controller.create);
router.put('/:id', authenticateToken, authorize('surat.edit'), validate(updateSuratSchema), controller.update);
router.patch('/:id/submit', authenticateToken, authorize('surat.edit'), controller.submit);
router.patch('/:id/approve', authenticateToken, authorize('surat.approve'), controller.approve);
router.patch('/:id/reject', authenticateToken, authorize('surat.approve'), validate(rejectSuratSchema), controller.reject);

module.exports = router;
