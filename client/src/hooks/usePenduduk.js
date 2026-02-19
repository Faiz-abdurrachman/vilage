import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function usePendudukList(params = {}) {
  return useQuery({
    queryKey: ['penduduk', params],
    queryFn: async () => {
      const res = await api.get('/penduduk', { params });
      return res.data;
    },
    staleTime: 30000,
  });
}

export function usePendudukDetail(id) {
  return useQuery({
    queryKey: ['penduduk', id],
    queryFn: async () => {
      const res = await api.get(`/penduduk/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePenduduk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/penduduk', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['penduduk'] }),
  });
}

export function useUpdatePenduduk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/penduduk/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['penduduk'] }),
  });
}

export function useDeletePenduduk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/penduduk/${id}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['penduduk'] }),
  });
}

export function usePendudukSearch(search) {
  return useQuery({
    queryKey: ['penduduk-search', search],
    queryFn: async () => {
      const res = await api.get('/penduduk', { params: { search, limit: 20, status: 'AKTIF' } });
      return res.data.data;
    },
    enabled: search?.length >= 2,
    staleTime: 10000,
  });
}
