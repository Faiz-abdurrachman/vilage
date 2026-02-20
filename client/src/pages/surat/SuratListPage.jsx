import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, FileText, Clock, CheckCircle, XCircle, PenLine } from 'lucide-react';
import { useSuratList } from '@/hooks/useSurat';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const JENIS_LABEL = {
  SK_DOMISILI: 'SK Domisili',
  SKTM: 'SK Tidak Mampu',
  SK_USAHA: 'SK Usaha',
  SK_KELAHIRAN: 'SK Kelahiran',
  SK_KEMATIAN: 'SK Kematian',
  SURAT_PENGANTAR: 'Surat Pengantar',
};

const STATUS_SUMMARY = [
  { key: 'DRAFT',     label: 'Draft',     icon: PenLine,     color: 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100' },
  { key: 'MENUNGGU',  label: 'Menunggu',  icon: Clock,       color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { key: 'DISETUJUI', label: 'Disetujui', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { key: 'DITOLAK',   label: 'Ditolak',   icon: XCircle,     color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
];

function SuratListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jenisSurat, setJenisSurat] = useState('');
  const [statusSurat, setStatusSurat] = useState('');

  useEffect(() => { document.title = 'Surat Keterangan | SIDESA'; }, []);

  const { data, isLoading } = useSuratList({
    page,
    limit: 10,
    search: search || undefined,
    jenisSurat: jenisSurat || undefined,
    status: statusSurat || undefined,
  });

  // For status summary bar, fetch without filter
  const { data: allData } = useSuratList({ limit: 1000 });
  const statusCounts = (allData?.data || []).reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const columns = [
    {
      key: 'nomorSurat', label: 'Nomor Surat',
      render: (v) => v
        ? <span className="font-mono text-xs font-medium text-slate-800">{v}</span>
        : <span className="text-xs text-slate-300 italic">Belum diterbitkan</span>,
    },
    {
      key: 'jenisSurat', label: 'Jenis Surat',
      render: (v) => <span className="text-xs font-medium text-slate-700">{JENIS_LABEL[v] || v}</span>,
    },
    {
      key: 'penduduk', label: 'Pemohon',
      render: (v) => <span className="text-sm font-medium text-slate-800">{v?.namaLengkap || '—'}</span>,
    },
    {
      key: 'createdAt', label: 'Tanggal',
      render: (v) => <span className="text-xs text-slate-500">{formatDate(v)}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (v) => <StatusBadge status={v} type="surat" />,
    },
  ];

  const handleStatusClick = (key) => {
    setStatusSurat(statusSurat === key ? '' : key);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Surat Keterangan"
        description="Kelola permohonan surat keterangan penduduk"
        breadcrumbs={[{ label: 'Surat Keterangan' }]}
        actions={
          ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
            <Button size="sm" onClick={() => navigate('/surat/tambah')}>
              <Plus className="h-4 w-4" />
              Buat Surat
            </Button>
          )
        }
      />

      {/* Status Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_SUMMARY.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => handleStatusClick(key)}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
              color,
              statusSurat === key && 'ring-2 ring-offset-1 ring-blue-500'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-lg font-bold leading-none" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {statusCounts[key] || 0}
              </p>
              <p className="text-xs mt-0.5 opacity-75">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={jenisSurat || 'all'}
          onValueChange={(v) => { setJenisSurat(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-44 h-9 text-sm">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            {Object.entries(JENIS_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusSurat || 'all'}
          onValueChange={(v) => { setStatusSurat(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="MENUNGGU">Menunggu</SelectItem>
            <SelectItem value="DISETUJUI">Disetujui</SelectItem>
            <SelectItem value="DITOLAK">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={(p) => setPage(p)}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        searchValue={search}
        searchPlaceholder="Cari nomor surat atau nama pemohon..."
        actions={(row) => (
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => navigate(`/surat/${row.id}`)}
            title="Lihat Detail"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
      />
    </div>
  );
}

export default SuratListPage;
