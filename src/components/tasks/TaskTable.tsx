import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

// Interface para definir a estrutura de uma tarefa
export interface Task {
  id: number;
  companyName: string;
  companyLogo: string;
  title: string;
  status: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    name: string;
    avatar: string;
  };
  description?: string;
  project?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  checklist?: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

// Interface para as props do componente TaskTable
interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isLoading?: boolean;
  onSort?: (column: string) => void;
}

// Componente para renderizar a tabela de tarefas
const TaskTable = ({ tasks, onTaskClick, isLoading = false, onSort }: TaskTableProps) => {
  // Estado para controlar a coluna de ordenação atual
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [taskStatuses, setTaskStatuses] = useState<Array<{ name: string, color: string }>>([]);

  useEffect(() => {
    fetchTaskStatuses();
  }, []);

  const fetchTaskStatuses = async () => {
    try {
      const { data } = await supabase
        .from('task_statuses')
        .select('name, color')
        .order('order_index');
      
      if (data) {
        setTaskStatuses(data);
      }
    } catch (error) {
      console.error('Error fetching task statuses:', error);
    }
  };

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

  // Função para ordenar colunas
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Se já estamos ordenando por esta coluna, invertemos a direção
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nova coluna para ordenar
      setSortColumn(column);
      setSortDirection('asc');
    }
    
    // Chamar callback de ordenação se fornecido
    if (onSort) {
      onSort(column);
    }
  };

  // Renderiza um cabeçalho de coluna ordenável
  const renderSortableHeader = (title: string, column: string) => (
    <div 
      className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
      onClick={() => handleSort(column)}
    >
      {title}
      {sortColumn === column && (
        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </div>
  );

  // Update the renderStatus function to use custom colors from taskStatuses
  const renderStatus = (status: string) => {
    const statusConfig = taskStatuses.find(s => s.name === status);
    if (!statusConfig) return <Badge variant="outline">{status}</Badge>;

    return (
      <Badge 
        variant="outline" 
        className={`bg-[${statusConfig.color}]/20 text-[${statusConfig.color}] border-[${statusConfig.color}]/20`}
      >
        {status}
      </Badge>
    );
  };

  // Função para renderizar a prioridade com cores diferentes
  const renderPriority = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
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

  // Renderizar skeleton loader quando estiver carregando
  if (isLoading) {
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
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">{renderSortableHeader('Empresa', 'companyName')}</TableHead>
            <TableHead>{renderSortableHeader('Título da Tarefa', 'title')}</TableHead>
            <TableHead>{renderSortableHeader('Status', 'status')}</TableHead>
            <TableHead>{renderSortableHeader('Data de Vencimento', 'dueDate')}</TableHead>
            <TableHead>{renderSortableHeader('Prioridade', 'priority')}</TableHead>
            <TableHead>{renderSortableHeader('Responsável', 'assignedTo')}</TableHead>
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
                      loading="lazy" // Adicionado lazy loading para imagens
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
                        loading="lazy" // Adicionado lazy loading para avatares
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
