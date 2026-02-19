const { z } = require('zod');

const createPendudukSchema = z.object({
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date <= new Date();
  }, 'Tanggal lahir tidak valid atau di masa depan'),
  jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN'], { errorMap: () => ({ message: 'Jenis kelamin tidak valid' }) }),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  rt: z.string().min(1, 'RT wajib diisi'),
  rw: z.string().min(1, 'RW wajib diisi'),
  agama: z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'], { errorMap: () => ({ message: 'Agama tidak valid' }) }),
  statusPerkawinan: z.enum(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI'], { errorMap: () => ({ message: 'Status perkawinan tidak valid' }) }),
  pekerjaan: z.string().min(1, 'Pekerjaan wajib diisi'),
  pendidikanTerakhir: z.enum(['TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'], { errorMap: () => ({ message: 'Pendidikan tidak valid' }) }),
  kewarganegaraan: z.string().default('WNI'),
  golonganDarah: z.enum(['A', 'B', 'AB', 'O', 'TIDAK_TAHU']).optional().nullable(),
  namaAyah: z.string().min(1, 'Nama ayah wajib diisi'),
  namaIbu: z.string().min(1, 'Nama ibu wajib diisi'),
  statusDalamKK: z.enum(['KEPALA_KELUARGA', 'ISTRI', 'ANAK', 'FAMILI_LAIN', 'LAINNYA'], { errorMap: () => ({ message: 'Status dalam KK tidak valid' }) }),
  kkId: z.string().optional().nullable(),
});

const updatePendudukSchema = createPendudukSchema.partial();

module.exports = { createPendudukSchema, updatePendudukSchema };
