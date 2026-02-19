import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useSuratList(params = {}) {
  return useQuery({
    queryKey: ['surat', params],
    queryFn: async () => {
      const res = await api.get('/surat', { params });
      return res.data;
    },
    staleTime: 30000,
  });
}

export function useSuratDetail(id) {
  return useQuery({
    queryKey: ['surat', id],
    queryFn: async () => {
      const res = await api.get(`/surat/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/surat', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surat'] }),
  });
}

export function useUpdateSurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/surat/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surat'] }),
  });
}

export function useSubmitSurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/surat/${id}/submit`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surat'] }),
  });
}

export function useApproveSurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/surat/${id}/approve`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surat'] }),
  });
}

export function useRejectSurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectedReason }) =>
      api.patch(`/surat/${id}/reject`, { rejectedReason }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surat'] }),
  });
}
