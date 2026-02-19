const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema } = require('../validations/user.validation');

router.get('/', authenticateToken, authorize('*'), controller.getAll);
router.post('/', authenticateToken, authorize('*'), validate(createUserSchema), controller.create);
router.put('/:id', authenticateToken, authorize('*'), validate(updateUserSchema), controller.update);
router.patch('/:id/toggle-active', authenticateToken, authorize('*'), controller.toggleActive);

module.exports = router;
