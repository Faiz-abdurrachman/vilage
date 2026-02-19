const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/stats', authenticateToken, controller.getStats);
router.get('/demografi', authenticateToken, controller.getDemografi);
router.get('/mutasi-bulanan', authenticateToken, controller.getMutasiBulanan);

module.exports = router;
