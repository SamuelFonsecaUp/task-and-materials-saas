import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, RefreshCw, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskTable, { Task } from "@/components/tasks/TaskTable";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/App";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  const [isMyTasksMode, setIsMyTasksMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const auth = useAuth();
  const currentUser = auth.user;
  const users = [
    { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
  ];
  const tasks: Task[] = [
    // ... keep existing task data
  ];
  const projects = [
    { id: 1, name: "Campanha de Lançamento" },
    { id: 2, name: "Redesign de Site" },
    { id: 3, name: "Campanha de Mídia Social" },
    { id: 4, name: "Redesign de Marca" },
    { id: 5, name: "Marketing de Conteúdo" }
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const sortTasks = (tasksToSort: Task[]): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case 'companyName':
          valueA = a.companyName;
          valueB = b.companyName;
          break;
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'dueDate':
          const partsA = a.dueDate.split('/');
          const partsB = b.dueDate.split('/');
          valueA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`);
          valueB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`);
          break;
        case 'priority':
          const priorityMap: {[key: string]: number} = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
          valueA = priorityMap[a.priority];
          valueB = priorityMap[b.priority];
          break;
        case 'assignedTo':
          valueA = a.assignedTo?.name || '';
          valueB = b.assignedTo?.name || '';
          break;
        default:
          valueA = a.dueDate;
          valueB = b.dueDate;
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  const applyFilters = (tasksToFilter: Task[]): Task[] => {
    return tasksToFilter.filter((task) => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        task.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesProject = filterProject === "all" || task.project?.id.toString() === filterProject;
      const matchesResponsible = filterResponsible === "all" || 
                              (task.assignedTo && task.assignedTo.name === users.find(u => u.id.toString() === filterResponsible)?.name);
      const matchesMyTaskMode = !isMyTasksMode || 
                            (task.assignedTo && task.assignedTo.name === currentUser?.name);
      
      return matchesSearch && matchesStatus && matchesProject && matchesResponsible && matchesMyTaskMode;
    });
  };

  const filteredAndSortedTasks = sortTasks(applyFilters(tasks));

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredAndSortedTasks.length / tasksPerPage)));
    setCurrentPage(1);
  }, [filteredAndSortedTasks.length, tasksPerPage, searchTerm, filterStatus, filterProject, filterResponsible, isMyTasksMode]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  const handleNewTask = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novas tarefas estará disponível em breve.",
    });
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
  };

  const [viewMode, setViewMode] = useState<"table" | "board">("table");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie as tarefas de todos os projetos</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "table" ? "board" : "table")}
          >
            {viewMode === "table" ? (
              <>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Visualização em Colunas
              </>
            ) : (
              <>
                <TableIcon className="mr-2 h-4 w-4" />
                Visualização em Tabela
              </>
            )}
          </Button>
          <Button className="bg-primary hover:bg-primary/80" onClick={handleNewTask}>
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="md:flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas por título, empresa ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        
        <Button 
          variant={isMyTasksMode ? "default" : "outline"}
          onClick={() => setIsMyTasksMode(!isMyTasksMode)}
          className={`w-full md:w-auto ${isMyTasksMode ? 'bg-primary hover:bg-primary/80' : ''}`}
        >
          {isMyTasksMode ? (
            <Badge variant="outline" className="bg-white text-primary border-white mr-2">
              Ativado
            </Badge>
          ) : null}
          Modo EU
        </Button>
        
        <Select value={filterResponsible} onValueChange={setFilterResponsible}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="in-progress">Em andamento</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Exibindo {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredAndSortedTasks.length)} de {filteredAndSortedTasks.length} tarefas
      </div>

      <div className="mt-6">
        {viewMode === "table" ? (
          <TaskTable 
            tasks={currentTasks} 
            onTaskClick={handleTaskClick}
            isLoading={isLoading}
            onSort={handleSort}
          />
        ) : (
          <TaskBoard
            tasks={currentTasks}
            onTaskClick={handleTaskClick}
          />
        )}
        
        {!isLoading && filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar seus filtros ou criar uma nova tarefa
            </p>
            <Button className="bg-primary hover:bg-primary/80" onClick={handleNewTask}>
              <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </div>
        )}
      </div>

      {!isLoading && filteredAndSortedTasks.length > 0 && viewMode === "table" && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {renderPaginationLinks()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Tasks;
