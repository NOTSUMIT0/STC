import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error: any) => {
      console.log(error);
    }
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (error: any) => {
      console.log(error);
    }
  });
};


export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/api/auth/signup', credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (error: any) => {
      console.log(error);
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/api/auth/me', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['authUser'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error: any) => {
      console.log(error);
    }
  });
};
