import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskGroup from "@/components/tasks/TaskGroup";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Group tasks by date
  const tasksByDate = filteredTasks.reduce((groups: Record<string, any[]>, task) => {
    const date = task.dueDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

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

      <div className="mt-6">
        {Object.entries(tasksByDate).map(([date, tasks]) => (
          <TaskGroup 
            key={date}
            day={new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' })}
            count={tasks.length}
            tasks={tasks}
          />
        ))}

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
    </div>
  );
};

export default Tasks;
