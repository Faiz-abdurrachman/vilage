import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, User, Home, BookOpen, Users } from 'lucide-react';
import { usePendudukDetail } from '@/hooks/usePenduduk';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, hitungUmur } from '@/lib/utils';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value || '-'}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PendudukDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: penduduk, isLoading } = usePendudukDetail(id);

  useEffect(() => {
    document.title = penduduk ? `${penduduk.namaLengkap} | SIDESA` : 'Detail Penduduk | SIDESA';
  }, [penduduk]);

  if (isLoading) return <PageLoader />;
  if (!penduduk) return (
    <div className="text-center py-16 text-slate-500">Data penduduk tidak ditemukan.</div>
  );

  const canEdit = ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role) && penduduk.statusPenduduk === 'AKTIF';

  return (
    <div>
      <PageHeader
        title="Detail Penduduk"
        breadcrumbs={[
          { label: 'Data Penduduk', href: '/penduduk' },
          { label: penduduk.namaLengkap },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/penduduk')}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            {canEdit && (
              <Button size="sm" asChild>
                <Link to={`/penduduk/${id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Edit Data
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {/* Status banner */}
      {penduduk.statusPenduduk !== 'AKTIF' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
          <StatusBadge status={penduduk.statusPenduduk} type="penduduk" />
          <span className="text-sm text-orange-700">
            Penduduk ini tidak aktif dan tidak dapat diedit.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Avatar + Quick Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">{penduduk.namaLengkap}</h2>
                <p className="text-sm text-slate-500 font-mono">{penduduk.nik}</p>
              </div>
              <StatusBadge status={penduduk.statusPenduduk} type="penduduk" />
              <div className="w-full pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Umur</span>
                  <span className="font-medium">{hitungUmur(penduduk.tanggalLahir)} tahun</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Jenis Kelamin</span>
                  <span className="font-medium">
                    {penduduk.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Agama</span>
                  <span className="font-medium">{penduduk.agama}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {penduduk.kartuKeluarga && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-600" />
                  Kartu Keluarga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm font-mono font-medium">{penduduk.kartuKeluarga.noKk}</p>
                <p className="text-xs text-slate-500">{penduduk.kartuKeluarga.alamat}</p>
                <p className="text-xs text-slate-500">
                  RT {penduduk.kartuKeluarga.rt}/RW {penduduk.kartuKeluarga.rw} — {penduduk.kartuKeluarga.dusun}
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    {penduduk.statusDalamKK?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs" asChild>
                  <Link to={`/kartu-keluarga/${penduduk.kartuKeluarga.id}`}>
                    Lihat Detail KK
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Detail Info */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Data Pribadi" icon={User}>
            <InfoRow label="NIK" value={penduduk.nik} />
            <InfoRow label="Nama Lengkap" value={penduduk.namaLengkap} />
            <InfoRow label="Tempat Lahir" value={penduduk.tempatLahir} />
            <InfoRow label="Tanggal Lahir" value={formatDate(penduduk.tanggalLahir)} />
            <InfoRow label="Jenis Kelamin" value={penduduk.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} />
            <InfoRow label="Golongan Darah" value={penduduk.golonganDarah === 'TIDAK_TAHU' ? 'Tidak Diketahui' : penduduk.golonganDarah} />
            <InfoRow label="Kewarganegaraan" value={penduduk.kewarganegaraan} />
          </SectionCard>

          <SectionCard title="Alamat" icon={Home}>
            <InfoRow label="Alamat Lengkap" value={penduduk.alamat} />
            <InfoRow label="RT" value={penduduk.rt} />
            <InfoRow label="RW" value={penduduk.rw} />
          </SectionCard>

          <SectionCard title="Data Kependudukan" icon={BookOpen}>
            <InfoRow label="Agama" value={penduduk.agama} />
            <InfoRow label="Status Perkawinan" value={penduduk.statusPerkawinan?.replace(/_/g, ' ')} />
            <InfoRow label="Pekerjaan" value={penduduk.pekerjaan} />
            <InfoRow label="Pendidikan Terakhir" value={penduduk.pendidikanTerakhir} />
          </SectionCard>

          <SectionCard title="Data Keluarga" icon={Users}>
            <InfoRow label="Nama Ayah" value={penduduk.namaAyah} />
            <InfoRow label="Nama Ibu" value={penduduk.namaIbu} />
            <InfoRow label="Status dalam KK" value={penduduk.statusDalamKK?.replace(/_/g, ' ')} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default PendudukDetailPage;
