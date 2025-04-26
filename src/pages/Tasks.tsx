
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskTable from "@/components/tasks/TaskTable";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";

const Tasks = () => {
  // Estados para gerenciar filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  const [isMyTasksMode, setIsMyTasksMode] = useState(false);
  
  // Estado para controle do modal de detalhes
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock dados do usuário atual
  const currentUser = {
    id: 1,
    name: "Admin User",
    role: "admin"
  };

  // Mock dados de usuários para o filtro de responsáveis
  const users = [
    { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
  ];

  // Mock de dados de tarefas
  const tasks = [
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
        id: 2,
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
        id: 3,
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
        id: 1,
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
        id: 4,
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
        id: 5,
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    }
  ];

  // Filtrar tarefas com base nos critérios selecionados
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesProject = filterProject === "all" || task.project.id.toString() === filterProject;
    const matchesResponsible = filterResponsible === "all" || 
                              (task.assignedTo && task.assignedTo.id.toString() === filterResponsible);
    const matchesMyTaskMode = !isMyTasksMode || 
                            (task.assignedTo && task.assignedTo.id === currentUser.id);
    
    return matchesSearch && matchesStatus && matchesProject && matchesResponsible && matchesMyTaskMode;
  });

  // Função para abrir o modal de detalhes da tarefa
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Mock de projetos para o filtro
  const projects = [
    { id: 1, name: "Campanha de Lançamento" },
    { id: 2, name: "Redesign de Site" },
    { id: 3, name: "Campanha de Mídia Social" },
    { id: 4, name: "Redesign de Marca" },
    { id: 5, name: "Marketing de Conteúdo" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie as tarefas de todos os projetos</p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="md:flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        
        {/* Modo EU */}
        <Button 
          variant={isMyTasksMode ? "default" : "outline"}
          onClick={() => setIsMyTasksMode(!isMyTasksMode)}
          className="w-full md:w-auto"
        >
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
      </div>

      {/* Tabela de Tarefas */}
      <div className="mt-6">
        <TaskTable 
          tasks={filteredTasks} 
          onTaskClick={handleTaskClick}
        />
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar seus filtros ou criar uma nova tarefa
            </p>
            <Button className="bg-agency-primary hover:bg-agency-secondary">
              <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </div>
        )}
      </div>

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
