
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskRow from "./TaskRow";
import { useState } from "react";

// Interface para as propriedades do TaskGroup
interface TaskGroupProps {
  day: string;
  count: number;
  tasks: any[]; // Lista de tarefas a serem exibidas
}

// Componente que agrupa tarefas por dia
const TaskGroup = ({ day, count, tasks }: TaskGroupProps) => {
  // Estado para controlar a expansão/colapso do grupo
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4">
      {/* Cabeçalho do grupo com toggle de expansão */}
      <div 
        className="flex items-center justify-between py-2 px-4 bg-background cursor-pointer hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          <span className="font-medium">{day}</span>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Plus className="h-4 w-4" />
          <span className="ml-2">Adicionar Tarefa</span>
        </Button>
      </div>
      
      {/* Lista de tarefas que é exibida quando o grupo está expandido */}
      {isExpanded && (
        <div className="mt-1">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskGroup;
