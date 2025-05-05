
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CircleDashed } from "lucide-react";

interface ProjectTask {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  assignedTo?: {
    name: string;
    avatar: string;
  };
}

interface ProjectMember {
  id: number;
  name: string;
  avatar: string;
  role?: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: string;
  progress: number;
  tasks: { completed: number; total: number };
  team: ProjectMember[];
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for project tasks
const projectTasks: ProjectTask[] = [
  { 
    id: 1, 
    title: "Criar wireframes do site", 
    status: "completed", 
    dueDate: "10/04/2025",
    assignedTo: { name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" } 
  },
  { 
    id: 2, 
    title: "Desenvolver landing page", 
    status: "in-progress", 
    dueDate: "15/04/2025",
    assignedTo: { name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" } 
  },
  { 
    id: 3, 
    title: "Implementar integração de API", 
    status: "pending", 
    dueDate: "20/04/2025",
    assignedTo: { name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" } 
  },
  { 
    id: 4, 
    title: "Revisar conteúdo do site", 
    status: "pending", 
    dueDate: "25/04/2025",
    assignedTo: { name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" } 
  }
];

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  if (!project) return null;

  const renderStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/20 text-success">Concluída</Badge>;
      case "in-progress":
        return <Badge className="bg-warning/20 text-warning">Em andamento</Badge>;
      case "pending":
        return <Badge className="bg-muted">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">Cliente: {project.client}</p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data de início</p>
              <p className="text-sm font-medium">{project.startDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data de entrega</p>
              <p className="text-sm font-medium">{project.dueDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <div>
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
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Descrição</p>
            <p>{project.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progresso</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <Tabs defaultValue="tasks">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">Tarefas ({project.tasks.total})</TabsTrigger>
              <TabsTrigger value="team">Equipe ({project.team.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-4">
              <div className="space-y-3">
                {projectTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {task.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <CircleDashed className="h-5 w-5 text-muted-foreground" />
                            )}
                            <h4 className="font-medium">{task.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-sm text-muted-foreground">
                              Vencimento: {task.dueDate}
                            </p>
                            <div>{renderStatus(task.status)}</div>
                          </div>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-right">
                              <p className="text-muted-foreground">Responsável</p>
                              <p>{task.assignedTo.name}</p>
                            </div>
                            <img
                              src={task.assignedTo.avatar}
                              alt={task.assignedTo.name}
                              className="w-8 h-8 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-4">
              <div className="space-y-3">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role || "Membro da equipe"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
