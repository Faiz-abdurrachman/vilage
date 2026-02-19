import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { usePendudukDetail, useCreatePenduduk, useUpdatePenduduk } from '@/hooks/usePenduduk';
import { useKKList } from '@/hooks/useKartuKeluarga';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  tempatLahir: z.string().min(1, 'Wajib diisi'),
  tanggalLahir: z.string().min(1, 'Wajib diisi'),
  jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
  alamat: z.string().min(1, 'Wajib diisi'),
  rt: z.string().min(1, 'Wajib diisi'),
  rw: z.string().min(1, 'Wajib diisi'),
  agama: z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']),
  statusPerkawinan: z.enum(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI']),
  pekerjaan: z.string().min(1, 'Wajib diisi'),
  pendidikanTerakhir: z.enum(['TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']),
  kewarganegaraan: z.string().default('WNI'),
  golonganDarah: z.enum(['A', 'B', 'AB', 'O', 'TIDAK_TAHU']).optional().nullable(),
  namaAyah: z.string().min(1, 'Wajib diisi'),
  namaIbu: z.string().min(1, 'Wajib diisi'),
  statusDalamKK: z.enum(['KEPALA_KELUARGA', 'ISTRI', 'ANAK', 'FAMILI_LAIN', 'LAINNYA']),
  kkId: z.string().optional().nullable(),
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

function SelectField({ label, error, required, value, onValueChange, options, placeholder }) {
  return (
    <FormField label={label} error={error} required={required}>
      <Select value={value || ''} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || `Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function PendudukFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: existing, isLoading: loadingExisting } = usePendudukDetail(id);
  const { data: kkData } = useKKList({ limit: 100 });
  const createMutation = useCreatePenduduk();
  const updateMutation = useUpdatePenduduk();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isEdit ? schema.partial() : schema),
    defaultValues: { kewarganegaraan: 'WNI' },
  });

  useEffect(() => {
    if (isEdit && existing) {
      const fields = ['nik', 'namaLengkap', 'tempatLahir', 'alamat', 'rt', 'rw', 'pekerjaan', 'namaAyah', 'namaIbu', 'kewarganegaraan'];
      fields.forEach((f) => setValue(f, existing[f] || ''));
      if (existing.tanggalLahir) setValue('tanggalLahir', new Date(existing.tanggalLahir).toISOString().slice(0, 10));
      if (existing.jenisKelamin) setValue('jenisKelamin', existing.jenisKelamin);
      if (existing.agama) setValue('agama', existing.agama);
      if (existing.statusPerkawinan) setValue('statusPerkawinan', existing.statusPerkawinan);
      if (existing.pendidikanTerakhir) setValue('pendidikanTerakhir', existing.pendidikanTerakhir);
      if (existing.statusDalamKK) setValue('statusDalamKK', existing.statusDalamKK);
      if (existing.golonganDarah) setValue('golonganDarah', existing.golonganDarah);
      if (existing.kkId) setValue('kkId', existing.kkId);
    }
  }, [existing, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, ...data });
        toast({ title: 'Berhasil', description: 'Data penduduk berhasil diperbarui.', variant: 'success' });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: 'Berhasil', description: 'Data penduduk berhasil ditambahkan.', variant: 'success' });
      }
      navigate('/penduduk');
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const kkOptions = (kkData?.data || []).map((kk) => ({ value: kk.id, label: `${kk.noKk} — ${kk.dusun}` }));

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}
        breadcrumbs={[{ label: 'Data Penduduk', href: '/penduduk' }, { label: isEdit ? 'Edit' : 'Tambah' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {/* Data Pribadi */}
        <Card>
          <CardHeader><CardTitle className="text-base">Data Pribadi</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="NIK" error={errors.nik?.message} required>
              <Input placeholder="16 digit NIK" {...register('nik')} maxLength={16} />
            </FormField>
            <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
              <Input placeholder="Nama lengkap sesuai KTP" {...register('namaLengkap')} />
            </FormField>
            <FormField label="Tempat Lahir" error={errors.tempatLahir?.message} required>
              <Input placeholder="Kota/Kabupaten" {...register('tempatLahir')} />
            </FormField>
            <FormField label="Tanggal Lahir" error={errors.tanggalLahir?.message} required>
              <Input type="date" {...register('tanggalLahir')} />
            </FormField>
            <SelectField
              label="Jenis Kelamin" required
              value={watch('jenisKelamin')} error={errors.jenisKelamin?.message}
              onValueChange={(v) => setValue('jenisKelamin', v)}
              options={[{ value: 'LAKI_LAKI', label: 'Laki-laki' }, { value: 'PEREMPUAN', label: 'Perempuan' }]}
            />
            <SelectField
              label="Golongan Darah"
              value={watch('golonganDarah') || ''} error={errors.golonganDarah?.message}
              onValueChange={(v) => setValue('golonganDarah', v)}
              options={[{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'AB', label: 'AB' }, { value: 'O', label: 'O' }, { value: 'TIDAK_TAHU', label: 'Tidak Diketahui' }]}
            />
          </CardContent>
        </Card>

        {/* Alamat */}
        <Card>
          <CardHeader><CardTitle className="text-base">Alamat</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
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
            <FormField label="Kewarganegaraan" error={errors.kewarganegaraan?.message}>
              <Input {...register('kewarganegaraan')} />
            </FormField>
          </CardContent>
        </Card>

        {/* Data Kependudukan */}
        <Card>
          <CardHeader><CardTitle className="text-base">Data Kependudukan</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Agama" required
              value={watch('agama')} error={errors.agama?.message}
              onValueChange={(v) => setValue('agama', v)}
              options={['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'].map((a) => ({ value: a, label: a }))}
            />
            <SelectField
              label="Status Perkawinan" required
              value={watch('statusPerkawinan')} error={errors.statusPerkawinan?.message}
              onValueChange={(v) => setValue('statusPerkawinan', v)}
              options={[
                { value: 'BELUM_KAWIN', label: 'Belum Kawin' },
                { value: 'KAWIN', label: 'Kawin' },
                { value: 'CERAI_HIDUP', label: 'Cerai Hidup' },
                { value: 'CERAI_MATI', label: 'Cerai Mati' },
              ]}
            />
            <FormField label="Pekerjaan" error={errors.pekerjaan?.message} required>
              <Input placeholder="Pekerjaan utama" {...register('pekerjaan')} />
            </FormField>
            <SelectField
              label="Pendidikan Terakhir" required
              value={watch('pendidikanTerakhir')} error={errors.pendidikanTerakhir?.message}
              onValueChange={(v) => setValue('pendidikanTerakhir', v)}
              options={['TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'].map((p) => ({ value: p, label: p }))}
            />
          </CardContent>
        </Card>

        {/* Data Keluarga */}
        <Card>
          <CardHeader><CardTitle className="text-base">Data Keluarga</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nama Ayah" error={errors.namaAyah?.message} required>
              <Input placeholder="Nama lengkap ayah" {...register('namaAyah')} />
            </FormField>
            <FormField label="Nama Ibu" error={errors.namaIbu?.message} required>
              <Input placeholder="Nama lengkap ibu" {...register('namaIbu')} />
            </FormField>
            <SelectField
              label="Status dalam KK" required
              value={watch('statusDalamKK')} error={errors.statusDalamKK?.message}
              onValueChange={(v) => setValue('statusDalamKK', v)}
              options={[
                { value: 'KEPALA_KELUARGA', label: 'Kepala Keluarga' },
                { value: 'ISTRI', label: 'Istri' },
                { value: 'ANAK', label: 'Anak' },
                { value: 'FAMILI_LAIN', label: 'Famili Lain' },
                { value: 'LAINNYA', label: 'Lainnya' },
              ]}
            />
            <SelectField
              label="Kartu Keluarga"
              value={watch('kkId') || ''} error={errors.kkId?.message}
              onValueChange={(v) => setValue('kkId', v)}
              options={[{ value: '', label: 'Tidak ada (pisahkan)' }, ...kkOptions]}
              placeholder="Pilih KK"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/penduduk')}>
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

export default PendudukFormPage;
