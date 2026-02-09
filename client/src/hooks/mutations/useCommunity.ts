import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/api/posts', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/api/communities', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useEditCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await api.put(`/api/communities/${id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    }
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/communities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId, action }: { id: string; userId: string; action: 'upvote' | 'downvote' }) => {
      const response = await api.put(`/api/posts/${id}/like`, { userId, action });
      return response.data;
    },
    onMutate: async ({ id, userId, action }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((post: any) => {
          if (post._id === id) {
            let likes = [...(post.likes || [])];
            let dislikes = [...(post.dislikes || [])];

            const likeIndex = likes.findIndex((id: any) => id.toString() === userId.toString());
            const dislikeIndex = dislikes.findIndex((id: any) => id.toString() === userId.toString());

            if (action === 'upvote') {
              if (likeIndex === -1) {
                likes.push(userId);
                if (dislikeIndex !== -1) dislikes.splice(dislikeIndex, 1);
              } else {
                likes.splice(likeIndex, 1); // Toggle off
              }
            } else if (action === 'downvote') {
              if (dislikeIndex === -1) {
                dislikes.push(userId);
                if (likeIndex !== -1) likes.splice(likeIndex, 1);
              } else {
                dislikes.splice(dislikeIndex, 1); // Toggle off
              }
            }
            return { ...post, likes, dislikes };
          }
          return post;
        });
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      // Rollback to the previous value
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/posts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/api/posts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useJoinLeaveCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commId, action, userId }: { commId: string; action: 'join' | 'leave'; userId: string }) => {
      const response = await api.post(`/api/communities/${commId}/${action}`, { userId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useVotePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, optionIndex }: { id: string; optionIndex: number }) => {
      const response = await api.put(`/api/posts/${id}/vote`, { optionIndex });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
