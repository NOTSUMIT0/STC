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
    onMutate: async ({ commentId, userId, action }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments'] });

      // Snapshot previous value
      const previousComments = queryClient.getQueriesData({ queryKey: ['comments'] });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['comments'] }, (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((comment: any) => {
          // Helper to recursively update comments (since they can be nested or flat, here they seem flat from backend but structured in UI)
          // The query returns a flat list from backend: router.get('/:postId') -> Comment.find({...})
          // So we just map the array.
          if (comment._id === commentId) {
            let likes = [...(comment.likes || [])];
            let dislikes = [...(comment.dislikes || [])];

            const likeIndex = likes.findIndex((id: any) => id.toString() === userId.toString());
            const dislikeIndex = dislikes.findIndex((id: any) => id.toString() === userId.toString());

            if (action === 'upvote') {
              if (likeIndex !== -1) {
                // Already upvoted -> Toggle Off (Neutral)
                likes.splice(likeIndex, 1);
              } else if (dislikeIndex !== -1) {
                // Currently downvoted -> Remove Downvote (Neutral)
                dislikes.splice(dislikeIndex, 1);
              } else {
                // Neutral -> Upvote
                likes.push(userId);
              }
            } else if (action === 'downvote') {
              if (dislikeIndex !== -1) {
                // Already downvoted -> Toggle Off (Neutral)
                dislikes.splice(dislikeIndex, 1);
              } else if (likeIndex !== -1) {
                // Currently upvoted -> Remove Upvote (Neutral)
                likes.splice(likeIndex, 1);
              } else {
                // Neutral -> Downvote
                dislikes.push(userId);
              }
            }
            return { ...comment, likes, dislikes };
          }
          return comment;
        });
      });

      return { previousComments };
    },
    onError: (_err: any, _variables: any, context: any) => {
      // Rollback
      if (context?.previousComments) {
        context.previousComments.forEach((entry: any) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
