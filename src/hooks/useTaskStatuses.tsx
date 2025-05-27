
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTaskStatuses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['task-statuses', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('task_statuses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching task statuses:', error);
        throw error;
      }

      return data as TaskStatus[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newStatus: { name: string; color: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('task_statuses')
        .insert([
          {
            name: newStatus.name,
            color: newStatus.color,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task status:', error);
        throw error;
      }

      return data as TaskStatus;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses', user?.id] });
      toast.success('Status criado com sucesso!');
      console.log('Task status created successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to create task status:', error);
      toast.error('Erro ao criar status');
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TaskStatus> & { id: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('task_statuses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task status:', error);
        throw error;
      }

      return data as TaskStatus;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses', user?.id] });
      toast.success('Status atualizado com sucesso!');
      console.log('Task status updated successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to update task status:', error);
      toast.error('Erro ao atualizar status');
    },
  });
};

export const useDeleteTaskStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('task_statuses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task status:', error);
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['task-statuses', user?.id] });
      toast.success('Status excluído com sucesso!');
      console.log('Task status deleted successfully:', id);
    },
    onError: (error) => {
      console.error('Failed to delete task status:', error);
      toast.error('Erro ao excluir status');
    },
  });
};
