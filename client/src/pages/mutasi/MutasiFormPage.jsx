import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, Baby, HeartHandshake, LogOut, LogIn, Check } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const JENIS_OPTIONS = [
  {
    value: 'LAHIR',
    label: 'Kelahiran',
    desc: 'Pencatatan kelahiran bayi baru',
    icon: Baby,
    color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400',
    selectedColor: 'bg-blue-50 border-blue-600 ring-2 ring-blue-200',
  },
  {
    value: 'MENINGGAL',
    label: 'Kematian',
    desc: 'Pencatatan kematian penduduk',
    icon: HeartHandshake,
    color: 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-400',
    selectedColor: 'bg-slate-50 border-slate-600 ring-2 ring-slate-200',
  },
  {
    value: 'PINDAH_KELUAR',
    label: 'Pindah Keluar',
    desc: 'Penduduk pindah ke luar desa',
    icon: LogOut,
    color: 'text-orange-600 bg-orange-50 border-orange-200 hover:border-orange-400',
    selectedColor: 'bg-orange-50 border-orange-600 ring-2 ring-orange-200',
  },
  {
    value: 'PINDAH_MASUK',
    label: 'Pindah Masuk',
    desc: 'Penduduk masuk ke desa ini',
    icon: LogIn,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    selectedColor: 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200',
  },
];

const baseSchema = z.object({
  jenisMutasi: z.enum(['LAHIR', 'MENINGGAL', 'PINDAH_MASUK', 'PINDAH_KELUAR']),
  tanggalMutasi: z.string().min(1, 'Tanggal wajib diisi'),
  keterangan: z.string().optional(),
  pendudukId: z.string().optional(),
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
  desaTujuan: z.string().optional(),
  desaAsal: z.string().optional(),
});

function FormField({ label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function SelectField({ label, error, required, value, onValueChange, options, placeholder }) {
  return (
    <FormField label={label} error={error} required={required}>
      <Select value={value || ''} onValueChange={onValueChange}>
        <SelectTrigger className="rounded-xl border-slate-200 h-11">
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

  useEffect(() => { document.title = 'Catat Mutasi | SIDESA'; }, []);

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
  const needsDesaTujuan = jenisMutasi === 'PINDAH_KELUAR';
  const needsDesaAsal = jenisMutasi === 'PINDAH_MASUK';

  const handleJenisSelect = (value) => {
    setJenisMutasi(value);
    setValue('jenisMutasi', value);
  };

  return (
    <div>
      <PageHeader
        title="Catat Mutasi Penduduk"
        breadcrumbs={[{ label: 'Mutasi Penduduk', href: '/mutasi' }, { label: 'Catat Mutasi' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Jenis Mutasi — card selection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Pilih Jenis Mutasi <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {JENIS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = jenisMutasi === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleJenisSelect(opt.value)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-150',
                    isSelected ? opt.selectedColor : `border ${opt.color}`,
                  )}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-current/10">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isSelected ? '' : opt.color.split(' ')[1])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{opt.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-70 leading-tight hidden sm:block">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.jenisMutasi && (
            <p className="text-xs text-red-600 mt-2">{errors.jenisMutasi.message}</p>
          )}
        </div>

        {/* Tanggal & Keterangan */}
        {jenisMutasi && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Informasi Mutasi
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Tanggal Mutasi" error={errors.tanggalMutasi?.message} required>
                <Input type="date" className="rounded-xl h-11 border-slate-200" {...register('tanggalMutasi')} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Keterangan" error={errors.keterangan?.message}>
                  <Textarea className="rounded-xl border-slate-200" placeholder="Keterangan tambahan..." {...register('keterangan')} rows={2} />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* Pilih penduduk (MENINGGAL / PINDAH_KELUAR) */}
        {needsPendudukSelect && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Pilih Penduduk
            </h3>
            <div className="space-y-4">
              <SelectField
                label="Penduduk" required
                value={watch('pendudukId')} error={errors.pendudukId?.message}
                onValueChange={(v) => setValue('pendudukId', v)}
                options={pendudukOptions}
                placeholder="Cari dan pilih penduduk..."
              />
              {needsDesaTujuan && (
                <FormField label="Desa/Kota Tujuan Pindah" error={errors.desaTujuan?.message}>
                  <Input className="rounded-xl h-11 border-slate-200" placeholder="Nama desa/kota tujuan pindah" {...register('desaTujuan')} />
                </FormField>
              )}
            </div>
          </div>
        )}

        {/* Data penduduk baru (LAHIR / PINDAH_MASUK) */}
        {needsNewPenduduk && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {jenisMutasi === 'LAHIR' ? 'Data Bayi Lahir' : 'Data Penduduk Masuk'}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {needsDesaAsal && (
                <div className="sm:col-span-2">
                  <FormField label="Desa/Kota Asal" error={errors.desaAsal?.message} required>
                    <Input className="rounded-xl h-11 border-slate-200" placeholder="Nama desa/kota asal" {...register('desaAsal')} />
                  </FormField>
                </div>
              )}
              <FormField label="NIK" error={errors.nik?.message} required>
                <Input className="rounded-xl h-11 border-slate-200 font-mono" placeholder="16 digit NIK" {...register('nik')} maxLength={16} />
              </FormField>
              <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
                <Input className="rounded-xl h-11 border-slate-200" placeholder="Nama lengkap" {...register('namaLengkap')} />
              </FormField>
              <FormField label="Tempat Lahir" error={errors.tempatLahir?.message} required>
                <Input className="rounded-xl h-11 border-slate-200" placeholder="Kota/Kabupaten" {...register('tempatLahir')} />
              </FormField>
              <FormField label="Tanggal Lahir" error={errors.tanggalLahir?.message} required>
                <Input type="date" className="rounded-xl h-11 border-slate-200" {...register('tanggalLahir')} />
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
                <Input className="rounded-xl h-11 border-slate-200" placeholder="Nama lengkap ayah" {...register('namaAyah')} />
              </FormField>
              <FormField label="Nama Ibu" error={errors.namaIbu?.message} required>
                <Input className="rounded-xl h-11 border-slate-200" placeholder="Nama lengkap ibu" {...register('namaIbu')} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Alamat" error={errors.alamat?.message} required>
                  <Input className="rounded-xl h-11 border-slate-200" placeholder="Alamat lengkap" {...register('alamat')} />
                </FormField>
              </div>
              <FormField label="RT" error={errors.rt?.message} required>
                <Input className="rounded-xl h-11 border-slate-200" placeholder="001" {...register('rt')} />
              </FormField>
              <FormField label="RW" error={errors.rw?.message} required>
                <Input className="rounded-xl h-11 border-slate-200" placeholder="001" {...register('rw')} />
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
                    <Input className="rounded-xl h-11 border-slate-200" placeholder="Pekerjaan utama" {...register('pekerjaan')} />
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
                value={watch('kkId') || ''}
                error={errors.kkId?.message}
                onValueChange={(v) => setValue('kkId', v)}
                options={[{ value: '__none__', label: 'Tidak ada / Buat baru' }, ...kkOptions]}
                placeholder="Pilih KK"
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        {jenisMutasi && (
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate('/mutasi')}>
              <ArrowLeft className="h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" className="rounded-xl" disabled={createMutation.isPending}>
              <Save className="h-4 w-4" />
              {createMutation.isPending ? 'Menyimpan...' : 'Simpan Mutasi'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default MutasiFormPage;
