
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Task = Tables<"tasks"> & {
  projects?: {
    id: string;
    name: string;
    client_name: string;
    client_logo: string | null;
  } | null;
  assigned_user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
};

export type TaskInsert = TablesInsert<"tasks">;
export type TaskUpdate = TablesUpdate<"tasks">;

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects:project_id (
          id,
          name,
          client_name,
          client_logo
        ),
        assigned_user:assigned_to (
          id,
          name,
          avatar_url
        )
      `)
      .order("due_date", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects:project_id (
          id,
          name,
          client_name,
          client_logo
        ),
        assigned_user:assigned_to (
          id,
          name,
          avatar_url
        )
      `)
      .eq("project_id", projectId)
      .order("due_date", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects:project_id (
          id,
          name,
          client_name,
          client_logo
        ),
        assigned_user:assigned_to (
          id,
          name,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(task: Omit<TaskInsert, "created_by">): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...task, created_by: user.id })
      .select(`
        *,
        projects:project_id (
          id,
          name,
          client_name,
          client_logo
        ),
        assigned_user:assigned_to (
          id,
          name,
          avatar_url
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(`
        *,
        projects:project_id (
          id,
          name,
          client_name,
          client_logo
        ),
        assigned_user:assigned_to (
          id,
          name,
          avatar_url
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};

// Funções utilitárias para agrupamento por dias
export const groupTasksByDay = (tasks: Task[]) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const groups = {
    hoje: [] as Task[],
    amanha: [] as Task[],
    segunda: [] as Task[],
    terca: [] as Task[],
    quarta: [] as Task[],
  };

  tasks.forEach(task => {
    const taskDate = new Date(task.due_date);
    const dayOfWeek = taskDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Verificar se é hoje
    if (taskDate.toDateString() === today.toDateString()) {
      groups.hoje.push(task);
    }
    // Verificar se é amanhã
    else if (taskDate.toDateString() === tomorrow.toDateString()) {
      groups.amanha.push(task);
    }
    // Agrupar por dia da semana
    else if (dayOfWeek === 1) { // Segunda-feira
      groups.segunda.push(task);
    }
    else if (dayOfWeek === 2) { // Terça-feira
      groups.terca.push(task);
    }
    else if (dayOfWeek === 3) { // Quarta-feira
      groups.quarta.push(task);
    }
  });

  return groups;
};
