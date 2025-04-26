
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskTable, { Task } from "@/components/tasks/TaskTable";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/App";

// Componente principal da página de Tarefas
const Tasks = () => {
  // Estados para gerenciar filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  const [isMyTasksMode, setIsMyTasksMode] = useState(false);
  
  // Estado para controle do modal de detalhes
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(5);
  
  // Estado para carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Estado para ordenação
  const [sortField, setSortField] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Contexto de autenticação
  const auth = useAuth();
  const currentUser = auth.user;

  // Mock dados de usuários para o filtro de responsáveis
  const users = [
    { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
  ];

  // Mock de dados de tarefas (tipadas corretamente)
  const tasks: Task[] = [
    {
      id: 1,
      title: "Criar banner para homepage",
      description: "Criar banner principal para a homepage do novo site",
      companyName: "Empresa ABC",
      companyLogo: "https://i.pravatar.cc/150?img=56",
      project: { id: 2, name: "Redesign de Site" },
      createdAt: "01/05/2025",
      dueDate: "10/05/2025",
      status: "pending",
      priority: "high",
      assignedTo: {
        name: "João Costa",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      checklist: [
        { id: 1, text: "Revisar briefing", completed: true },
        { id: 2, text: "Criar mockup", completed: true },
        { id: 3, text: "Enviar para aprovação", completed: false }
      ]
    },
    {
      id: 2,
      title: "Escrever copy para anúncios",
      description: "Desenvolver textos para campanha de Google Ads",
      companyName: "Empresa XYZ",
      companyLogo: "https://i.pravatar.cc/150?img=57",
      project: { id: 1, name: "Campanha de Lançamento" },
      createdAt: "02/05/2025",
      dueDate: "12/05/2025",
      status: "in-progress",
      priority: "medium",
      assignedTo: {
        name: "Maria Souza",
        avatar: "https://i.pravatar.cc/150?img=3"
      }
    },
    {
      id: 3,
      title: "Criar calendário de conteúdo",
      description: "Planejar conteúdo para mídias sociais do próximo mês",
      companyName: "Empresa 123",
      companyLogo: "https://i.pravatar.cc/150?img=58",
      project: { id: 3, name: "Campanha de Mídia Social" },
      createdAt: "28/04/2025",
      dueDate: "15/05/2025",
      status: "completed",
      priority: "medium",
      assignedTo: {
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    },
    {
      id: 4,
      title: "Desenvolver landing page",
      description: "Criar landing page para nova campanha",
      companyName: "Empresa ABC",
      companyLogo: "https://i.pravatar.cc/150?img=56",
      project: { id: 1, name: "Campanha de Lançamento" },
      createdAt: "05/05/2025",
      dueDate: "20/05/2025",
      status: "pending",
      priority: "high",
      assignedTo: {
        name: "Carlos Pereira",
        avatar: "https://i.pravatar.cc/150?img=4"
      }
    },
    {
      id: 5,
      title: "Revisar materiais de SEO",
      description: "Revisar conteúdos otimizados para SEO",
      companyName: "Empresa XYZ",
      companyLogo: "https://i.pravatar.cc/150?img=57",
      project: { id: 5, name: "Marketing de Conteúdo" },
      createdAt: "07/05/2025",
      dueDate: "18/05/2025",
      status: "in-progress",
      priority: "low",
      assignedTo: {
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    },
    {
      id: 6,
      title: "Otimizar imagens do site",
      description: "Comprimir e otimizar todas as imagens do site para melhor performance",
      companyName: "Empresa 123",
      companyLogo: "https://i.pravatar.cc/150?img=58",
      project: { id: 2, name: "Redesign de Site" },
      createdAt: "08/05/2025",
      dueDate: "17/05/2025",
      status: "pending",
      priority: "medium",
      assignedTo: {
        name: "João Costa",
        avatar: "https://i.pravatar.cc/150?img=2"
      }
    },
    {
      id: 7,
      title: "Planejar campanha Black Friday",
      description: "Criar estratégia e definir materiais para campanha de Black Friday",
      companyName: "Empresa ABC",
      companyLogo: "https://i.pravatar.cc/150?img=56",
      project: { id: 4, name: "Black Friday 2025" },
      createdAt: "10/05/2025",
      dueDate: "30/05/2025",
      status: "pending",
      priority: "urgent",
      assignedTo: {
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    }
  ];

  // Efeito para simulação de carregamento dos dados
  useEffect(() => {
    // Simulando chamada de API
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock de projetos para o filtro
  const projects = [
    { id: 1, name: "Campanha de Lançamento" },
    { id: 2, name: "Redesign de Site" },
    { id: 3, name: "Campanha de Mídia Social" },
    { id: 4, name: "Redesign de Marca" },
    { id: 5, name: "Marketing de Conteúdo" }
  ];

  // Função para ordenar tarefas com base nos critérios selecionados
  const sortTasks = (tasksToSort: Task[]): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      let valueA, valueB;

      // Determinar valores a comparar com base no campo de ordenação
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
          // Converter datas no formato DD/MM/YYYY para objetos Date
          const partsA = a.dueDate.split('/');
          const partsB = b.dueDate.split('/');
          valueA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`);
          valueB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`);
          break;
        case 'priority':
          // Mapear prioridades para valores numéricos para ordenação
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

      // Ordenar de acordo com a direção selecionada
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Filtrar tarefas com base nos critérios selecionados
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

  // Aplicar filtros e ordenação
  const filteredAndSortedTasks = sortTasks(applyFilters(tasks));

  // Calcular paginação
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calcula o número total de páginas baseado nas tarefas filtradas
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredAndSortedTasks.length / tasksPerPage)));
    // Resetar para primeira página quando filtros mudam
    setCurrentPage(1);
  }, [filteredAndSortedTasks.length, tasksPerPage, searchTerm, filterStatus, filterProject, filterResponsible, isMyTasksMode]);

  // Função para abrir o modal de detalhes da tarefa
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Função para tratar mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo da lista quando mudar de página
    window.scrollTo(0, 0);
  };

  // Função para lidar com a ordenação
  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  // Função para criar uma nova tarefa
  const handleNewTask = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novas tarefas estará disponível em breve.",
    });
  };

  // Renderiza links de paginação
  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5; // Número máximo de links visíveis
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajusta o início se não temos páginas suficientes no final
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie as tarefas de todos os projetos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/80" onClick={handleNewTask}>
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      {/* Filtros */}
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
        
        {/* Modo EU */}
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
        
        {/* Filtro de responsável */}
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
        
        {/* Filtro de status */}
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
        
        {/* Filtro de projeto */}
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

        {/* Botão de recarregar */}
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

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        Exibindo {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredAndSortedTasks.length)} de {filteredAndSortedTasks.length} tarefas
      </div>

      {/* Tabela de Tarefas */}
      <div className="mt-6">
        <TaskTable 
          tasks={currentTasks} 
          onTaskClick={handleTaskClick}
          isLoading={isLoading}
          onSort={handleSort}
        />
        
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

      {/* Paginação */}
      {!isLoading && filteredAndSortedTasks.length > 0 && (
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

      {/* Modal de detalhes da tarefa */}
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
