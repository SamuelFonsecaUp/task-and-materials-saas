
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService, type Task, type TaskInsert, type TaskUpdate } from "@/services/taskService";
import { toast } from "sonner";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAll,
  });
};

export const useTasksByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => taskService.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (task: Omit<TaskInsert, "created_by">) => {
      // Validações básicas
      if (!task.title?.trim()) {
        throw new Error("Título é obrigatório");
      }
      if (!task.project_id?.trim()) {
        throw new Error("Projeto é obrigatório");
      }
      if (!task.due_date) {
        throw new Error("Data de vencimento é obrigatória");
      }
      
      return taskService.create(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar tarefa: ${error.message}`);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) => 
      taskService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
      toast.success("Tarefa atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar tarefa: ${error.message}`);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover tarefa: ${error.message}`);
    },
  });
};
