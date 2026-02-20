import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useMutasiList } from '@/hooks/useMutasi';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

const JENIS_LABEL = {
  LAHIR: 'Kelahiran',
  MENINGGAL: 'Kematian',
  PINDAH_MASUK: 'Pindah Masuk',
  PINDAH_KELUAR: 'Pindah Keluar',
};

const JENIS_COLOR = {
  LAHIR: 'bg-blue-100 text-blue-700',
  MENINGGAL: 'bg-gray-100 text-gray-700',
  PINDAH_MASUK: 'bg-green-100 text-green-700',
  PINDAH_KELUAR: 'bg-orange-100 text-orange-700',
};

function MutasiListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Mutasi Penduduk | SIDESA'; }, []);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jenisMutasi, setJenisMutasi] = useState('');

  const { data, isLoading } = useMutasiList({
    page,
    limit: 10,
    search: search || undefined,
    jenisMutasi: jenisMutasi || undefined,
  });

  const columns = [
    { key: 'no', label: 'No', render: (_, row) => (data?.data?.indexOf(row) + 1) + ((page - 1) * 10) },
    {
      key: 'jenisMutasi', label: 'Jenis Mutasi',
      render: (v) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${JENIS_COLOR[v] || 'bg-gray-100 text-gray-700'}`}>
          {JENIS_LABEL[v] || v}
        </span>
      ),
    },
    {
      key: 'penduduk', label: 'Nama Penduduk',
      render: (v) => v?.namaLengkap || '-',
    },
    {
      key: 'tanggalMutasi', label: 'Tanggal',
      render: (v) => formatDate(v),
    },
    { key: 'keterangan', label: 'Keterangan', render: (v) => v || '-' },
    {
      key: 'createdBy', label: 'Dicatat Oleh',
      render: (v) => v?.namaLengkap || '-',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Data Mutasi Penduduk"
        description="Riwayat perubahan data penduduk"
        breadcrumbs={[{ label: 'Mutasi Penduduk' }]}
        actions={
          ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
            <Button size="sm" onClick={() => navigate('/mutasi/tambah')}>
              <Plus className="h-4 w-4" />
              Catat Mutasi
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Select
          value={jenisMutasi}
          onValueChange={(v) => { setJenisMutasi(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="LAHIR">Kelahiran</SelectItem>
            <SelectItem value="MENINGGAL">Kematian</SelectItem>
            <SelectItem value="PINDAH_MASUK">Pindah Masuk</SelectItem>
            <SelectItem value="PINDAH_KELUAR">Pindah Keluar</SelectItem>
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
        searchPlaceholder="Cari nama penduduk..."
        actions={(row) => (
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => navigate(`/mutasi/${row.id}`)}
            title="Lihat Detail"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
      />
    </div>
  );
}

export default MutasiListPage;
