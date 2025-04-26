
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, ClipboardList, Edit, Plus, Settings, Trash } from "lucide-react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock projects data
  const projects = [
    {
      id: 1,
      name: "Campanha de Lançamento",
      client: "Empresa ABC",
      description: "Campanha completa para lançamento do novo produto XYZ",
      startDate: "01/04/2025",
      dueDate: "28/05/2025",
      status: "active",
      progress: 75,
      tasks: { completed: 15, total: 20 },
      team: [
        { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" }
      ]
    },
    {
      id: 2,
      name: "Redesign de Site",
      client: "Empresa XYZ",
      description: "Redesign completo do site institucional",
      startDate: "15/03/2025",
      dueDate: "15/06/2025",
      status: "active",
      progress: 40,
      tasks: { completed: 8, total: 20 },
      team: [
        { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" }
      ]
    },
    {
      id: 3,
      name: "Campanha de Mídia Social",
      client: "Empresa 123",
      description: "Gestão de mídias sociais mensal",
      startDate: "01/01/2025",
      dueDate: "31/12/2025",
      status: "active",
      progress: 90,
      tasks: { completed: 18, total: 20 },
      team: [
        { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" }
      ]
    },
    {
      id: 4,
      name: "Redesign de Marca",
      client: "Cliente Novo",
      description: "Redesign completo da identidade visual",
      startDate: "10/02/2025",
      dueDate: "10/04/2025",
      status: "completed",
      progress: 100,
      tasks: { completed: 15, total: 15 },
      team: [
        { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
        { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
      ]
    },
    {
      id: 5,
      name: "Marketing de Conteúdo",
      client: "Empresa 456",
      description: "Produção de conteúdo para blog e newsletter",
      startDate: "01/03/2025",
      dueDate: "31/12/2025",
      status: "paused",
      progress: 35,
      tasks: { completed: 7, total: 20 },
      team: [
        { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
      ]
    }
  ];

  // Filter projects based on search term and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os projetos da agência</p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Buscar projetos..."
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
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="paused">Pausados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
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
                      <ClipboardList className="mr-2 h-4 w-4" /> Ver Tarefas
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" /> Cronograma
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive cursor-pointer">
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description}
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progresso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Tarefas: </span>
                    <span className="font-medium">{project.tasks.completed}/{project.tasks.total}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prazo: </span>
                    <span className="font-medium">{project.dueDate}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Status: </span>
                  <Badge className={`
                    ${project.status === 'active' ? 'bg-success/20 text-success' : ''}
                    ${project.status === 'paused' ? 'bg-warning/20 text-warning' : ''}
                    ${project.status === 'completed' ? 'bg-agency-primary/20 text-agency-primary' : ''}
                  `}>
                    {project.status === 'active' ? 'Ativo' : ''}
                    {project.status === 'paused' ? 'Pausado' : ''}
                    {project.status === 'completed' ? 'Concluído' : ''}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member) => (
                    <div key={member.id} className="h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-agency-primary flex items-center justify-center text-xs text-white border-2 border-white">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">Detalhes</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg font-medium mb-2">Nenhum projeto encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Tente ajustar seus filtros ou criar um novo projeto</p>
          <Button className="bg-agency-primary hover:bg-agency-secondary">
            <Plus className="mr-2 h-4 w-4" /> Novo Projeto
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
