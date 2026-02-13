import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

export const useAuth = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/auth/me');
        return response.data;
      } catch (err) {
        return null; // Return null if not authenticated
      }
    },
    retry: 1, // Reduced retry count for faster failure on auth check
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });
};
