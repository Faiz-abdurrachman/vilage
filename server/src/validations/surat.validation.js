const { z } = require('zod');

const createSuratSchema = z.object({
  jenisSurat: z.enum(['SK_DOMISILI', 'SKTM', 'SK_USAHA', 'SK_KELAHIRAN', 'SK_KEMATIAN', 'SURAT_PENGANTAR']),
  pendudukId: z.string().min(1, 'Penduduk wajib dipilih'),
  perihal: z.string().optional().nullable(),
  dataTambahan: z.any().optional(),
});

const updateSuratSchema = createSuratSchema.partial();

const rejectSuratSchema = z.object({
  rejectedReason: z.string().min(1, 'Alasan penolakan wajib diisi'),
});

const submitSuratSchema = z.object({}).optional();

module.exports = { createSuratSchema, updateSuratSchema, rejectSuratSchema };
