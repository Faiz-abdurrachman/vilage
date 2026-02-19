import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useProfilDesa() {
  return useQuery({
    queryKey: ['profil-desa'],
    queryFn: async () => {
      const res = await api.get('/pengaturan/profil-desa');
      return res.data.data;
    },
    staleTime: 300000,
  });
}

export function useUpdateProfilDesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.put('/pengaturan/profil-desa', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profil-desa'] }),
  });
}
