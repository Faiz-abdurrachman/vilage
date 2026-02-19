const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, username: true, namaLengkap: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: 'asc' },
  });
}

async function createUser(data) {
  const existing = await prisma.user.findUnique({ where: { username: data.username } });
  if (existing) throw { statusCode: 409, message: 'Username sudah digunakan.' };

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, password: hashed },
    select: { id: true, username: true, namaLengkap: true, role: true, isActive: true, createdAt: true },
  });
  return user;
}

async function updateUser(id, data) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw { statusCode: 404, message: 'User tidak ditemukan.' };

  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, namaLengkap: true, role: true, isActive: true, updatedAt: true },
  });
}

async function toggleActive(id, requesterId) {
  if (id === requesterId) throw { statusCode: 400, message: 'Tidak dapat menonaktifkan akun sendiri.' };

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw { statusCode: 404, message: 'User tidak ditemukan.' };

  return prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: { id: true, username: true, namaLengkap: true, role: true, isActive: true },
  });
}

module.exports = { getAllUsers, createUser, updateUser, toggleActive };
