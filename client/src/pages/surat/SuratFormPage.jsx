import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
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

// Jenis surat must match backend JenisSurat enum exactly
const JENIS_SURAT_OPTIONS = [
  { value: 'SK_DOMISILI', label: 'SKD — Surat Keterangan Domisili' },
  { value: 'SKTM', label: 'SKTM — Surat Keterangan Tidak Mampu' },
  { value: 'SK_USAHA', label: 'SKU — Surat Keterangan Usaha' },
  { value: 'SK_KELAHIRAN', label: 'SKL — Surat Keterangan Kelahiran' },
  { value: 'SK_KEMATIAN', label: 'SKK — Surat Keterangan Kematian' },
  { value: 'SURAT_PENGANTAR', label: 'SP — Surat Pengantar' },
];

const schema = z.object({
  jenisSurat: z.enum(['SK_DOMISILI', 'SKTM', 'SK_USAHA', 'SK_KELAHIRAN', 'SK_KEMATIAN', 'SURAT_PENGANTAR'], {
    required_error: 'Jenis surat wajib dipilih',
  }),
  pendudukId: z.string().min(1, 'Pilih penduduk pemohon'),
  perihal: z.string().min(1, 'Keperluan wajib diisi'),
  dataTambahan: z.record(z.unknown()).optional(),
});

function FormField({ label, error, required, children }) {
  return (
    <div className="space-y-1">
      <Label>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SuratFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { document.title = 'Buat Surat | SIDESA'; }, []);
  const createMutation = useCreateSurat();
  const { data: pendudukData } = usePendudukList({ limit: 200, status: 'AKTIF' });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const jenisSurat = watch('jenisSurat');

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: 'Berhasil', description: 'Permohonan surat berhasil dibuat.', variant: 'success' });
      navigate('/surat');
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  const pendudukOptions = (pendudukData?.data || []).map((p) => ({
    value: p.id,
    label: `${p.namaLengkap} — ${p.nik}`,
  }));

  return (
    <div>
      <PageHeader
        title="Buat Permohonan Surat"
        breadcrumbs={[{ label: 'Permohonan Surat', href: '/surat' }, { label: 'Buat Surat' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Data Permohonan</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <FormField label="Jenis Surat" error={errors.jenisSurat?.message} required>
              <Select value={watch('jenisSurat') || ''} onValueChange={(v) => setValue('jenisSurat', v, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis surat" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_SURAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Penduduk Pemohon" error={errors.pendudukId?.message} required>
              <Select value={watch('pendudukId') || ''} onValueChange={(v) => setValue('pendudukId', v, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penduduk..." />
                </SelectTrigger>
                <SelectContent>
                  {pendudukOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Keperluan / Perihal" error={errors.perihal?.message} required>
              <Input placeholder="Keperluan pembuatan surat" {...register('perihal')} />
            </FormField>

            {/* Dynamic extra fields based on jenisSurat */}
            {jenisSurat === 'SKTM' && (
              <FormField label="Penghasilan Per Bulan (Rp)">
                <Input
                  type="number"
                  placeholder="contoh: 1500000"
                  onChange={(e) => setValue('dataTambahan', { penghasilanPerbulan: e.target.value })}
                />
              </FormField>
            )}

            {jenisSurat === 'SK_USAHA' && (
              <div className="space-y-4">
                <FormField label="Nama Usaha">
                  <Input
                    placeholder="Nama usaha"
                    onChange={(e) => setValue('dataTambahan', { ...watch('dataTambahan'), namaUsaha: e.target.value })}
                  />
                </FormField>
                <FormField label="Jenis Usaha">
                  <Input
                    placeholder="Jenis usaha"
                    onChange={(e) => setValue('dataTambahan', { ...watch('dataTambahan'), jenisUsaha: e.target.value })}
                  />
                </FormField>
              </div>
            )}

            {jenisSurat === 'SK_KELAHIRAN' && (
              <div className="space-y-4">
                <FormField label="Nama Bayi">
                  <Input
                    placeholder="Nama lengkap bayi"
                    onChange={(e) => setValue('dataTambahan', { ...watch('dataTambahan'), namaBayi: e.target.value })}
                  />
                </FormField>
                <FormField label="Jenis Kelamin Bayi">
                  <Select
                    value={watch('dataTambahan')?.jenisKelamin || ''}
                    onValueChange={(v) => setValue('dataTambahan', { ...watch('dataTambahan'), jenisKelamin: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                      <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            )}

            <FormField label="Keterangan Tambahan">
              <Textarea
                placeholder="Keterangan atau catatan tambahan..."
                onChange={(e) => setValue('dataTambahan', { ...watch('dataTambahan'), keterangan: e.target.value })}
                rows={3}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/surat')}>
            <ArrowLeft className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save className="h-4 w-4" />
            {createMutation.isPending ? 'Menyimpan...' : 'Buat Permohonan'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SuratFormPage;
