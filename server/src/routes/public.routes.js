const express = require('express');
const router = express.Router();
const controller = require('../controllers/public.controller');

// Public routes — NO authentication required
router.get('/stats', controller.getPublicStats);
router.get('/profil-desa', controller.getPublicProfilDesa);
router.get('/status-surat/:nomor', controller.cekStatusSurat);

module.exports = router;
