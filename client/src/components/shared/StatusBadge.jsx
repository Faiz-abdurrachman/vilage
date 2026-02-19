import { Badge } from '@/components/ui/badge';
import { getStatusPendudukColor, getStatusSuratColor, getJenisMutasiColor, getJenisMutasiLabel, getJenisSuratLabel } from '@/lib/utils';

const STATUS_PENDUDUK_LABELS = {
  AKTIF: 'Aktif',
  MENINGGAL: 'Meninggal',
  PINDAH: 'Pindah',
};

const STATUS_SURAT_LABELS = {
  DRAFT: 'Draft',
  MENUNGGU: 'Menunggu',
  DISETUJUI: 'Disetujui',
  DITOLAK: 'Ditolak',
};

function StatusBadge({ status, type = 'penduduk' }) {
  if (type === 'penduduk') {
    const variant = status === 'AKTIF' ? 'success' : status === 'MENINGGAL' ? 'dark' : 'purple';
    return <Badge variant={variant}>{STATUS_PENDUDUK_LABELS[status] || status}</Badge>;
  }

  if (type === 'surat') {
    const variantMap = { DRAFT: 'secondary', MENUNGGU: 'warning', DISETUJUI: 'success', DITOLAK: 'destructive' };
    return <Badge variant={variantMap[status] || 'default'}>{STATUS_SURAT_LABELS[status] || status}</Badge>;
  }

  if (type === 'mutasi') {
    const variantMap = { LAHIR: 'default', MENINGGAL: 'dark', PINDAH_MASUK: 'success', PINDAH_KELUAR: 'warning' };
    return <Badge variant={variantMap[status] || 'default'}>{getJenisMutasiLabel(status)}</Badge>;
  }

  return <Badge>{status}</Badge>;
}

export default StatusBadge;
