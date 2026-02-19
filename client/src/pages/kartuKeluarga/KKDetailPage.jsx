import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, UserMinus, Users } from 'lucide-react';
import { useKKDetail, useRemoveAnggota } from '@/hooks/useKartuKeluarga';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDate, hitungUmur } from '@/lib/utils';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-40 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value || '-'}</span>
    </div>
  );
}

const STATUS_LABEL = {
  KEPALA_KELUARGA: 'Kepala Keluarga',
  ISTRI: 'Istri',
  ANAK: 'Anak',
  FAMILI_LAIN: 'Famili Lain',
  LAINNYA: 'Lainnya',
};

function KKDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [removeTarget, setRemoveTarget] = useState(null);

  const { data: kk, isLoading } = useKKDetail(id);
  const removeAnggotaMutation = useRemoveAnggota();

  if (isLoading) return <PageLoader />;
  if (!kk) return <div className="text-center py-16 text-slate-500">Data KK tidak ditemukan.</div>;

  const canEdit = ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role);

  const handleRemoveAnggota = async () => {
    try {
      await removeAnggotaMutation.mutateAsync({ kkId: id, pendudukId: removeTarget.id });
      toast({ title: 'Berhasil', description: 'Anggota berhasil dikeluarkan dari KK.', variant: 'success' });
      setRemoveTarget(null);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Detail Kartu Keluarga"
        breadcrumbs={[
          { label: 'Kartu Keluarga', href: '/kartu-keluarga' },
          { label: kk.noKk },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/kartu-keluarga')}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            {canEdit && (
              <Button size="sm" asChild>
                <Link to={`/kartu-keluarga/${id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Edit KK
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info KK */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi KK</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Nomor KK" value={kk.noKk} />
            <InfoRow label="Alamat" value={kk.alamat} />
            <InfoRow label="RT / RW" value={`${kk.rt} / ${kk.rw}`} />
            <InfoRow label="Dusun" value={kk.dusun} />
            <InfoRow label="Kode Pos" value={kk.kodePos} />
            <InfoRow
              label="Kepala Keluarga"
              value={kk.kepalaKeluarga ? (
                <Link
                  to={`/penduduk/${kk.kepalaKeluarga.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {kk.kepalaKeluarga.namaLengkap}
                </Link>
              ) : '-'}
            />
            <div className="pt-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{kk.anggota?.length || 0}</span> anggota
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Anggota KK */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daftar Anggota Keluarga</CardTitle>
            </CardHeader>
            <CardContent>
              {(!kk.anggota || kk.anggota.length === 0) ? (
                <p className="text-sm text-slate-500 text-center py-8">Belum ada anggota keluarga.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500">No</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500">Nama</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500">NIK</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500">Status</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500">Umur</th>
                        {canEdit && <th className="pb-2 text-right text-xs font-semibold text-slate-500">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {kk.anggota.map((anggota, i) => (
                        <tr key={anggota.id} className="hover:bg-slate-50">
                          <td className="py-2.5 text-slate-500">{i + 1}</td>
                          <td className="py-2.5">
                            <Link
                              to={`/penduduk/${anggota.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {anggota.namaLengkap}
                            </Link>
                          </td>
                          <td className="py-2.5 text-slate-600 font-mono text-xs">{anggota.nik}</td>
                          <td className="py-2.5">
                            <Badge variant="outline" className="text-xs">
                              {STATUS_LABEL[anggota.statusDalamKK] || anggota.statusDalamKK}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-slate-600">
                            {anggota.tanggalLahir ? `${hitungUmur(anggota.tanggalLahir)} th` : '-'}
                          </td>
                          {canEdit && (
                            <td className="py-2.5 text-right">
                              {anggota.statusDalamKK !== 'KEPALA_KELUARGA' && (
                                <Button
                                  variant="ghost" size="icon" className="h-7 w-7 text-orange-500 hover:text-orange-700"
                                  onClick={() => setRemoveTarget(anggota)}
                                  title="Keluarkan dari KK"
                                >
                                  <UserMinus className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveAnggota}
        title="Keluarkan Anggota dari KK"
        description={`Keluarkan "${removeTarget?.namaLengkap}" dari KK ini? Data penduduk tidak akan dihapus.`}
        isLoading={removeAnggotaMutation.isPending}
      />
    </div>
  );
}

export default KKDetailPage;
