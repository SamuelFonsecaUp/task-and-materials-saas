
import { useState } from "react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Plus, Settings, Trash } from "lucide-react";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  
  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: "Criar banner para homepage",
      description: "Criar banner principal para a homepage do novo site",
      project: { id: 2, name: "Redesign de Site" },
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
      project: { id: 1, name: "Campanha de Lançamento" },
      dueDate: "12/05/2025",
      status: "in-progress",
      priority: "medium",
      assignedTo: {
        id: 3,
        name: "Maria Souza",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      checklist: [
        { id: 1, text: "Analisar palavras-chave", completed: true },
        { id: 2, text: "Escrever títulos", completed: true },
        { id: 3, text: "Escrever descrições", completed: false },
        { id: 4, text: "Revisar e finalizar", completed: false }
      ]
    },
    {
      id: 3,
      title: "Criar calendário de conteúdo",
      description: "Planejar conteúdo para mídias sociais do próximo mês",
      project: { id: 3, name: "Campanha de Mídia Social" },
      dueDate: "15/05/2025",
      status: "completed",
      priority: "medium",
      assignedTo: {
        id: 1,
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      checklist: [
        { id: 1, text: "Definir temas", completed: true },
        { id: 2, text: "Criar cronograma", completed: true },
        { id: 3, text: "Definir responsáveis", completed: true }
      ]
    },
    {
      id: 4,
      title: "Desenvolver landing page",
      description: "Criar landing page para nova campanha",
      project: { id: 1, name: "Campanha de Lançamento" },
      dueDate: "20/05/2025",
      status: "pending",
      priority: "high",
      assignedTo: {
        id: 4,
        name: "Carlos Pereira",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      checklist: [
        { id: 1, text: "Wireframe", completed: true },
        { id: 2, text: "Design", completed: false },
        { id: 3, text: "Desenvolvimento", completed: false },
        { id: 4, text: "Testes", completed: false }
      ]
    },
    {
      id: 5,
      title: "Revisar materiais de SEO",
      description: "Revisar conteúdos otimizados para SEO",
      project: { id: 5, name: "Marketing de Conteúdo" },
      dueDate: "18/05/2025",
      status: "in-progress",
      priority: "low",
      assignedTo: {
        id: 5,
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      checklist: [
        { id: 1, text: "Revisar meta titles", completed: true },
        { id: 2, text: "Revisar meta descriptions", completed: true },
        { id: 3, text: "Revisar conteúdo interno", completed: false },
        { id: 4, text: "Otimizar links", completed: false }
      ]
    }
  ];

  // Mock projects for filter
  const projects = [
    { id: 1, name: "Campanha de Lançamento" },
    { id: 2, name: "Redesign de Site" },
    { id: 3, name: "Campanha de Mídia Social" },
    { id: 4, name: "Redesign de Marca" },
    { id: 5, name: "Marketing de Conteúdo" }
  ];

  // Filter tasks based on search term, status and project
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesProject = filterProject === "all" || task.project.id.toString() === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const pendingTasks = filteredTasks.filter((task) => task.status === "pending");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress");
  const completedTasks = filteredTasks.filter((task) => task.status === "completed");

  const renderChecklist = (checklist) => {
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Checklist</span>
          <span>{completed}/{total}</span>
        </div>
        <div className="space-y-1">
          {checklist.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center">
              <Checkbox id={`checklist-${item.id}`} checked={item.completed} disabled />
              <label 
                htmlFor={`checklist-${item.id}`} 
                className={`ml-2 text-xs ${item.completed ? 'line-through text-gray-400' : ''}`}
              >
                {item.text}
              </label>
            </div>
          ))}
          {checklist.length > 2 && (
            <div className="text-xs text-agency-primary">+ {checklist.length - 2} mais items</div>
          )}
        </div>
      </div>
    );
  };

  const renderTaskCard = (task) => (
    <Card key={task.id} className="card-hover mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h3 className="font-medium">{task.title}</h3>
              <Badge 
                className={`ml-2 ${
                  task.priority === 'high' ? 'bg-error/20 text-error' : 
                  task.priority === 'medium' ? 'bg-warning/20 text-warning' : 
                  'bg-success/20 text-success'
                }`}
              >
                {task.priority === 'high' ? 'Alta' : 
                 task.priority === 'medium' ? 'Média' : 'Baixa'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {task.description}
            </p>
            <div className="flex justify-between items-center text-sm">
              <div className="text-agency-primary font-medium">
                {task.project.name}
              </div>
              <div className="text-gray-500">
                Prazo: {task.dueDate}
              </div>
            </div>
            
            {renderChecklist(task.checklist)}
          </div>
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Alterar Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <Trash className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img 
                src={task.assignedTo.avatar} 
                alt={task.assignedTo.name} 
                className="h-full w-full object-cover" 
              />
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {task.assignedTo.name}
            </span>
          </div>
          <Badge 
            className={`
              ${task.status === 'pending' ? 'status-pending' : ''}
              ${task.status === 'in-progress' ? 'status-in-progress' : ''}
              ${task.status === 'completed' ? 'status-completed' : ''}
            `}
          >
            {task.status === 'pending' ? 'Pendente' : ''}
            {task.status === 'in-progress' ? 'Em Andamento' : ''}
            {task.status === 'completed' ? 'Concluída' : ''}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
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
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todas ({filteredTasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Em Andamento ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídas ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredTasks.map(renderTaskCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingTasks.map(renderTaskCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <div className="space-y-4">
            {inProgressTasks.map(renderTaskCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedTasks.map(renderTaskCard)}
          </div>
        </TabsContent>
      </Tabs>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</p>
          <p className="text-sm text-muted-foreground mb-4">Tente ajustar seus filtros ou criar uma nova tarefa</p>
          <Button className="bg-agency-primary hover:bg-agency-secondary">
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
