const express = require('express');
const router = express.Router();
const controller = require('../controllers/pengaturan.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

router.get('/profil-desa', authenticateToken, controller.getProfilDesa);
router.put('/profil-desa', authenticateToken, authorize('*'), controller.updateProfilDesa);

module.exports = router;
