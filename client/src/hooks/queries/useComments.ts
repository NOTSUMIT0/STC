import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

export const useFetchComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await api.get(`/api/comments/${postId}`);
      // Helper to structure comments (moved from component to here or keeps in component? 
      // The original component did flat->tree conversion in fetch callback. 
      // Better to do it in select or in the component if we want to keep hook simple.
      // I'll return the flat list and let the component or a selector handle it to handle tree structure.)
      return response.data;
    },
  });
};
