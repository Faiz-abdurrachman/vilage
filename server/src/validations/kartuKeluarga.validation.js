const { z } = require('zod');

const createKKSchema = z.object({
  noKk: z.string().regex(/^\d{16}$/, 'No. KK harus 16 digit angka'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  rt: z.string().min(1, 'RT wajib diisi'),
  rw: z.string().min(1, 'RW wajib diisi'),
  dusun: z.string().min(1, 'Dusun wajib diisi'),
  kodePos: z.string().optional().nullable(),
});

const updateKKSchema = createKKSchema.partial();

const addAnggotaSchema = z.object({
  pendudukId: z.string().min(1, 'ID penduduk wajib diisi'),
  statusDalamKK: z.enum(['KEPALA_KELUARGA', 'ISTRI', 'ANAK', 'FAMILI_LAIN', 'LAINNYA']),
});

module.exports = { createKKSchema, updateKKSchema, addAnggotaSchema };
