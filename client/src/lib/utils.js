import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function hitungUmur(tanggalLahir) {
  if (!tanggalLahir) return 0;
  const today = new Date();
  const birth = new Date(tanggalLahir);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getJenisKelaminLabel(jk) {
  return jk === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan';
}

export function getStatusPendudukColor(status) {
  switch (status) {
    case 'AKTIF': return 'bg-green-100 text-green-700';
    case 'MENINGGAL': return 'bg-gray-100 text-gray-700';
    case 'PINDAH': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function getStatusSuratColor(status) {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-600';
    case 'MENUNGGU': return 'bg-yellow-100 text-yellow-700';
    case 'DISETUJUI': return 'bg-green-100 text-green-700';
    case 'DITOLAK': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function getJenisMutasiColor(jenis) {
  switch (jenis) {
    case 'LAHIR': return 'bg-blue-100 text-blue-700';
    case 'MENINGGAL': return 'bg-gray-100 text-gray-700';
    case 'PINDAH_MASUK': return 'bg-green-100 text-green-700';
    case 'PINDAH_KELUAR': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function getJenisMutasiLabel(jenis) {
  const labels = {
    LAHIR: 'Kelahiran',
    MENINGGAL: 'Kematian',
    PINDAH_MASUK: 'Pindah Masuk',
    PINDAH_KELUAR: 'Pindah Keluar',
  };
  return labels[jenis] || jenis;
}

export function getJenisSuratLabel(jenis) {
  const labels = {
    SK_DOMISILI: 'SK Domisili',
    SKTM: 'SKTM',
    SK_USAHA: 'SK Usaha',
    SK_KELAHIRAN: 'SK Kelahiran',
    SK_KEMATIAN: 'SK Kematian',
    SURAT_PENGANTAR: 'Surat Pengantar',
  };
  return labels[jenis] || jenis;
}
