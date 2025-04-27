
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TaskStatus {
  id: string;
  name: string;
  color: string;
  order_index: number;
  is_final: boolean;
}

export function TaskStatusManager() {
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('task_statuses')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os status das tarefas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('task_statuses')
        .update({
          name: status.name,
          color: status.color,
        })
        .eq('id', status.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });

      await fetchStatuses();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const handleAddStatus = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const newIndex = Math.max(...statuses.map(s => s.order_index), 0) + 1;
      const { error } = await supabase
        .from('task_statuses')
        .insert({
          name: 'Novo Status',
          color: '#6b7280',
          order_index: newIndex,
          is_final: false,
          created_by: userData.user.id // Add the created_by field
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Novo status adicionado",
      });

      await fetchStatuses();
    } catch (error) {
      console.error('Error adding status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status das Tarefas</h3>
        <Button onClick={handleAddStatus} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Status
        </Button>
      </div>
      
      <div className="grid gap-4">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
          >
            <Input
              type="text"
              value={status.name}
              onChange={(e) => {
                const updatedStatus = { ...status, name: e.target.value };
                setStatuses(statuses.map(s => 
                  s.id === status.id ? updatedStatus : s
                ));
              }}
              className="max-w-[200px]"
            />
            <Input
              type="color"
              value={status.color}
              onChange={(e) => {
                const updatedStatus = { ...status, color: e.target.value };
                setStatuses(statuses.map(s => 
                  s.id === status.id ? updatedStatus : s
                ));
              }}
              className="w-20"
            />
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(status)}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              {!status.is_final && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={status.is_final}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
