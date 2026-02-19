const { z } = require('zod');

const baseMutasiSchema = z.object({
  jenisMutasi: z.enum(['LAHIR', 'MENINGGAL', 'PINDAH_MASUK', 'PINDAH_KELUAR']),
  tanggalMutasi: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Tanggal mutasi tidak valid'),
  keterangan: z.string().optional().nullable(),
  desaTujuan: z.string().optional().nullable(),
  desaAsal: z.string().optional().nullable(),
  pendudukId: z.string().optional().nullable(),
  // Data penduduk baru (untuk LAHIR dan PINDAH_MASUK)
  nik: z.string().optional().nullable(),
  namaLengkap: z.string().optional().nullable(),
  tempatLahir: z.string().optional().nullable(),
  tanggalLahir: z.string().optional().nullable(),
  jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).optional().nullable(),
  alamat: z.string().optional().nullable(),
  rt: z.string().optional().nullable(),
  rw: z.string().optional().nullable(),
  agama: z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']).optional().nullable(),
  statusPerkawinan: z.enum(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI']).optional().nullable(),
  pekerjaan: z.string().optional().nullable(),
  pendidikanTerakhir: z.enum(['TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']).optional().nullable(),
  golonganDarah: z.enum(['A', 'B', 'AB', 'O', 'TIDAK_TAHU']).optional().nullable(),
  namaAyah: z.string().optional().nullable(),
  namaIbu: z.string().optional().nullable(),
  kkId: z.string().optional().nullable(),
});

module.exports = { baseMutasiSchema };
