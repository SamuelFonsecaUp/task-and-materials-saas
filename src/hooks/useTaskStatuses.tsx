
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
  order_index: number;
  is_final: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NewTaskStatus {
  name: string;
  color: string;
}

export const useTaskStatuses = () => {
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTaskStatuses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('task_statuses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching task statuses:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os status das tarefas",
          variant: "destructive",
        });
        return;
      }

      setTaskStatuses(data || []);
    } catch (error) {
      console.error('Error in fetchTaskStatuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStatuses();
  }, [user]);

  const createTaskStatus = async (newStatus: NewTaskStatus): Promise<TaskStatus | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um status",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: existingStatuses } = await supabase
        .from('task_statuses')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingStatuses && existingStatuses.length > 0 
        ? existingStatuses[0].order_index + 1 
        : 1;

      const { data, error } = await supabase
        .from('task_statuses')
        .insert([
          {
            name: newStatus.name,
            color: newStatus.color,
            created_by: user.id,
            order_index: nextOrderIndex,
            is_final: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task status:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o status",
          variant: "destructive",
        });
        return null;
      }

      await fetchTaskStatuses();
      
      toast({
        title: "Sucesso",
        description: "Status criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Error in createTaskStatus:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar status",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTaskStatus = async (
    id: string, 
    updates: Partial<Omit<TaskStatus, 'id' | 'created_by' | 'created_at' | 'updated_at'>>
  ): Promise<TaskStatus | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar um status",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('task_statuses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task status:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status",
          variant: "destructive",
        });
        return null;
      }

      await fetchTaskStatuses();
      
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Error in updateTaskStatus:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTaskStatus = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para excluir um status",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('task_statuses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task status:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o status",
          variant: "destructive",
        });
        return false;
      }

      await fetchTaskStatuses();
      
      toast({
        title: "Sucesso",
        description: "Status excluído com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error in deleteTaskStatus:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir status",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    taskStatuses,
    isLoading,
    createTaskStatus,
    updateTaskStatus,
    deleteTaskStatus,
    refetch: fetchTaskStatuses,
  };
};
