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

const schema = z.object({
  jenisSurat: z.enum(['SKD', 'SKCK', 'SKU', 'SKL', 'SKM', 'SKTM']),
  pendudukId: z.string().min(1, 'Pilih penduduk pemohon'),
  tanggalPengajuan: z.string().min(1, 'Tanggal wajib diisi'),
  keperluan: z.string().min(1, 'Keperluan wajib diisi'),
  keterangan: z.string().optional(),
});

const JENIS_SURAT_OPTIONS = [
  { value: 'SKD', label: 'SKD — Surat Keterangan Domisili' },
  { value: 'SKCK', label: 'SKCK — Surat Kel. Catatan Kepolisian' },
  { value: 'SKU', label: 'SKU — Surat Keterangan Usaha' },
  { value: 'SKL', label: 'SKL — Surat Keterangan Lahir' },
  { value: 'SKM', label: 'SKM — Surat Keterangan Meninggal' },
  { value: 'SKTM', label: 'SKTM — Surat Ket. Tidak Mampu' },
];

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
  const createMutation = useCreateSurat();
  const { data: pendudukData } = usePendudukList({ limit: 200, status: 'AKTIF' });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
    },
  });

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
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Jenis Surat" error={errors.jenisSurat?.message} required>
                <Select value={watch('jenisSurat') || ''} onValueChange={(v) => setValue('jenisSurat', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_SURAT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jenisSurat && <p className="text-xs text-red-500 mt-1">{errors.jenisSurat.message}</p>}
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Penduduk Pemohon" error={errors.pendudukId?.message} required>
                <Select value={watch('pendudukId') || ''} onValueChange={(v) => setValue('pendudukId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penduduk..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pendudukOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pendudukId && <p className="text-xs text-red-500 mt-1">{errors.pendudukId.message}</p>}
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Keperluan" error={errors.keperluan?.message} required>
                <Input placeholder="Keperluan pembuatan surat" {...register('keperluan')} />
              </FormField>
            </div>
            <FormField label="Tanggal Pengajuan" error={errors.tanggalPengajuan?.message} required>
              <Input type="date" {...register('tanggalPengajuan')} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Keterangan Tambahan" error={errors.keterangan?.message}>
                <Textarea placeholder="Keterangan atau catatan tambahan..." {...register('keterangan')} rows={3} />
              </FormField>
            </div>
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
