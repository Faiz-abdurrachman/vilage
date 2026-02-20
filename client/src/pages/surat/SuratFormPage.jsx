import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, ChevronRight, Check, FileText } from 'lucide-react';
import { useCreateSurat } from '@/hooks/useSurat';
import { usePendudukList } from '@/hooks/usePenduduk';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const JENIS_SURAT_OPTIONS = [
  { value: 'SK_DOMISILI', label: 'SKD — Surat Keterangan Domisili', desc: 'Surat bukti domisili warga di desa.' },
  { value: 'SKTM', label: 'SKTM — Surat Keterangan Tidak Mampu', desc: 'Surat untuk keperluan bantuan sosial & beasiswa.' },
  { value: 'SK_USAHA', label: 'SKU — Surat Keterangan Usaha', desc: 'Surat bukti memiliki usaha di wilayah desa.' },
  { value: 'SK_KELAHIRAN', label: 'SKL — Surat Keterangan Kelahiran', desc: 'Pencatatan kelahiran warga desa.' },
  { value: 'SK_KEMATIAN', label: 'SKK — Surat Keterangan Kematian', desc: 'Pencatatan kematian warga desa.' },
  { value: 'SURAT_PENGANTAR', label: 'SP — Surat Pengantar', desc: 'Surat pengantar untuk berbagai keperluan.' },
];

const schema = z.object({
  jenisSurat: z.enum(['SK_DOMISILI', 'SKTM', 'SK_USAHA', 'SK_KELAHIRAN', 'SK_KEMATIAN', 'SURAT_PENGANTAR'], {
    required_error: 'Jenis surat wajib dipilih',
  }),
  pendudukId: z.string().min(1, 'Pilih penduduk pemohon'),
  perihal: z.string().min(1, 'Keperluan wajib diisi'),
  dataTambahan: z.record(z.unknown()).optional(),
});

const STEPS = [
  { number: 1, label: 'Jenis Surat' },
  { number: 2, label: 'Data Permohonan' },
  { number: 3, label: 'Konfirmasi' },
];

function FormField({ label, error, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, idx) => {
        const done = currentStep > step.number;
        const active = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="text-xs font-medium text-slate-500 w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 flex-1">{value}</span>
    </div>
  );
}

function SuratFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  useEffect(() => { document.title = 'Buat Surat | SIDESA'; }, []);

  const createMutation = useCreateSurat();
  const { data: pendudukData } = usePendudukList({ limit: 200, status: 'AKTIF' });

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const jenisSurat = watch('jenisSurat');
  const pendudukId = watch('pendudukId');
  const perihal = watch('perihal');
  const dataTambahan = watch('dataTambahan');

  const pendudukOptions = (pendudukData?.data || []).map((p) => ({
    value: p.id,
    label: `${p.namaLengkap} — ${p.nik}`,
    nama: p.namaLengkap,
  }));

  const selectedJenis = JENIS_SURAT_OPTIONS.find((o) => o.value === jenisSurat);
  const selectedPenduduk = pendudukOptions.find((o) => o.value === pendudukId);

  const handleNext = async () => {
    let valid = false;
    if (step === 1) valid = await trigger('jenisSurat');
    if (step === 2) valid = await trigger(['pendudukId', 'perihal']);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: 'Berhasil', description: 'Permohonan surat berhasil dibuat.', variant: 'success' });
      navigate('/surat');
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Buat Permohonan Surat"
        breadcrumbs={[{ label: 'Permohonan Surat', href: '/surat' }, { label: 'Buat Surat' }]}
      />

      <div className="max-w-2xl">
        <StepIndicator currentStep={step} />

        {/* ── STEP 1: Pilih Jenis Surat ── */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                Pilih Jenis Surat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Jenis Surat" error={errors.jenisSurat?.message} required>
                <Select
                  value={watch('jenisSurat') || ''}
                  onValueChange={(v) => setValue('jenisSurat', v, { shouldValidate: true })}
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
              </FormField>

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

        {/* ── STEP 2: Data Permohonan ── */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                Data Permohonan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Penduduk Pemohon" error={errors.pendudukId?.message} required>
                <Select
                  value={watch('pendudukId') || ''}
                  onValueChange={(v) => setValue('pendudukId', v, { shouldValidate: true })}
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
              </FormField>

              <FormField label="Keperluan / Perihal" error={errors.perihal?.message} required hint="Jelaskan secara singkat tujuan pembuatan surat.">
                <Input
                  className="h-11"
                  placeholder="contoh: Keperluan melamar pekerjaan"
                  {...register('perihal')}
                />
              </FormField>

              {jenisSurat === 'SKTM' && (
                <FormField label="Penghasilan Per Bulan (Rp)" hint="Isi dengan angka, tanpa titik atau koma.">
                  <Input
                    type="number"
                    className="h-11"
                    placeholder="contoh: 1500000"
                    onChange={(e) => setValue('dataTambahan', { ...dataTambahan, penghasilanPerbulan: e.target.value })}
                  />
                </FormField>
              )}

              {jenisSurat === 'SK_USAHA' && (
                <>
                  <FormField label="Nama Usaha">
                    <Input
                      className="h-11"
                      placeholder="Nama usaha"
                      onChange={(e) => setValue('dataTambahan', { ...dataTambahan, namaUsaha: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Jenis Usaha">
                    <Input
                      className="h-11"
                      placeholder="contoh: Warung Kelontong, Bengkel, dll."
                      onChange={(e) => setValue('dataTambahan', { ...dataTambahan, jenisUsaha: e.target.value })}
                    />
                  </FormField>
                </>
              )}

              {jenisSurat === 'SK_KELAHIRAN' && (
                <>
                  <FormField label="Nama Bayi">
                    <Input
                      className="h-11"
                      placeholder="Nama lengkap bayi"
                      onChange={(e) => setValue('dataTambahan', { ...dataTambahan, namaBayi: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Jenis Kelamin Bayi">
                    <Select
                      value={dataTambahan?.jenisKelamin || ''}
                      onValueChange={(v) => setValue('dataTambahan', { ...dataTambahan, jenisKelamin: v })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                        <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </>
              )}

              <FormField label="Keterangan Tambahan">
                <Textarea
                  placeholder="Keterangan atau catatan tambahan (opsional)..."
                  rows={3}
                  onChange={(e) => setValue('dataTambahan', { ...dataTambahan, keterangan: e.target.value })}
                />
              </FormField>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: Konfirmasi ── */}
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
                Periksa kembali data berikut sebelum mengirim permohonan.
              </p>

              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                <InfoRow label="Jenis Surat" value={selectedJenis?.label || '—'} />
                <InfoRow label="Pemohon" value={selectedPenduduk?.nama || '—'} />
                <InfoRow label="Keperluan / Perihal" value={perihal || '—'} />
                {dataTambahan?.penghasilanPerbulan && (
                  <InfoRow label="Penghasilan/Bulan" value={`Rp ${Number(dataTambahan.penghasilanPerbulan).toLocaleString('id-ID')}`} />
                )}
                {dataTambahan?.namaUsaha && (
                  <InfoRow label="Nama Usaha" value={dataTambahan.namaUsaha} />
                )}
                {dataTambahan?.jenisUsaha && (
                  <InfoRow label="Jenis Usaha" value={dataTambahan.jenisUsaha} />
                )}
                {dataTambahan?.namaBayi && (
                  <InfoRow label="Nama Bayi" value={dataTambahan.namaBayi} />
                )}
                {dataTambahan?.jenisKelamin && (
                  <InfoRow label="JK Bayi" value={dataTambahan.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} />
                )}
                {dataTambahan?.keterangan && (
                  <InfoRow label="Keterangan" value={dataTambahan.keterangan} />
                )}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚠</span>
                <p className="text-xs text-amber-700">
                  Setelah dikirim, permohonan akan diproses oleh petugas desa. Pastikan semua data sudah benar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step === 1 && (
            <>
              <Button type="button" variant="outline" onClick={() => navigate('/surat')}>
                <ArrowLeft className="h-4 w-4" />
                Batal
              </Button>
              <Button type="button" onClick={handleNext}>
                Lanjut
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button type="button" onClick={handleNext}>
                Lanjut
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={createMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {createMutation.isPending ? 'Mengirim...' : 'Kirim Permohonan'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuratFormPage;
