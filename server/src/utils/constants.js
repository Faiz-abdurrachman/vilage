const ROLES = {
  ADMIN: ['*'],
  KADES: [
    'dashboard',
    'penduduk.read',
    'kk.read',
    'mutasi.read',
    'surat.read',
    'surat.approve',
    'export',
  ],
  SEKDES: [
    'dashboard',
    'penduduk.read',
    'penduduk.create',
    'penduduk.update',
    'kk.read',
    'kk.create',
    'kk.update',
    'mutasi.read',
    'mutasi.create',
    'surat.read',
    'surat.create',
    'surat.edit',
    'export',
  ],
  OPERATOR: [
    'dashboard',
    'penduduk.read',
    'penduduk.create',
    'penduduk.update',
    'kk.read',
    'kk.create',
    'kk.update',
    'mutasi.read',
    'mutasi.create',
    'surat.read',
    'surat.create',
    'surat.edit',
  ],
};

const SURAT_KODE = {
  SK_DOMISILI: 'SKD',
  SKTM: 'SKTM',
  SK_USAHA: 'SKU',
  SK_KELAHIRAN: 'SKL',
  SK_KEMATIAN: 'SKK',
  SURAT_PENGANTAR: 'SP',
};

const SURAT_JUDUL = {
  SK_DOMISILI: 'SURAT KETERANGAN DOMISILI',
  SKTM: 'SURAT KETERANGAN TIDAK MAMPU',
  SK_USAHA: 'SURAT KETERANGAN USAHA',
  SK_KELAHIRAN: 'SURAT KETERANGAN KELAHIRAN',
  SK_KEMATIAN: 'SURAT KETERANGAN KEMATIAN',
  SURAT_PENGANTAR: 'SURAT PENGANTAR',
};

const BULAN_ROMAWI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

module.exports = { ROLES, SURAT_KODE, SURAT_JUDUL, BULAN_ROMAWI };
