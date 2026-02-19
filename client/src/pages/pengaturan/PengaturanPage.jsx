import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { useProfilDesa, useUpdateProfilDesa } from '@/hooks/usePengaturan';
import PageHeader from '@/components/shared/PageHeader';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  namaDesa: z.string().min(1, 'Wajib diisi'),
  namaKecamatan: z.string().min(1, 'Wajib diisi'),
  namaKabupaten: z.string().min(1, 'Wajib diisi'),
  namaProvinsi: z.string().min(1, 'Wajib diisi'),
  kodePos: z.string().optional(),
  kodeDesa: z.string().optional(),
  alamatKantor: z.string().optional(),
  noTelepon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  namaKades: z.string().optional(),
  namaSekdes: z.string().optional(),
  visiDesa: z.string().optional(),
  misiDesa: z.string().optional(),
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

function PengaturanPage() {
  const { toast } = useToast();
  const { data: profil, isLoading } = useProfilDesa();
  const updateMutation = useUpdateProfilDesa();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profil) {
      reset({
        namaDesa: profil.namaDesa || '',
        namaKecamatan: profil.namaKecamatan || '',
        namaKabupaten: profil.namaKabupaten || '',
        namaProvinsi: profil.namaProvinsi || '',
        kodePos: profil.kodePos || '',
        kodeDesa: profil.kodeDesa || '',
        alamatKantor: profil.alamatKantor || '',
        noTelepon: profil.noTelepon || '',
        email: profil.email || '',
        namaKades: profil.namaKades || '',
        namaSekdes: profil.namaSekdes || '',
        visiDesa: profil.visiDesa || '',
        misiDesa: profil.misiDesa || '',
      });
    }
  }, [profil, reset]);

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync(data);
      toast({ title: 'Berhasil', description: 'Profil desa berhasil diperbarui.', variant: 'success' });
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi profil dan data desa"
        breadcrumbs={[{ label: 'Pengaturan' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Identitas Desa</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nama Desa" error={errors.namaDesa?.message} required>
              <Input {...register('namaDesa')} />
            </FormField>
            <FormField label="Kode Desa" error={errors.kodeDesa?.message}>
              <Input placeholder="Contoh: MB" {...register('kodeDesa')} />
            </FormField>
            <FormField label="Kecamatan" error={errors.namaKecamatan?.message} required>
              <Input {...register('namaKecamatan')} />
            </FormField>
            <FormField label="Kabupaten/Kota" error={errors.namaKabupaten?.message} required>
              <Input {...register('namaKabupaten')} />
            </FormField>
            <FormField label="Provinsi" error={errors.namaProvinsi?.message} required>
              <Input {...register('namaProvinsi')} />
            </FormField>
            <FormField label="Kode Pos" error={errors.kodePos?.message}>
              <Input {...register('kodePos')} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Alamat Kantor Desa" error={errors.alamatKantor?.message}>
                <Input {...register('alamatKantor')} />
              </FormField>
            </div>
            <FormField label="Nomor Telepon" error={errors.noTelepon?.message}>
              <Input {...register('noTelepon')} />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <Input type="email" {...register('email')} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Perangkat Desa</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nama Kepala Desa" error={errors.namaKades?.message}>
              <Input {...register('namaKades')} />
            </FormField>
            <FormField label="Nama Sekretaris Desa" error={errors.namaSekdes?.message}>
              <Input {...register('namaSekdes')} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Visi & Misi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Visi Desa" error={errors.visiDesa?.message}>
              <Textarea rows={3} {...register('visiDesa')} />
            </FormField>
            <FormField label="Misi Desa" error={errors.misiDesa?.message}>
              <Textarea rows={4} placeholder="Pisahkan setiap misi dengan enter..." {...register('misiDesa')} />
            </FormField>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PengaturanPage;
