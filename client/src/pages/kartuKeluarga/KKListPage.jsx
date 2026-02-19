import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Home } from 'lucide-react';
import { useKKList, useDeleteKK } from '@/hooks/useKartuKeluarga';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function KKListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useKKList({
    page,
    limit: 10,
    search: search || undefined,
  });

  const deleteMutation = useDeleteKK();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({ title: 'Berhasil', description: 'Data KK berhasil dihapus.', variant: 'success' });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal menghapus KK.', variant: 'destructive' });
    }
  };

  const columns = [
    { key: 'no', label: 'No', render: (_, row) => (data?.data?.indexOf(row) + 1) + ((page - 1) * 10) },
    { key: 'noKk', label: 'No. KK' },
    {
      key: 'kepalaKeluarga', label: 'Kepala Keluarga',
      render: (v) => v?.namaLengkap || '-',
    },
    { key: 'dusun', label: 'Dusun' },
    {
      key: 'rt', label: 'RT/RW',
      render: (v, row) => `${v}/${row.rw}`,
    },
    {
      key: 'jumlahAnggota', label: 'Anggota',
      render: (v) => (
        <span className="inline-flex items-center gap-1">
          <Home className="h-3 w-3 text-slate-400" />
          {v ?? 0} jiwa
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kartu Keluarga"
        description="Kelola data kartu keluarga desa"
        breadcrumbs={[{ label: 'Kartu Keluarga' }]}
        actions={
          ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
            <Button size="sm" asChild>
              <Link to="/kartu-keluarga/tambah">
                <Plus className="h-4 w-4" />
                Tambah KK
              </Link>
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={data?.data}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={(p) => setPage(p)}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        searchValue={search}
        searchPlaceholder="Cari nomor KK atau kepala keluarga..."
        actions={(row) => (
          <>
            <Button
              variant="ghost" size="icon" className="h-7 w-7"
              onClick={() => navigate(`/kartu-keluarga/${row.id}`)}
              title="Lihat Detail"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && (
              <Button
                variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => navigate(`/kartu-keluarga/${row.id}/edit`)}
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {user?.role === 'ADMIN' && (
              <Button
                variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
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
        title="Hapus Kartu Keluarga"
        description={`Hapus KK dengan No. "${deleteTarget?.noKk}"? KK hanya dapat dihapus jika tidak memiliki anggota aktif.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default KKListPage;
