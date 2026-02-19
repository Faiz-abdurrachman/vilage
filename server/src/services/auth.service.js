const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function login(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw { statusCode: 401, message: 'Username atau password salah.' };
  }

  if (!user.isActive) {
    throw { statusCode: 403, message: 'Akun Anda tidak aktif. Hubungi administrator.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Username atau password salah.' };
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, namaLengkap: user.namaLengkap },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, namaLengkap: true, role: true, isActive: true, createdAt: true },
  });
  if (!user) throw { statusCode: 404, message: 'User tidak ditemukan.' };
  return user;
}

async function changePassword(userId, oldPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: 'User tidak ditemukan.' };

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) throw { statusCode: 400, message: 'Password lama tidak benar.' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { message: 'Password berhasil diubah.' };
}

module.exports = { login, getProfile, changePassword };
