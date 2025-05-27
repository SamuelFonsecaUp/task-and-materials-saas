
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStatuses } from "@/hooks/useTaskStatuses";

export function TaskStatusManager() {
  const { taskStatuses, isLoading, createTaskStatus, updateTaskStatus, deleteTaskStatus } = useTaskStatuses();
  const [localStatuses, setLocalStatuses] = useState(taskStatuses);
  const { toast } = useToast();

  useEffect(() => {
    setLocalStatuses(taskStatuses);
  }, [taskStatuses]);

  const handleUpdateStatus = async (status: typeof localStatuses[0]) => {
    try {
      await updateTaskStatus(status.id, {
        name: status.name,
        color: status.color,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddStatus = async () => {
    try {
      await createTaskStatus({
        name: 'Novo Status',
        color: '#6b7280',
      });
    } catch (error) {
      console.error('Error adding status:', error);
    }
  };

  const handleDeleteStatus = async (id: string) => {
    try {
      await deleteTaskStatus(id);
    } catch (error) {
      console.error('Error deleting status:', error);
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
        {localStatuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
          >
            <Input
              type="text"
              value={status.name}
              onChange={(e) => {
                const updatedStatus = { ...status, name: e.target.value };
                setLocalStatuses(localStatuses.map(s => 
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
                setLocalStatuses(localStatuses.map(s => 
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
                  onClick={() => handleDeleteStatus(status.id)}
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
