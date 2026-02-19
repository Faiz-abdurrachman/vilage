import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useSuratList } from '@/hooks/useSurat';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

const JENIS_LABEL = {
  SKD: 'Surat Keterangan Domisili',
  SKCK: 'Surat Kel. Catatan Kepolisian',
  SKU: 'Surat Keterangan Usaha',
  SKL: 'Surat Keterangan Lahir',
  SKM: 'Surat Keterangan Meninggal',
  SKTM: 'Surat Ket. Tidak Mampu',
};

function SuratListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jenisSurat, setJenisSurat] = useState('');
  const [statusSurat, setStatusSurat] = useState('');

  const { data, isLoading } = useSuratList({
    page,
    limit: 10,
    search: search || undefined,
    jenisSurat: jenisSurat || undefined,
    status: statusSurat || undefined,
  });

  const columns = [
    { key: 'no', label: 'No', render: (_, row) => (data?.data?.indexOf(row) + 1) + ((page - 1) * 10) },
    { key: 'nomorSurat', label: 'Nomor Surat', render: (v) => v || <span className="text-slate-400 italic">Belum diterbitkan</span> },
    {
      key: 'jenisSurat', label: 'Jenis Surat',
      render: (v) => <span className="text-xs font-medium">{v}</span>,
    },
    {
      key: 'penduduk', label: 'Pemohon',
      render: (v) => v?.namaLengkap || '-',
    },
    {
      key: 'tanggalPengajuan', label: 'Tanggal',
      render: (v) => formatDate(v),
    },
    {
      key: 'status', label: 'Status',
      render: (v) => <StatusBadge status={v} type="surat" />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Permohonan Surat"
        description="Kelola permohonan surat keterangan penduduk"
        breadcrumbs={[{ label: 'Permohonan Surat' }]}
        actions={
          ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
            <Button size="sm" onClick={() => navigate('/surat/tambah')}>
              <Plus className="h-4 w-4" />
              Buat Surat
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Select
          value={jenisSurat}
          onValueChange={(v) => { setJenisSurat(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Jenis Surat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            {Object.keys(JENIS_LABEL).map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusSurat}
          onValueChange={(v) => { setStatusSurat(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="DIAJUKAN">Diajukan</SelectItem>
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
