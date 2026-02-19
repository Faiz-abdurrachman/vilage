import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { usePendudukList, useDeletePenduduk } from '@/hooks/usePenduduk';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDateShort, hitungUmur } from '@/lib/utils';
import api from '@/lib/axios';

function PendudukListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ jenisKelamin: '', agama: '', status: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = usePendudukList({
    page,
    limit: 10,
    search: search || undefined,
    jenisKelamin: filters.jenisKelamin || undefined,
    agama: filters.agama || undefined,
    status: filters.status || undefined,
  });

  const deleteMutation = useDeletePenduduk();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({ title: 'Berhasil', description: 'Data penduduk berhasil dihapus.', variant: 'success' });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal menghapus data.', variant: 'destructive' });
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/penduduk/export/excel', {
        responseType: 'blob',
        params: { search: search || undefined, ...filters },
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-penduduk-${new Date().getTime()}.xlsx`;
      a.click();
    } catch {
      toast({ title: 'Gagal export', description: 'Gagal mengunduh file Excel.', variant: 'destructive' });
    }
  };

  const columns = [
    { key: 'no', label: 'No', render: (_, row, index) => ((page - 1) * 10) + (data?.data?.indexOf(row) + 1) },
    { key: 'nik', label: 'NIK' },
    { key: 'namaLengkap', label: 'Nama Lengkap' },
    {
      key: 'jenisKelamin', label: 'JK',
      render: (v) => v === 'LAKI_LAKI' ? '♂ L' : '♀ P',
    },
    {
      key: 'tanggalLahir', label: 'Umur',
      render: (v) => v ? `${hitungUmur(v)} th` : '-',
    },
    { key: 'agama', label: 'Agama' },
    { key: 'pekerjaan', label: 'Pekerjaan' },
    {
      key: 'statusPenduduk', label: 'Status',
      render: (v) => <StatusBadge status={v} type="penduduk" />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Data Penduduk"
        description="Kelola data penduduk desa"
        breadcrumbs={[{ label: 'Data Penduduk' }]}
        actions={
          <div className="flex gap-2">
            {['ADMIN', 'SEKDES'].includes(user?.role) && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            )}
            {['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
              <Button size="sm" asChild>
                <Link to="/penduduk/tambah">
                  <Plus className="h-4 w-4" />
                  Tambah Penduduk
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Select value={filters.jenisKelamin} onValueChange={(v) => { setFilters(f => ({ ...f, jenisKelamin: v === 'all' ? '' : v })); setPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Jenis Kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua JK</SelectItem>
            <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
            <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.agama} onValueChange={(v) => { setFilters(f => ({ ...f, agama: v === 'all' ? '' : v })); setPage(1); }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Agama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Agama</SelectItem>
            <SelectItem value="ISLAM">Islam</SelectItem>
            <SelectItem value="KRISTEN">Kristen</SelectItem>
            <SelectItem value="KATOLIK">Katolik</SelectItem>
            <SelectItem value="HINDU">Hindu</SelectItem>
            <SelectItem value="BUDDHA">Buddha</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => { setFilters(f => ({ ...f, status: v === 'all' ? '' : v })); setPage(1); }}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="AKTIF">Aktif</SelectItem>
            <SelectItem value="MENINGGAL">Meninggal</SelectItem>
            <SelectItem value="PINDAH">Pindah</SelectItem>
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
        searchPlaceholder="Cari NIK atau nama..."
        actions={(row) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/penduduk/${row.id}`)}
              title="Lihat Detail"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && row.statusPenduduk === 'AKTIF' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => navigate(`/penduduk/${row.id}/edit`)}
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {user?.role === 'ADMIN' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeleteTarget(row)}
                title="Hapus"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Data Penduduk"
        description={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.namaLengkap}"? Status penduduk akan diubah menjadi tidak aktif.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default PendudukListPage;
