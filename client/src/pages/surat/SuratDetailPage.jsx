import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Send, Download } from 'lucide-react';
import { useSuratDetail, useSubmitSurat, useApproveSurat, useRejectSurat } from '@/hooks/useSurat';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/axios';

const JENIS_LABEL = {
  SKD: 'Surat Keterangan Domisili',
  SKCK: 'Surat Keterangan Catatan Kepolisian',
  SKU: 'Surat Keterangan Usaha',
  SKL: 'Surat Keterangan Lahir',
  SKM: 'Surat Keterangan Meninggal',
  SKTM: 'Surat Keterangan Tidak Mampu',
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value || '-'}</span>
    </div>
  );
}

function SuratDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: surat, isLoading } = useSuratDetail(id);
  const submitMutation = useSubmitSurat();
  const approveMutation = useApproveSurat();
  const rejectMutation = useRejectSurat();

  if (isLoading) return <PageLoader />;
  if (!surat) return <div className="text-center py-16 text-slate-500">Data surat tidak ditemukan.</div>;

  const canSubmit = surat.status === 'DRAFT' && ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role);
  const canApproveReject = surat.status === 'DIAJUKAN' && ['ADMIN', 'KADES'].includes(user?.role);

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync(id);
      toast({ title: 'Berhasil', description: 'Surat berhasil diajukan.', variant: 'success' });
      setShowSubmitDialog(false);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal.', variant: 'destructive' });
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(id);
      toast({ title: 'Berhasil', description: 'Surat berhasil disetujui dan nomor surat diterbitkan.', variant: 'success' });
      setShowApproveDialog(false);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal.', variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({ title: 'Perhatian', description: 'Alasan penolakan wajib diisi.', variant: 'destructive' });
      return;
    }
    try {
      await rejectMutation.mutateAsync({ id, rejectedReason: rejectReason });
      toast({ title: 'Berhasil', description: 'Surat telah ditolak.', variant: 'success' });
      setShowRejectDialog(false);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal.', variant: 'destructive' });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await api.get(`/surat/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `surat-${surat.nomorSurat?.replace(/\//g, '-') || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Gagal', description: 'Gagal mengunduh PDF.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Detail Surat"
        breadcrumbs={[
          { label: 'Permohonan Surat', href: '/surat' },
          { label: surat.nomorSurat || 'Detail' },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/surat')}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            {surat.status === 'DISETUJUI' && (
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4" />
                Unduh PDF
              </Button>
            )}
            {canSubmit && (
              <Button size="sm" onClick={() => setShowSubmitDialog(true)}>
                <Send className="h-4 w-4" />
                Ajukan Surat
              </Button>
            )}
            {canApproveReject && (
              <>
                <Button variant="destructive" size="sm" onClick={() => setShowRejectDialog(true)}>
                  <XCircle className="h-4 w-4" />
                  Tolak
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowApproveDialog(true)}>
                  <CheckCircle className="h-4 w-4" />
                  Setujui
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="max-w-2xl space-y-4">
        {/* Status Banner */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-600">Status:</span>
          <StatusBadge status={surat.status} type="surat" />
          {surat.nomorSurat && (
            <span className="ml-auto font-mono text-sm font-semibold text-slate-800">{surat.nomorSurat}</span>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Jenis Surat" value={`${surat.jenisSurat} — ${JENIS_LABEL[surat.jenisSurat]}`} />
            <InfoRow label="Nomor Surat" value={surat.nomorSurat} />
            <InfoRow label="Tanggal Pengajuan" value={formatDate(surat.tanggalPengajuan)} />
            <InfoRow label="Tanggal Terbit" value={formatDate(surat.tanggalTerbit)} />
            <InfoRow label="Keperluan" value={surat.keperluan} />
            <InfoRow label="Keterangan" value={surat.keterangan} />
            {surat.rejectedReason && (
              <InfoRow label="Alasan Penolakan" value={
                <span className="text-red-600">{surat.rejectedReason}</span>
              } />
            )}
          </CardContent>
        </Card>

        {surat.penduduk && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Pemohon</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Nama Lengkap" value={
                <Link to={`/penduduk/${surat.penduduk.id}`} className="text-blue-600 hover:underline">
                  {surat.penduduk.namaLengkap}
                </Link>
              } />
              <InfoRow label="NIK" value={surat.penduduk.nik} />
              <InfoRow label="Alamat" value={surat.penduduk.alamat} />
              <InfoRow label="RT / RW" value={`${surat.penduduk.rt} / ${surat.penduduk.rw}`} />
              <InfoRow label="Pekerjaan" value={surat.penduduk.pekerjaan} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Riwayat</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Dibuat Oleh" value={surat.createdBy?.namaLengkap} />
            <InfoRow label="Dibuat Pada" value={formatDate(surat.createdAt)} />
            {surat.approvedBy && (
              <InfoRow label="Disetujui/Ditolak Oleh" value={surat.approvedBy?.namaLengkap} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Dialog */}
      <ConfirmDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
        title="Ajukan Surat"
        description="Surat akan diajukan untuk persetujuan. Lanjutkan?"
        isLoading={submitMutation.isPending}
      />

      {/* Approve Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Setujui Surat"
        description="Surat akan disetujui dan nomor surat akan diterbitkan otomatis. Lanjutkan?"
        isLoading={approveMutation.isPending}
      />

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Tolak Surat</h3>
            <p className="text-sm text-slate-500 mb-4">Berikan alasan penolakan.</p>
            <div className="space-y-2 mb-6">
              <Label>Alasan Penolakan <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Tuliskan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Batal</Button>
              <Button
                variant="destructive"
                disabled={rejectMutation.isPending}
                onClick={handleReject}
              >
                {rejectMutation.isPending ? 'Memproses...' : 'Tolak Surat'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuratDetailPage;
