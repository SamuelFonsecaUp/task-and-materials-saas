
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Material = Tables<"materials">;
export type MaterialInsert = TablesInsert<"materials">;
export type MaterialUpdate = TablesUpdate<"materials">;

export const materialService = {
  async getAll(): Promise<Material[]> {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByProject(projectId: string): Promise<Material[]> {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(material: Omit<MaterialInsert, "uploaded_by">): Promise<Material> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("materials")
      .insert({ ...material, uploaded_by: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: MaterialUpdate): Promise<Material> {
    const { data, error } = await supabase
      .from("materials")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async uploadFile(file: File, materialId?: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${materialId ? `materials/${materialId}` : 'temp'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("materials")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("materials")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
