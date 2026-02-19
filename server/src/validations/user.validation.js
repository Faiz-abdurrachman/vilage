const { z } = require('zod');

const createUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  role: z.enum(['ADMIN', 'KADES', 'SEKDES', 'OPERATOR']),
});

const updateUserSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  role: z.enum(['ADMIN', 'KADES', 'SEKDES', 'OPERATOR']).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
