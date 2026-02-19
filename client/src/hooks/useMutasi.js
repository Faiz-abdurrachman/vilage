import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useMutasiList(params = {}) {
  return useQuery({
    queryKey: ['mutasi', params],
    queryFn: async () => {
      const res = await api.get('/mutasi', { params });
      return res.data;
    },
    staleTime: 30000,
  });
}

export function useMutasiDetail(id) {
  return useQuery({
    queryKey: ['mutasi', id],
    queryFn: async () => {
      const res = await api.get(`/mutasi/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateMutasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/mutasi', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mutasi'] });
      queryClient.invalidateQueries({ queryKey: ['penduduk'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
