const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { loginSchema, changePasswordSchema } = require('../validations/auth.validation');

router.post('/login', validate(loginSchema), controller.login);
router.get('/me', authenticateToken, controller.getMe);
router.put('/change-password', authenticateToken, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
