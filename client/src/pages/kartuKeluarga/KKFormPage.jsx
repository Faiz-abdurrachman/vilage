import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { useKKDetail, useCreateKK, useUpdateKK } from '@/hooks/useKartuKeluarga';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  noKk: z.string().regex(/^\d{16}$/, 'No. KK harus 16 digit angka'),
  alamat: z.string().min(1, 'Wajib diisi'),
  rt: z.string().min(1, 'Wajib diisi'),
  rw: z.string().min(1, 'Wajib diisi'),
  dusun: z.string().min(1, 'Wajib diisi'),
  kodePos: z.string().optional(),
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

function KKFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: existing } = useKKDetail(id);
  const createMutation = useCreateKK();
  const updateMutation = useUpdateKK();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? schema.partial() : schema),
  });

  useEffect(() => {
    if (isEdit && existing) {
      reset({
        noKk: existing.noKk || '',
        alamat: existing.alamat || '',
        rt: existing.rt || '',
        rw: existing.rw || '',
        dusun: existing.dusun || '',
        kodePos: existing.kodePos || '',
      });
    }
  }, [existing, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, ...data });
        toast({ title: 'Berhasil', description: 'Data KK berhasil diperbarui.', variant: 'success' });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: 'Berhasil', description: 'Data KK berhasil ditambahkan.', variant: 'success' });
      }
      navigate('/kartu-keluarga');
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Kartu Keluarga' : 'Tambah Kartu Keluarga'}
        breadcrumbs={[
          { label: 'Kartu Keluarga', href: '/kartu-keluarga' },
          { label: isEdit ? 'Edit' : 'Tambah' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Data Kartu Keluarga</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Nomor KK" error={errors.noKk?.message} required>
                <Input placeholder="16 digit nomor KK" {...register('noKk')} maxLength={16} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Alamat Lengkap" error={errors.alamat?.message} required>
                <Input placeholder="Nama jalan, nomor rumah" {...register('alamat')} />
              </FormField>
            </div>
            <FormField label="RT" error={errors.rt?.message} required>
              <Input placeholder="001" {...register('rt')} />
            </FormField>
            <FormField label="RW" error={errors.rw?.message} required>
              <Input placeholder="001" {...register('rw')} />
            </FormField>
            <FormField label="Dusun" error={errors.dusun?.message} required>
              <Input placeholder="Nama dusun" {...register('dusun')} />
            </FormField>
            <FormField label="Kode Pos" error={errors.kodePos?.message}>
              <Input placeholder="95711" {...register('kodePos')} />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/kartu-keluarga')}>
            <ArrowLeft className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default KKFormPage;
