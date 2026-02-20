import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Save, ArrowLeft, ChevronRight, Check, FileText, User, Send,
} from 'lucide-react';
import api from '@/lib/axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ── Constants ────────────────────────────────────────────────────────

const JENIS_SURAT_OPTIONS = [
  { value: 'SK_DOMISILI',    label: 'SKD — Surat Keterangan Domisili',      desc: 'Surat bukti domisili warga di desa.' },
  { value: 'SKTM',           label: 'SKTM — Surat Keterangan Tidak Mampu',  desc: 'Untuk keperluan bantuan sosial & beasiswa.' },
  { value: 'SK_USAHA',       label: 'SKU — Surat Keterangan Usaha',         desc: 'Surat bukti kepemilikan usaha di desa.' },
  { value: 'SK_KELAHIRAN',   label: 'SKL — Surat Keterangan Kelahiran',     desc: 'Pencatatan kelahiran warga desa.' },
  { value: 'SK_KEMATIAN',    label: 'SKK — Surat Keterangan Kematian',      desc: 'Pencatatan kematian warga desa.' },
  { value: 'SURAT_PENGANTAR',label: 'SP — Surat Pengantar',                 desc: 'Surat pengantar untuk berbagai keperluan.' },
];

const STEPS = [
  { number: 1, label: 'Jenis Surat' },
  { number: 2, label: 'Data Permohonan' },
  { number: 3, label: 'Konfirmasi' },
];

// ── Shared Small Components ──────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, idx) => {
        const done   = currentStep > step.number;
        const active = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                done   ? 'bg-emerald-500 text-white' :
                active ? 'bg-blue-600 text-white' :
                         'bg-slate-200 text-slate-500'
              )}>
                {done ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span className={cn(
                'mt-1.5 text-[11px] font-medium whitespace-nowrap',
                active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2 mb-5 transition-colors',
                currentStep > step.number ? 'bg-blue-500' : 'bg-slate-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {hint  && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="text-xs font-medium text-slate-500 w-40 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 flex-1">{value || '—'}</span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

function SuratFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    jenisSurat:   '',
    pendudukId:   '',
    perihal:      '',
    dataTambahan: {},
  });

  useEffect(() => { document.title = 'Buat Surat | SIDESA'; }, []);

  // ── Fetch penduduk aktif ──────────────────────────────────────────
  const { data: pendudukList = [] } = useQuery({
    queryKey: ['penduduk-aktif-form'],
    queryFn: async () => {
      const res = await api.get('/penduduk', { params: { status: 'AKTIF', limit: 200 } });
      return res.data?.data || [];
    },
    staleTime: 60000,
  });

  const pendudukOptions = pendudukList.map((p) => ({
    value:  p.id,
    label:  `${p.namaLengkap} — ${p.nik}`,
    nama:   p.namaLengkap,
    nik:    p.nik,
    alamat: p.alamat ? `RT ${p.rt || '-'}/${p.rw || '-'}, ${p.alamat}` : '-',
  }));

  const selectedJenis    = JENIS_SURAT_OPTIONS.find((o) => o.value === formData.jenisSurat);
  const selectedPenduduk = pendudukOptions.find((o) => o.value === formData.pendudukId);

  // ── Form helpers ─────────────────────────────────────────────────
  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateTambahan = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dataTambahan: { ...prev.dataTambahan, [field]: value },
    }));
    setFieldErrors((prev) => ({ ...prev, [`dt_${field}`]: undefined }));
  };

  // ── Validation per step ──────────────────────────────────────────
  const validateStep = (stepNum) => {
    const errs = {};

    if (stepNum === 1) {
      if (!formData.jenisSurat) errs.jenisSurat = 'Jenis surat wajib dipilih';
    }

    if (stepNum === 2) {
      if (!formData.pendudukId)        errs.pendudukId = 'Pilih penduduk pemohon';
      if (!formData.perihal?.trim())   errs.perihal    = 'Keperluan / perihal wajib diisi';

      const dt = formData.dataTambahan || {};
      if (formData.jenisSurat === 'SK_USAHA') {
        if (!dt.namaUsaha)  errs.dt_namaUsaha  = 'Nama usaha wajib diisi';
        if (!dt.jenisUsaha) errs.dt_jenisUsaha = 'Jenis usaha wajib diisi';
      }
      if (formData.jenisSurat === 'SK_KELAHIRAN') {
        if (!dt.namaBayi) errs.dt_namaBayi = 'Nama bayi wajib diisi';
        if (!dt.namaAyah) errs.dt_namaAyah = 'Nama ayah wajib diisi';
        if (!dt.namaIbu)  errs.dt_namaIbu  = 'Nama ibu wajib diisi';
      }
      if (formData.jenisSurat === 'SK_KEMATIAN') {
        if (!dt.tanggalMeninggal) errs.dt_tanggalMeninggal = 'Tanggal meninggal wajib diisi';
      }
      if (formData.jenisSurat === 'SURAT_PENGANTAR') {
        if (!dt.tujuan) errs.dt_tujuan = 'Tujuan surat wajib diisi';
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Navigation ───────────────────────────────────────────────────
  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setFieldErrors({});
  };

  // ── Submit ───────────────────────────────────────────────────────
  // submitMode: 'DRAFT' | 'MENUNGGU'
  const handleSubmit = async (submitMode) => {
    setIsSubmitting(true);
    try {
      const payload = {
        jenisSurat:   formData.jenisSurat,
        pendudukId:   formData.pendudukId,
        perihal:      formData.perihal,
        dataTambahan: formData.dataTambahan || {},
      };

      // 1) Create surat (always DRAFT)
      const createRes = await api.post('/surat', payload);
      const newSurat  = createRes.data?.data;
      const newId     = newSurat?.id;

      // 2) If requested, submit immediately
      if (submitMode === 'MENUNGGU' && newId) {
        await api.patch(`/surat/${newId}/submit`);
      }

      queryClient.invalidateQueries({ queryKey: ['surat'] });

      toast({
        title: 'Berhasil!',
        description: submitMode === 'MENUNGGU'
          ? 'Permohonan surat telah diajukan dan menunggu persetujuan.'
          : 'Draft surat berhasil disimpan.',
        variant: 'success',
      });

      navigate(newId ? `/surat/${newId}` : '/surat');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      toast({ title: 'Gagal', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Buat Permohonan Surat"
        breadcrumbs={[{ label: 'Permohonan Surat', href: '/surat' }, { label: 'Buat Surat' }]}
      />

      <div className="max-w-2xl">
        <StepIndicator currentStep={step} />

        {/* ══ STEP 1: Pilih Jenis Surat ══════════════════════════════ */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                Pilih Jenis Surat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Jenis Surat" required error={fieldErrors.jenisSurat}>
                <Select
                  value={formData.jenisSurat}
                  onValueChange={(v) => updateForm('jenisSurat', v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih jenis surat yang dibutuhkan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_SURAT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {selectedJenis && (
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">{selectedJenis.label}</p>
                    <p className="text-sm text-blue-600 mt-0.5">{selectedJenis.desc}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ══ STEP 2: Data Permohonan ════════════════════════════════ */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                Data Permohonan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Penduduk Pemohon */}
              <Field label="Penduduk Pemohon" required error={fieldErrors.pendudukId}>
                <Select
                  value={formData.pendudukId}
                  onValueChange={(v) => updateForm('pendudukId', v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih penduduk pemohon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pendudukOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Preview penduduk terpilih */}
              {selectedPenduduk && (
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-800">{selectedPenduduk.nama}</p>
                    <p>NIK: <span className="font-mono">{selectedPenduduk.nik}</span></p>
                    <p>Alamat: {selectedPenduduk.alamat}</p>
                  </div>
                </div>
              )}

              {/* Perihal */}
              <Field
                label="Keperluan / Perihal"
                required
                error={fieldErrors.perihal}
                hint="Jelaskan secara singkat tujuan pembuatan surat."
              >
                <Input
                  className="h-11"
                  placeholder="contoh: Keperluan melamar pekerjaan"
                  value={formData.perihal}
                  onChange={(e) => updateForm('perihal', e.target.value)}
                />
              </Field>

              {/* ── SKTM ── */}
              {formData.jenisSurat === 'SKTM' && (
                <Field label="Penghasilan Per Bulan (Rp)" hint="Isi dengan angka, tanpa titik atau koma.">
                  <Input
                    type="number"
                    className="h-11"
                    placeholder="contoh: 1500000"
                    value={formData.dataTambahan?.penghasilan || ''}
                    onChange={(e) => updateTambahan('penghasilan', e.target.value)}
                  />
                </Field>
              )}

              {/* ── SK_USAHA ── */}
              {formData.jenisSurat === 'SK_USAHA' && (
                <>
                  <Field label="Nama Usaha" required error={fieldErrors.dt_namaUsaha}>
                    <Input className="h-11" placeholder="Nama usaha"
                      value={formData.dataTambahan?.namaUsaha || ''}
                      onChange={(e) => updateTambahan('namaUsaha', e.target.value)} />
                  </Field>
                  <Field label="Jenis Usaha" required error={fieldErrors.dt_jenisUsaha}>
                    <Input className="h-11" placeholder="contoh: Warung Kelontong, Bengkel, dll."
                      value={formData.dataTambahan?.jenisUsaha || ''}
                      onChange={(e) => updateTambahan('jenisUsaha', e.target.value)} />
                  </Field>
                  <Field label="Alamat Usaha">
                    <Input className="h-11" placeholder="Alamat usaha"
                      value={formData.dataTambahan?.alamatUsaha || ''}
                      onChange={(e) => updateTambahan('alamatUsaha', e.target.value)} />
                  </Field>
                  <Field label="Tahun Berdiri">
                    <Input type="number" className="h-11" placeholder="contoh: 2018"
                      value={formData.dataTambahan?.tahunBerdiri || ''}
                      onChange={(e) => updateTambahan('tahunBerdiri', e.target.value)} />
                  </Field>
                </>
              )}

              {/* ── SK_KELAHIRAN ── */}
              {formData.jenisSurat === 'SK_KELAHIRAN' && (
                <>
                  <Field label="Nama Bayi" required error={fieldErrors.dt_namaBayi}>
                    <Input className="h-11" placeholder="Nama lengkap bayi"
                      value={formData.dataTambahan?.namaBayi || ''}
                      onChange={(e) => updateTambahan('namaBayi', e.target.value)} />
                  </Field>
                  <Field label="Jenis Kelamin Bayi">
                    <Select
                      value={formData.dataTambahan?.jenisKelaminBayi || ''}
                      onValueChange={(v) => updateTambahan('jenisKelaminBayi', v)}
                    >
                      <SelectTrigger className="h-11"><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                        <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Tanggal Lahir">
                      <Input type="date" className="h-11"
                        value={formData.dataTambahan?.tanggalLahir || ''}
                        onChange={(e) => updateTambahan('tanggalLahir', e.target.value)} />
                    </Field>
                    <Field label="Anak Ke">
                      <Input type="number" className="h-11" placeholder="1"
                        value={formData.dataTambahan?.anakKe || ''}
                        onChange={(e) => updateTambahan('anakKe', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Tempat Lahir">
                    <Input className="h-11" placeholder="contoh: Kotamobagu"
                      value={formData.dataTambahan?.tempatLahir || ''}
                      onChange={(e) => updateTambahan('tempatLahir', e.target.value)} />
                  </Field>
                  <Field label="Nama Ayah" required error={fieldErrors.dt_namaAyah}>
                    <Input className="h-11" placeholder="Nama lengkap ayah"
                      value={formData.dataTambahan?.namaAyah || ''}
                      onChange={(e) => updateTambahan('namaAyah', e.target.value)} />
                  </Field>
                  <Field label="Nama Ibu" required error={fieldErrors.dt_namaIbu}>
                    <Input className="h-11" placeholder="Nama lengkap ibu"
                      value={formData.dataTambahan?.namaIbu || ''}
                      onChange={(e) => updateTambahan('namaIbu', e.target.value)} />
                  </Field>
                </>
              )}

              {/* ── SK_KEMATIAN ── */}
              {formData.jenisSurat === 'SK_KEMATIAN' && (
                <>
                  <Field label="Tanggal Meninggal" required error={fieldErrors.dt_tanggalMeninggal}>
                    <Input type="date" className="h-11"
                      value={formData.dataTambahan?.tanggalMeninggal || ''}
                      onChange={(e) => updateTambahan('tanggalMeninggal', e.target.value)} />
                  </Field>
                  <Field label="Tempat Meninggal">
                    <Input className="h-11" placeholder="contoh: RS Kotamobagu"
                      value={formData.dataTambahan?.tempatMeninggal || ''}
                      onChange={(e) => updateTambahan('tempatMeninggal', e.target.value)} />
                  </Field>
                  <Field label="Penyebab">
                    <Input className="h-11" placeholder="Penyebab meninggal"
                      value={formData.dataTambahan?.penyebab || ''}
                      onChange={(e) => updateTambahan('penyebab', e.target.value)} />
                  </Field>
                </>
              )}

              {/* ── SURAT_PENGANTAR ── */}
              {formData.jenisSurat === 'SURAT_PENGANTAR' && (
                <Field label="Ditujukan Kepada" required error={fieldErrors.dt_tujuan}>
                  <Input className="h-11" placeholder="contoh: Disdukcapil Kota Kotamobagu"
                    value={formData.dataTambahan?.tujuan || ''}
                    onChange={(e) => updateTambahan('tujuan', e.target.value)} />
                </Field>
              )}

              {/* Keterangan Tambahan — semua jenis */}
              <Field label="Keterangan Tambahan">
                <Textarea
                  placeholder="Keterangan atau catatan tambahan (opsional)..."
                  rows={3}
                  value={formData.dataTambahan?.keterangan || ''}
                  onChange={(e) => updateTambahan('keterangan', e.target.value)}
                />
              </Field>
            </CardContent>
          </Card>
        )}

        {/* ══ STEP 3: Konfirmasi ════════════════════════════════════ */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">3</span>
                Konfirmasi Permohonan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-5">
                Periksa kembali data sebelum mengirim permohonan.
              </p>

              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden mb-5">
                <InfoRow label="Jenis Surat"       value={selectedJenis?.label} />
                <InfoRow label="Pemohon"            value={selectedPenduduk ? `${selectedPenduduk.nama} (${selectedPenduduk.nik})` : undefined} />
                <InfoRow label="Keperluan / Perihal" value={formData.perihal} />

                {/* SKTM */}
                {formData.jenisSurat === 'SKTM' && formData.dataTambahan?.penghasilan && (
                  <InfoRow label="Penghasilan/Bulan"
                    value={`Rp ${Number(formData.dataTambahan.penghasilan).toLocaleString('id-ID')}`} />
                )}

                {/* SK_USAHA */}
                {formData.jenisSurat === 'SK_USAHA' && (
                  <>
                    {formData.dataTambahan?.namaUsaha   && <InfoRow label="Nama Usaha"   value={formData.dataTambahan.namaUsaha} />}
                    {formData.dataTambahan?.jenisUsaha  && <InfoRow label="Jenis Usaha"  value={formData.dataTambahan.jenisUsaha} />}
                    {formData.dataTambahan?.alamatUsaha && <InfoRow label="Alamat Usaha" value={formData.dataTambahan.alamatUsaha} />}
                    {formData.dataTambahan?.tahunBerdiri && <InfoRow label="Tahun Berdiri" value={formData.dataTambahan.tahunBerdiri} />}
                  </>
                )}

                {/* SK_KELAHIRAN */}
                {formData.jenisSurat === 'SK_KELAHIRAN' && (
                  <>
                    {formData.dataTambahan?.namaBayi && <InfoRow label="Nama Bayi" value={formData.dataTambahan.namaBayi} />}
                    {formData.dataTambahan?.jenisKelaminBayi && (
                      <InfoRow label="JK Bayi" value={formData.dataTambahan.jenisKelaminBayi === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} />
                    )}
                    {formData.dataTambahan?.tanggalLahir && <InfoRow label="Tanggal Lahir" value={formData.dataTambahan.tanggalLahir} />}
                    {formData.dataTambahan?.tempatLahir  && <InfoRow label="Tempat Lahir"  value={formData.dataTambahan.tempatLahir} />}
                    {formData.dataTambahan?.anakKe       && <InfoRow label="Anak Ke"        value={formData.dataTambahan.anakKe} />}
                    {formData.dataTambahan?.namaAyah     && <InfoRow label="Nama Ayah"      value={formData.dataTambahan.namaAyah} />}
                    {formData.dataTambahan?.namaIbu      && <InfoRow label="Nama Ibu"       value={formData.dataTambahan.namaIbu} />}
                  </>
                )}

                {/* SK_KEMATIAN */}
                {formData.jenisSurat === 'SK_KEMATIAN' && (
                  <>
                    {formData.dataTambahan?.tanggalMeninggal && <InfoRow label="Tanggal Meninggal" value={formData.dataTambahan.tanggalMeninggal} />}
                    {formData.dataTambahan?.tempatMeninggal  && <InfoRow label="Tempat Meninggal"  value={formData.dataTambahan.tempatMeninggal} />}
                    {formData.dataTambahan?.penyebab         && <InfoRow label="Penyebab"           value={formData.dataTambahan.penyebab} />}
                  </>
                )}

                {/* SURAT_PENGANTAR */}
                {formData.jenisSurat === 'SURAT_PENGANTAR' && formData.dataTambahan?.tujuan && (
                  <InfoRow label="Ditujukan Kepada" value={formData.dataTambahan.tujuan} />
                )}

                {formData.dataTambahan?.keterangan && (
                  <InfoRow label="Keterangan" value={formData.dataTambahan.keterangan} />
                )}
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚠</span>
                <p className="text-xs text-amber-700">
                  Setelah dikirim, permohonan akan diproses oleh petugas desa. Pastikan semua data sudah benar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Navigation Buttons ──────────────────────────────────── */}
        <div className="flex gap-3 mt-6">
          {step === 1 && (
            <>
              <Button type="button" variant="outline" onClick={() => navigate('/surat')}>
                <ArrowLeft className="h-4 w-4" />
                Batal
              </Button>
              <Button type="button" onClick={handleNext}>
                Lanjut <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button type="button" onClick={handleNext}>
                Lanjut <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit('DRAFT')}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit('MENUNGGU')}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Mengajukan...' : 'Ajukan Surat'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuratFormPage;
