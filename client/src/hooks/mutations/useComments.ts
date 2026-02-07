import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/comments', data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, userId, action }: { commentId: string; userId: string; action: 'upvote' | 'downvote' }) => {
      const response = await api.put(`/api/comments/${commentId}/like`, { userId, action });
      return response.data;
    },
    onSuccess: () => {
      // We might need postId to invalidate correct query. 
      // If we don't have it, we might need to invalidate all comments or pass it.
      // 'variables' here is the argument to mutate.
      // The caller needs to ensure invalidation happens for the right UI update.
      // Since comments query is by postId, we need to know the postId.
      // The API for like doesn't take postId.
      // We can invalidate all 'comments' queries or try to pass postId in context.
      // For now, let's invalidate all 'comments' or just optimistically update in component.
      // Safest is invalidate all comments queries.
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
