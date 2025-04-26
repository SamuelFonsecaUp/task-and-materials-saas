
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Interface para definir a estrutura de uma tarefa
interface Task {
  id: number;
  companyName: string;
  companyLogo: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    name: string;
    avatar: string;
  };
}

// Interface para as props do componente TaskTable
interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

// Componente para renderizar a tabela de tarefas
const TaskTable = ({ tasks, onTaskClick }: TaskTableProps) => {
  // Função para obter as iniciais do nome para o fallback do avatar
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Função para renderizar o status com cores diferentes
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning/20">Pendente</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-success/20 text-success border-success/20">Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Função para renderizar a prioridade com cores diferentes
  const renderPriority = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-success/20 text-success border-success/20">Baixa</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning/20">Média</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-error/20 text-error border-error/20">Alta</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/20">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Empresa</TableHead>
            <TableHead>Título da Tarefa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Responsável</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick(task)}
            >
              {/* Coluna da empresa com logo */}
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={task.companyLogo} 
                      alt={task.companyName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>{task.companyName}</span>
                </div>
              </TableCell>
              
              {/* Título da tarefa */}
              <TableCell>{task.title}</TableCell>
              
              {/* Status com badge colorida */}
              <TableCell>{renderStatus(task.status)}</TableCell>
              
              {/* Data de vencimento */}
              <TableCell>{task.dueDate}</TableCell>
              
              {/* Prioridade com badge colorida */}
              <TableCell>{renderPriority(task.priority)}</TableCell>
              
              {/* Responsável com avatar */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {task.assignedTo?.avatar ? (
                      <AvatarImage 
                        src={task.assignedTo.avatar} 
                        alt={task.assignedTo.name || "Usuário"}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(task.assignedTo?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{task.assignedTo?.name}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
