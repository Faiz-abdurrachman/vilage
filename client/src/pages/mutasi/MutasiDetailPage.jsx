import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMutasiDetail } from '@/hooks/useMutasi';
import PageHeader from '@/components/shared/PageHeader';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const JENIS_LABEL = {
  LAHIR: 'Kelahiran',
  MENINGGAL: 'Kematian',
  PINDAH_MASUK: 'Pindah Masuk',
  PINDAH_KELUAR: 'Pindah Keluar',
};

const JENIS_COLOR = {
  LAHIR: 'bg-blue-100 text-blue-700 border-blue-200',
  MENINGGAL: 'bg-gray-100 text-gray-700 border-gray-200',
  PINDAH_MASUK: 'bg-green-100 text-green-700 border-green-200',
  PINDAH_KELUAR: 'bg-orange-100 text-orange-700 border-orange-200',
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value || '-'}</span>
    </div>
  );
}

function MutasiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: mutasi, isLoading } = useMutasiDetail(id);

  if (isLoading) return <PageLoader />;
  if (!mutasi) return <div className="text-center py-16 text-slate-500">Data mutasi tidak ditemukan.</div>;

  return (
    <div>
      <PageHeader
        title="Detail Mutasi Penduduk"
        breadcrumbs={[
          { label: 'Mutasi Penduduk', href: '/mutasi' },
          { label: JENIS_LABEL[mutasi.jenisMutasi] || mutasi.jenisMutasi },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/mutasi')}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        }
      />

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Informasi Mutasi</CardTitle>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${JENIS_COLOR[mutasi.jenisMutasi] || ''}`}>
                {JENIS_LABEL[mutasi.jenisMutasi] || mutasi.jenisMutasi}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <InfoRow label="Tanggal Mutasi" value={formatDate(mutasi.tanggalMutasi)} />
            <InfoRow label="Keterangan" value={mutasi.keterangan} />
            <InfoRow label="Dicatat Oleh" value={mutasi.createdBy?.namaLengkap} />
            <InfoRow label="Dicatat Pada" value={formatDate(mutasi.createdAt)} />
          </CardContent>
        </Card>

        {mutasi.penduduk && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Penduduk</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Nama Lengkap" value={
                <Link to={`/penduduk/${mutasi.penduduk.id}`} className="text-blue-600 hover:underline">
                  {mutasi.penduduk.namaLengkap}
                </Link>
              } />
              <InfoRow label="NIK" value={mutasi.penduduk.nik} />
              <InfoRow label="Tanggal Lahir" value={formatDate(mutasi.penduduk.tanggalLahir)} />
              <InfoRow label="Jenis Kelamin" value={mutasi.penduduk.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} />
              <InfoRow label="Agama" value={mutasi.penduduk.agama} />
            </CardContent>
          </Card>
        )}

        {(mutasi.alamatTujuan || mutasi.alasanPindah) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Pindah</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Alamat Tujuan" value={mutasi.alamatTujuan} />
              <InfoRow label="Alasan Pindah" value={mutasi.alasanPindah} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MutasiDetailPage;
