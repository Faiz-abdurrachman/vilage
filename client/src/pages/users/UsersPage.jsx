import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Power } from 'lucide-react';
import { useUserList, useCreateUser, useUpdateUser, useToggleActive } from '@/hooks/useUsers';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const createSchema = z.object({
  username: z.string().min(3, 'Minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  namaLengkap: z.string().min(1, 'Wajib diisi'),
  role: z.enum(['ADMIN', 'KADES', 'SEKDES', 'OPERATOR']),
});

const updateSchema = z.object({
  namaLengkap: z.string().min(1, 'Wajib diisi'),
  role: z.enum(['ADMIN', 'KADES', 'SEKDES', 'OPERATOR']),
  password: z.string().optional(),
});

const ROLE_COLOR = {
  ADMIN: 'bg-red-100 text-red-700',
  KADES: 'bg-purple-100 text-purple-700',
  SEKDES: 'bg-blue-100 text-blue-700',
  OPERATOR: 'bg-green-100 text-green-700',
};

function FormField({ label, error, required, children }) {
  return (
    <div className="space-y-1">
      <Label>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function UserDialog({ open, onClose, editUser }) {
  const { toast } = useToast();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isEdit = !!editUser;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: isEdit
      ? { namaLengkap: editUser.namaLengkap, role: editUser.role, password: '' }
      : {},
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const payload = { id: editUser.id, namaLengkap: data.namaLengkap, role: data.role };
        if (data.password) payload.password = data.password;
        await updateMutation.mutateAsync(payload);
        toast({ title: 'Berhasil', description: 'Data pengguna berhasil diperbarui.', variant: 'success' });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: 'Berhasil', description: 'Pengguna baru berhasil ditambahkan.', variant: 'success' });
      }
      reset();
      onClose();
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
            <Input placeholder="Nama lengkap pengguna" {...register('namaLengkap')} />
          </FormField>
          {!isEdit && (
            <FormField label="Username" error={errors.username?.message} required>
              <Input placeholder="Username untuk login" {...register('username')} />
            </FormField>
          )}
          <FormField label={isEdit ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'} error={errors.password?.message} required={!isEdit}>
            <Input type="password" placeholder={isEdit ? 'Biarkan kosong jika tidak diubah' : 'Min. 6 karakter'} {...register('password')} />
          </FormField>
          <FormField label="Role" error={errors.role?.message} required>
            <Select value={watch('role') || ''} onValueChange={(v) => setValue('role', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="KADES">Kepala Desa</SelectItem>
                <SelectItem value="SEKDES">Sekretaris Desa</SelectItem>
                <SelectItem value="OPERATOR">Operator</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UsersPage() {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => { document.title = 'Manajemen Pengguna | SIDESA'; }, []);
  const [editUser, setEditUser] = useState(null);

  const { data: users, isLoading } = useUserList();
  const toggleActiveMutation = useToggleActive();

  const handleToggle = async (user) => {
    try {
      await toggleActiveMutation.mutateAsync(user.id);
      toast({
        title: 'Berhasil',
        description: `Pengguna ${user.isActive ? 'dinonaktifkan' : 'diaktifkan'}.`,
        variant: 'success',
      });
    } catch (err) {
      toast({ title: 'Gagal', description: err.response?.data?.message || 'Gagal.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola akun pengguna sistem"
        breadcrumbs={[{ label: 'Pengguna' }]}
        actions={
          <Button size="sm" onClick={() => { setEditUser(null); setShowDialog(true); }}>
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(users || []).map((user) => (
            <Card key={user.id} className={`transition-opacity ${!user.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{user.namaLengkap}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COLOR[user.role] || 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                      <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => { setEditUser(user); setShowDialog(true); }}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className={`h-7 w-7 ${user.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'}`}
                      onClick={() => handleToggle(user)}
                      title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      disabled={toggleActiveMutation.isPending}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UserDialog
        open={showDialog}
        onClose={() => { setShowDialog(false); setEditUser(null); }}
        editUser={editUser}
      />
    </div>
  );
}

export default UsersPage;
