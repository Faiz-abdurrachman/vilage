import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Send, Download, FileText } from 'lucide-react';
import { useSuratDetail, useSubmitSurat, useApproveSurat, useRejectSurat } from '@/hooks/useSurat';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

const JENIS_LABEL = {
  SK_DOMISILI: 'Surat Keterangan Domisili',
  SKTM: 'Surat Keterangan Tidak Mampu',
  SK_USAHA: 'Surat Keterangan Usaha',
  SK_KELAHIRAN: 'Surat Keterangan Kelahiran',
  SK_KEMATIAN: 'Surat Keterangan Kematian',
  SURAT_PENGANTAR: 'Surat Pengantar',
};

const STATUS_ORDER = ['DRAFT', 'MENUNGGU', 'DISETUJUI'];

function InfoRow({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
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

  useEffect(() => {
    document.title = surat ? `${JENIS_LABEL[surat.jenisSurat] || 'Surat'} | SIDESA` : 'Detail Surat | SIDESA';
  }, [surat]);

  if (isLoading) return <PageLoader />;
  if (!surat) return <div className="text-center py-16 text-slate-500">Data surat tidak ditemukan.</div>;

  const canSubmit = surat.status === 'DRAFT' && ['ADMIN', 'SEKDES', 'OPERATOR'].includes(user?.role);
  const canApproveReject = surat.status === 'MENUNGGU' && ['ADMIN', 'KADES'].includes(user?.role);

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

  // Build timeline
  const isDitolak = surat.status === 'DITOLAK';
  const timelineSteps = isDitolak
    ? [
        { key: 'DRAFT', label: 'Draft', done: true },
        { key: 'MENUNGGU', label: 'Diajukan', done: true },
        { key: 'DITOLAK', label: 'Ditolak', done: true, isRejected: true },
      ]
    : STATUS_ORDER.map((s) => ({
        key: s,
        label: s === 'DRAFT' ? 'Draft' : s === 'MENUNGGU' ? 'Diajukan' : 'Disetujui',
        done: STATUS_ORDER.indexOf(s) <= STATUS_ORDER.indexOf(surat.status),
        isCurrent: s === surat.status,
      }));

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Detail Surat"
        breadcrumbs={[
          { label: 'Surat Keterangan', href: '/surat' },
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
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowApproveDialog(true)}>
                  <CheckCircle className="h-4 w-4" />
                  Setujui
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Timeline status */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Status Pengajuan</p>
        <div className="flex items-center">
          {timelineSteps.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  step.isRejected
                    ? 'bg-red-100 text-red-600 ring-2 ring-red-200'
                    : step.isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : step.done
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                )}>
                  {step.isRejected ? '✕' : step.done ? '✓' : i + 1}
                </div>
                <p className={cn(
                  'mt-1.5 text-[10px] font-medium text-center whitespace-nowrap',
                  step.isRejected ? 'text-red-600' : step.done ? 'text-slate-700' : 'text-slate-400'
                )}>
                  {step.label}
                </p>
              </div>
              {i < timelineSteps.length - 1 && (
                <div className={cn(
                  'mx-2 h-0.5 flex-1 mb-5',
                  step.done ? 'bg-emerald-200' : 'bg-slate-100'
                )} />
              )}
            </div>
          ))}
        </div>
        {surat.nomorSurat && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-emerald-600" />
            <span className="text-slate-500">Nomor Surat:</span>
            <span className="font-mono font-semibold text-slate-800">{surat.nomorSurat}</span>
          </div>
        )}
      </div>

      {/* Info surat */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Informasi Surat
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <InfoRow label="Jenis Surat" value={JENIS_LABEL[surat.jenisSurat] || surat.jenisSurat} />
          <InfoRow label="Status" value={<StatusBadge status={surat.status} type="surat" />} />
          <InfoRow label="Perihal" value={surat.perihal} />
          <InfoRow label="Tanggal Dibuat" value={formatDate(surat.createdAt)} />
          {surat.approvedAt && <InfoRow label="Tanggal Disetujui" value={formatDate(surat.approvedAt)} />}
          {surat.rejectedReason && (
            <div className="col-span-2">
              <InfoRow label="Alasan Penolakan" value={
                <span className="text-red-600">{surat.rejectedReason}</span>
              } />
            </div>
          )}
        </div>
      </div>

      {/* Data pemohon */}
      {surat.penduduk && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Data Pemohon
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <InfoRow label="Nama Lengkap" value={
              <Link to={`/penduduk/${surat.penduduk.id}`} className="text-blue-600 hover:underline">
                {surat.penduduk.namaLengkap}
              </Link>
            } />
            <InfoRow label="NIK" value={
              <span className="font-mono">{surat.penduduk.nik}</span>
            } />
            {surat.penduduk.alamat && (
              <InfoRow label="Alamat" value={`RT ${surat.penduduk.rt}/${surat.penduduk.rw}, ${surat.penduduk.alamat}`} />
            )}
            <InfoRow label="Pekerjaan" value={surat.penduduk.pekerjaan} />
          </div>
        </div>
      )}

      {/* Riwayat */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Riwayat
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <InfoRow label="Dibuat Oleh" value={surat.createdBy?.namaLengkap} />
          <InfoRow label="Dibuat Pada" value={formatDate(surat.createdAt)} />
          {surat.approvedBy && (
            <InfoRow label="Disetujui/Ditolak Oleh" value={surat.approvedBy?.namaLengkap} />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
        title="Ajukan Surat"
        description="Surat akan diajukan untuk persetujuan Kepala Desa. Lanjutkan?"
        isLoading={submitMutation.isPending}
      />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Tolak Surat
            </h3>
            <p className="text-sm text-slate-500 mb-5">Berikan alasan penolakan yang jelas.</p>
            <div className="space-y-2 mb-6">
              <Label className="text-sm font-medium text-slate-700">
                Alasan Penolakan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Tuliskan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowRejectDialog(false)}>Batal</Button>
              <Button
                variant="destructive"
                className="rounded-xl"
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
