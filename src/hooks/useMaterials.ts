
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialService, type Material, type MaterialInsert, type MaterialUpdate } from "@/services/materialService";
import { toast } from "sonner";

export const useMaterials = () => {
  return useQuery({
    queryKey: ["materials"],
    queryFn: materialService.getAll,
  });
};

export const useMaterialsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["materials", "project", projectId],
    queryFn: () => materialService.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (material: Omit<MaterialInsert, "uploaded_by">) => materialService.create(material),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material enviado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar material: ${error.message}`);
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MaterialUpdate }) => 
      materialService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar material: ${error.message}`);
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, materialId }: { file: File; materialId?: string }) => 
      materialService.uploadFile(file, materialId),
    onError: (error: Error) => {
      toast.error(`Erro ao fazer upload: ${error.message}`);
    },
  });
};
