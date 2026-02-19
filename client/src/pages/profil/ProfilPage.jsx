import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, KeyRound, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

const ROLE_LABEL = {
  ADMIN: 'Administrator',
  KADES: 'Kepala Desa',
  SEKDES: 'Sekretaris Desa',
  OPERATOR: 'Operator',
};

const ROLE_COLOR = {
  ADMIN: 'bg-red-100 text-red-700',
  KADES: 'bg-purple-100 text-purple-700',
  SEKDES: 'bg-blue-100 text-blue-700',
  OPERATOR: 'bg-green-100 text-green-700',
};

function ProfilPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data) => {
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({ title: 'Berhasil', description: 'Password berhasil diubah.', variant: 'success' });
      reset();
      setIsChangingPassword(false);
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Profil Saya"
        breadcrumbs={[{ label: 'Profil' }]}
      />

      <div className="max-w-xl space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.namaLengkap?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{user?.namaLengkap}</h3>
                <p className="text-sm text-slate-500 font-mono">@{user?.username}</p>
                <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLOR[user?.role] || 'bg-gray-100 text-gray-700'}`}>
                  {ROLE_LABEL[user?.role] || user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Username</span>
                <span className="font-mono font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-medium">{user?.namaLengkap}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Hak Akses</span>
                <Badge variant="outline">{ROLE_LABEL[user?.role] || user?.role}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <Badge variant="default">Aktif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-orange-600" />
                Ubah Password
              </CardTitle>
              {!isChangingPassword && (
                <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                  Ubah Password
                </Button>
              )}
            </div>
          </CardHeader>
          {isChangingPassword && (
            <CardContent>
              <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                <div className="space-y-1">
                  <Label>Password Saat Ini <span className="text-red-500">*</span></Label>
                  <Input type="password" {...register('currentPassword')} />
                  {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Password Baru <span className="text-red-500">*</span></Label>
                  <Input type="password" placeholder="Min. 6 karakter" {...register('newPassword')} />
                  {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Konfirmasi Password Baru <span className="text-red-500">*</span></Label>
                  <Input type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setIsChangingPassword(false); reset(); }}>
                    Batal
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4" />
                    Simpan Password
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ProfilPage;
