import { cn } from '@/lib/utils';
import { getJenisMutasiLabel } from '@/lib/utils';

const STATUS_PENDUDUK = {
  AKTIF:     { label: 'Aktif',     dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  MENINGGAL: { label: 'Meninggal', dot: 'bg-slate-400',   bg: 'bg-slate-50 text-slate-600 border-slate-200' },
  PINDAH:    { label: 'Pindah',    dot: 'bg-purple-500',  bg: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const STATUS_SURAT = {
  DRAFT:     { label: 'Draft',     dot: 'bg-slate-400',   bg: 'bg-slate-50 text-slate-600 border-slate-200' },
  MENUNGGU:  { label: 'Menunggu',  dot: 'bg-amber-500',   bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  DISETUJUI: { label: 'Disetujui', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DITOLAK:   { label: 'Ditolak',   dot: 'bg-red-500',     bg: 'bg-red-50 text-red-700 border-red-200' },
};

const STATUS_MUTASI = {
  LAHIR:        { label: 'Kelahiran',    dot: 'bg-blue-500',   bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  MENINGGAL:    { label: 'Kematian',     dot: 'bg-slate-400',  bg: 'bg-slate-50 text-slate-600 border-slate-200' },
  PINDAH_MASUK: { label: 'Pindah Masuk', dot: 'bg-emerald-500',bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PINDAH_KELUAR:{ label: 'Pindah Keluar',dot: 'bg-orange-500', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
};

function StatusBadge({ status, type = 'penduduk' }) {
  let config;

  if (type === 'penduduk') config = STATUS_PENDUDUK[status];
  else if (type === 'surat') config = STATUS_SURAT[status];
  else if (type === 'mutasi') config = STATUS_MUTASI[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 border-slate-200">
        {status}
      </span>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      config.bg
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}

export default StatusBadge;
