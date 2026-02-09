import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';

export const useProblems = () => {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const { data } = await api.get('/api/problems');
      return data;
    },
  });
};

export const useProblemStats = () => {
  return useQuery({
    queryKey: ['problemStats'],
    queryFn: async () => {
      const { data } = await api.get('/api/problems/stats');
      return data;
    },
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProblem: any) => {
      const { data } = await api.post('/api/problems', newProblem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problemStats'] });
    },
  });
};

export const useUpdateProblemStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/api/problems/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problemStats'] });
    },
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/problems/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problemStats'] });
    },
  });
};
