
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TasksEmptyStateProps {
  onNewTask: () => void;
}

const TasksEmptyState = ({ onNewTask }: TasksEmptyStateProps) => {
  return (
    <div className="text-center py-10">
      <p className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</p>
      <p className="text-sm text-muted-foreground mb-4">
        Tente ajustar seus filtros ou criar uma nova tarefa
      </p>
      <Button className="bg-primary hover:bg-primary/80" onClick={onNewTask}>
        <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
      </Button>
    </div>
  );
};

export default TasksEmptyState;
