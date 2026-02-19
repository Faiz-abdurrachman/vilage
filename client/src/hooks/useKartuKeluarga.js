import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useKKList(params = {}) {
  return useQuery({
    queryKey: ['kartu-keluarga', params],
    queryFn: async () => {
      const res = await api.get('/kartu-keluarga', { params });
      return res.data;
    },
    staleTime: 30000,
  });
}

export function useKKDetail(id) {
  return useQuery({
    queryKey: ['kartu-keluarga', id],
    queryFn: async () => {
      const res = await api.get(`/kartu-keluarga/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateKK() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/kartu-keluarga', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kartu-keluarga'] }),
  });
}

export function useUpdateKK() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/kartu-keluarga/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kartu-keluarga'] }),
  });
}

export function useDeleteKK() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/kartu-keluarga/${id}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kartu-keluarga'] }),
  });
}

export function useAddAnggota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kkId, pendudukId, statusDalamKK }) =>
      api.post(`/kartu-keluarga/${kkId}/anggota`, { pendudukId, statusDalamKK }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kartu-keluarga'] }),
  });
}

export function useRemoveAnggota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kkId, pendudukId }) =>
      api.delete(`/kartu-keluarga/${kkId}/anggota/${pendudukId}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kartu-keluarga'] }),
  });
}
