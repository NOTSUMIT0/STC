import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

export const useFetchCommunities = () => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const response = await api.get('/api/communities');
      return response.data;
    },
  });
};

export const useFetchPosts = (communityId?: string, filterMode: string = 'hot') => {
  return useQuery({
    queryKey: ['posts', communityId, filterMode],
    queryFn: async () => {
      let url = '/api/posts';
      const params = new URLSearchParams();
      if (communityId) params.append('communityId', communityId);

      const response = await api.get(`${url}?${params.toString()}`);
      let data = response.data;

      // Sorting logic (can be moved to backend, but keeping frontend sort for now as per original logic)
      if (filterMode === 'hot') {
        data.sort((a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0));
      } else if (filterMode === 'new') {
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filterMode === 'top') {
        data.sort((a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0));
      }
      return data;
    },
  });
};
