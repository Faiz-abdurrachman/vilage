const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const pendudukRoutes = require('./penduduk.routes');
const kartuKeluargaRoutes = require('./kartuKeluarga.routes');
const mutasiRoutes = require('./mutasi.routes');
const suratRoutes = require('./surat.routes');
const userRoutes = require('./user.routes');
const pengaturanRoutes = require('./pengaturan.routes');

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/penduduk', pendudukRoutes);
router.use('/kartu-keluarga', kartuKeluargaRoutes);
router.use('/mutasi', mutasiRoutes);
router.use('/surat', suratRoutes);
router.use('/users', userRoutes);
router.use('/pengaturan', pengaturanRoutes);

module.exports = router;
