import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { useCreateMutasi } from '@/hooks/useMutasi';
import { usePendudukList } from '@/hooks/usePenduduk';
import { useKKList } from '@/hooks/useKartuKeluarga';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const baseSchema = z.object({
  jenisMutasi: z.enum(['LAHIR', 'MENINGGAL', 'PINDAH_MASUK', 'PINDAH_KELUAR']),
  tanggalMutasi: z.string().min(1, 'Tanggal wajib diisi'),
  keterangan: z.string().optional(),
  pendudukId: z.string().optional(),
  // For LAHIR / PINDAH_MASUK
  nik: z.string().optional(),
  namaLengkap: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  jenisKelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).optional(),
  agama: z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']).optional(),
  statusPerkawinan: z.enum(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI']).optional(),
  pekerjaan: z.string().optional(),
  pendidikanTerakhir: z.enum(['TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']).optional(),
  alamat: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  namaAyah: z.string().optional(),
  namaIbu: z.string().optional(),
  kkId: z.string().optional(),
  // For PINDAH
  alamatTujuan: z.string().optional(),
  alasanPindah: z.string().optional(),
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

function MutasiFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jenisMutasi, setJenisMutasi] = useState('');

  const createMutation = useCreateMutasi();
  const { data: pendudukData } = usePendudukList({ limit: 200, status: 'AKTIF' });
  const { data: kkData } = useKKList({ limit: 100 });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(baseSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: 'Berhasil', description: 'Mutasi penduduk berhasil dicatat.', variant: 'success' });
      navigate('/mutasi');
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  const pendudukOptions = (pendudukData?.data || []).map((p) => ({
    value: p.id,
    label: `${p.namaLengkap} — ${p.nik}`,
  }));

  const kkOptions = (kkData?.data || []).map((kk) => ({
    value: kk.id,
    label: `${kk.noKk} — ${kk.dusun}`,
  }));

  const needsPendudukSelect = ['MENINGGAL', 'PINDAH_KELUAR'].includes(jenisMutasi);
  const needsNewPenduduk = ['LAHIR', 'PINDAH_MASUK'].includes(jenisMutasi);
  const needsAlamatTujuan = jenisMutasi === 'PINDAH_KELUAR';

  return (
    <div>
      <PageHeader
        title="Catat Mutasi Penduduk"
        breadcrumbs={[{ label: 'Mutasi Penduduk', href: '/mutasi' }, { label: 'Catat Mutasi' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Jenis Mutasi & Tanggal */}
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Mutasi</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Jenis Mutasi" required
              value={watch('jenisMutasi')} error={errors.jenisMutasi?.message}
              onValueChange={(v) => { setValue('jenisMutasi', v); setJenisMutasi(v); }}
              options={[
                { value: 'LAHIR', label: 'Kelahiran' },
                { value: 'MENINGGAL', label: 'Kematian' },
                { value: 'PINDAH_MASUK', label: 'Pindah Masuk' },
                { value: 'PINDAH_KELUAR', label: 'Pindah Keluar' },
              ]}
            />
            <FormField label="Tanggal Mutasi" error={errors.tanggalMutasi?.message} required>
              <Input type="date" {...register('tanggalMutasi')} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Keterangan" error={errors.keterangan?.message}>
                <Textarea placeholder="Keterangan tambahan..." {...register('keterangan')} rows={2} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Pilih penduduk (untuk MENINGGAL / PINDAH_KELUAR) */}
        {needsPendudukSelect && (
          <Card>
            <CardHeader><CardTitle className="text-base">Pilih Penduduk</CardTitle></CardHeader>
            <CardContent>
              <SelectField
                label="Penduduk" required
                value={watch('pendudukId')} error={errors.pendudukId?.message}
                onValueChange={(v) => setValue('pendudukId', v)}
                options={pendudukOptions}
                placeholder="Cari dan pilih penduduk..."
              />
              {needsAlamatTujuan && (
                <div className="mt-4">
                  <FormField label="Alamat Tujuan Pindah" error={errors.alamatTujuan?.message}>
                    <Input placeholder="Alamat lengkap tujuan pindah" {...register('alamatTujuan')} />
                  </FormField>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Data penduduk baru (untuk LAHIR / PINDAH_MASUK) */}
        {needsNewPenduduk && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {jenisMutasi === 'LAHIR' ? 'Data Bayi Lahir' : 'Data Penduduk Masuk'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="NIK" error={errors.nik?.message} required>
                  <Input placeholder="16 digit NIK" {...register('nik')} maxLength={16} />
                </FormField>
                <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
                  <Input placeholder="Nama lengkap" {...register('namaLengkap')} />
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
                  options={[
                    { value: 'LAKI_LAKI', label: 'Laki-laki' },
                    { value: 'PEREMPUAN', label: 'Perempuan' },
                  ]}
                />
                <SelectField
                  label="Agama" required
                  value={watch('agama')} error={errors.agama?.message}
                  onValueChange={(v) => setValue('agama', v)}
                  options={['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'].map((a) => ({ value: a, label: a }))}
                />
                <FormField label="Nama Ayah" error={errors.namaAyah?.message} required>
                  <Input placeholder="Nama lengkap ayah" {...register('namaAyah')} />
                </FormField>
                <FormField label="Nama Ibu" error={errors.namaIbu?.message} required>
                  <Input placeholder="Nama lengkap ibu" {...register('namaIbu')} />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Alamat" error={errors.alamat?.message} required>
                    <Input placeholder="Alamat lengkap" {...register('alamat')} />
                  </FormField>
                </div>
                <FormField label="RT" error={errors.rt?.message} required>
                  <Input placeholder="001" {...register('rt')} />
                </FormField>
                <FormField label="RW" error={errors.rw?.message} required>
                  <Input placeholder="001" {...register('rw')} />
                </FormField>
                {jenisMutasi === 'PINDAH_MASUK' && (
                  <>
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
                  </>
                )}
                <SelectField
                  label="Kartu Keluarga"
                  value={watch('kkId') || ''} error={errors.kkId?.message}
                  onValueChange={(v) => setValue('kkId', v)}
                  options={[{ value: '', label: 'Tidak ada' }, ...kkOptions]}
                  placeholder="Pilih KK"
                />
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/mutasi')}>
            <ArrowLeft className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={createMutation.isPending || !jenisMutasi}>
            <Save className="h-4 w-4" />
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan Mutasi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MutasiFormPage;
