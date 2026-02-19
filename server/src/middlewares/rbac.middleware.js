const { ROLES } = require('../utils/constants');

function authorize(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi.' });
    }

    const role = req.user.role;
    const rolePermissions = ROLES[role] || [];

    // Admin punya akses ke semua
    if (rolePermissions.includes('*')) {
      return next();
    }

    // Cek apakah user punya semua permission yang dibutuhkan
    const hasPermission = permissions.every((perm) => rolePermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Role ${role} tidak memiliki izin untuk aksi ini.`,
      });
    }

    next();
  };
}

module.exports = { authorize };
