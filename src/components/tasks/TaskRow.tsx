
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface que define a estrutura de uma tarefa
interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  project: {
    name: string;
  };
  client: {
    name: string;
  };
  assignedTo: {
    name: string;
    avatar: string;
  };
}

// Componente que renderiza uma linha individual de tarefa
const TaskRow = ({ task }: { task: Task }) => {
  return (
    // Container principal da linha de tarefa com estilo de hover e borda inferior
    <div className="flex items-center justify-between py-2 px-4 hover:bg-muted/50 border-b">
      {/* Seção esquerda com checkbox, título e prioridade */}
      <div className="flex items-center gap-4 flex-1">
        <Checkbox />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{task.title}</span>
            {/* Badge de prioridade com cores condicionais */}
            <Badge 
              variant="outline"
              className={
                task.priority === 'high' ? 'bg-error/20 text-error border-error/20' : 
                task.priority === 'medium' ? 'bg-warning/20 text-warning border-warning/20' : 
                'bg-success/20 text-success border-success/20'
              }
            >
              {task.priority === 'high' ? 'Alta' : 
               task.priority === 'medium' ? 'Média' : 'Baixa'}
            </Badge>
          </div>
          {/* Informações do projeto e cliente */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{task.project.name}</span>
            <span>•</span>
            <span>{task.client.name}</span>
          </div>
        </div>
      </div>

      {/* Seção direita com status, avatar e menu de ações */}
      <div className="flex items-center gap-4">
        {/* Badge de status com cores condicionais */}
        <Badge 
          variant="secondary"
          className={
            task.status === 'pending' ? 'bg-warning/20 text-warning' :
            task.status === 'in-progress' ? 'bg-primary/20 text-primary' :
            'bg-success/20 text-success'
          }
        >
          {task.status === 'pending' ? 'Pendente' :
           task.status === 'in-progress' ? 'Em Andamento' :
           'Concluída'}
        </Badge>
        {/* Avatar do responsável pela tarefa */}
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img 
            src={task.assignedTo.avatar}
            alt={task.assignedTo.name}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Menu dropdown de ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem>Alterar Status</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskRow;
