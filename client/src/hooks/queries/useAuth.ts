import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/auth/me');
        return response.data;
      } catch (err) {
        return null;
      }
    },
    retry: 5,
    staleTime: Infinity,
  });
};
