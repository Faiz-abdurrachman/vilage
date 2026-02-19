import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
    staleTime: 60000,
  });
}

export function useDemografi() {
  return useQuery({
    queryKey: ['dashboard', 'demografi'],
    queryFn: async () => {
      const res = await api.get('/dashboard/demografi');
      return res.data.data;
    },
    staleTime: 60000,
  });
}

export function useMutasiBulanan() {
  return useQuery({
    queryKey: ['dashboard', 'mutasi-bulanan'],
    queryFn: async () => {
      const res = await api.get('/dashboard/mutasi-bulanan');
      return res.data.data;
    },
    staleTime: 60000,
  });
}
