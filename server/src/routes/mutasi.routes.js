const express = require('express');
const router = express.Router();
const controller = require('../controllers/mutasi.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { baseMutasiSchema } = require('../validations/mutasi.validation');

router.get('/', authenticateToken, controller.getAll);
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorize('mutasi.create'), validate(baseMutasiSchema), controller.create);

module.exports = router;
