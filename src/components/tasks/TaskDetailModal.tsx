import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MessageSquare, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "./TaskTable";

// Interface para as props do componente TaskDetailModal
interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

// Componente do modal de detalhes da tarefa
const TaskDetailModal = ({ task, isOpen, onClose }: TaskDetailModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  
  // Estado local para gerenciar comentários
  const [comments, setComments] = useState<{
    id: number;
    text: string;
    user: {
      name: string;
      avatar: string;
    };
    timestamp: string;
  }[]>([]);

  // Mock de dados para o log de alterações
  const [activityLog, setActivityLog] = useState<{
    id: number;
    action: string;
    user: string;
    timestamp: string;
  }[]>([]);

  // Efeito para carregar comentários e log quando o modal é aberto
  useEffect(() => {
    if (isOpen && task) {
      setIsLoading(true);
      
      // Simulando uma chamada de API para obter comentários
      setTimeout(() => {
        const mockComments = [
          {
            id: 1,
            text: "Já comecei a trabalhar nesta tarefa, devo finalizar até amanhã.",
            user: {
              name: "João Costa",
              avatar: "https://i.pravatar.cc/150?img=2"
            },
            timestamp: "Hoje, 14:30"
          },
          {
            id: 2,
            text: "Ótimo! Estou aguardando para revisão.",
            user: {
              name: "Ana Silva",
              avatar: "https://i.pravatar.cc/150?img=1"
            },
            timestamp: "Hoje, 15:15"
          }
        ];
        
        const mockActivityLog = [
          {
            id: 1,
            action: "Tarefa criada",
            user: "Maria Souza",
            timestamp: "01/05/2025, 09:45"
          },
          {
            id: 2,
            action: "Status alterado para 'Em Andamento'",
            user: "João Costa",
            timestamp: "03/05/2025, 10:30"
          },
          {
            id: 3,
            action: "Prazo alterado de 08/05/2025 para 10/05/2025",
            user: "Ana Silva",
            timestamp: "04/05/2025, 16:20"
          }
        ];
        
        setComments(mockComments);
        setActivityLog(mockActivityLog);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, task]);

  // Função para enviar comentário
  const handleSendComment = () => {
    if (commentText.trim()) {
      setIsSendingComment(true);
      
      // Simulando uma chamada de API para enviar comentário
      setTimeout(() => {
        const newComment = {
          id: comments.length + 1,
          text: commentText,
          user: {
            name: "Admin User",
            avatar: "https://i.pravatar.cc/150?img=68"
          },
          timestamp: "Agora"
        };
        
        setComments([...comments, newComment]);
        setCommentText("");
        setIsSendingComment(false);
        
        // Aqui seria feita a chamada para a API: POST /api/tasks/{id}/comments
        console.log("Enviando comentário para API:", { taskId: task.id, text: commentText });
      }, 500);
    }
  };

  // Função para obter as iniciais do nome para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Renderização do status com cores diferentes
  const renderStatus = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/20">Pendente</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary/20 text-primary border-primary/20">Em Andamento</Badge>;
      case 'completed':
        return <Badge className="bg-success/20 text-success border-success/20">Concluída</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Renderização da prioridade com cores diferentes
  const renderPriority = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-success/20 text-success border-success/20">Baixa</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-warning/20">Média</Badge>;
      case 'high':
        return <Badge className="bg-error/20 text-error border-error/20">Alta</Badge>;
      case 'urgent':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/20">Urgente</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // First, let's define the allowed status types to ensure type safety
  type TaskStatus = "completed" | "pending" | "in-progress";

  // We need to map any string status to one of the allowed values
  const mapStatusToAllowedValue = (status: string): TaskStatus => {
    if (status === "completed") return "completed";
    if (status === "in-progress") return "in-progress";
    return "pending"; // Default fallback
  };

  // Then, when using the status in the component, we need to map it:
  // Change line 176 from something like:
  // renderStatus(task.status)
  // to:
  // renderStatus(mapStatusToAllowedValue(task.status))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50" /> {/* Overlay escuro para bloquear o background */}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            {renderStatus(mapStatusToAllowedValue(task.status))}
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="log">Log de Alterações</TabsTrigger>
          </TabsList>
          
          {/* Tab de Detalhes */}
          <TabsContent value="details" className="space-y-6">
            {/* Cabeçalho com informações da empresa */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-12 w-12 rounded overflow-hidden">
                <img 
                  src={task.companyLogo} 
                  alt={task.companyName}
                  className="h-full w-full object-cover"
                  loading="lazy" // Lazy loading para imagem
                />
              </div>
              <div>
                <h4 className="font-semibold">{task.companyName}</h4>
                {task.project && <p className="text-sm text-muted-foreground">{task.project.name}</p>}
              </div>
            </div>
            
            {/* Detalhes principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data de Criação:</span>
                  <span>{task.createdAt || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Prazo:</span>
                  <span>{task.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Prioridade:</span>
                  {renderPriority(task.priority)}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Responsável:</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {task.assignedTo?.avatar ? (
                      <AvatarImage 
                        src={task.assignedTo.avatar} 
                        alt={task.assignedTo.name}
                        loading="lazy"
                      />
                    ) : null}
                    <AvatarFallback>
                      {task.assignedTo?.name ? getInitials(task.assignedTo.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{task.assignedTo?.name}</span>
                </div>
              </div>
            </div>
            
            {/* Descrição da tarefa */}
            <div>
              <h4 className="text-sm font-medium mb-2">Descrição</h4>
              <p className="text-sm">{task.description || "Sem descrição disponível."}</p>
            </div>
            
            {/* Checklist (se disponível) */}
            {task.checklist && task.checklist.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Checklist</h4>
                <ul className="space-y-2">
                  {task.checklist.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        readOnly
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className={item.completed ? "line-through text-sm text-muted-foreground" : "text-sm"}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* Tab de Comentários */}
          <TabsContent value="comments" className="space-y-4">
            {/* Estado de carregamento para comentários */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-12 w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Lista de comentários */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={comment.user.avatar} 
                          alt={comment.user.name} 
                          loading="lazy"
                        />
                        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{comment.user.name}</p>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>Nenhum comentário ainda.</p>
                    </div>
                  )}
                </div>
                
                {/* Formulário para novo comentário */}
                <div className="flex items-center gap-2 mt-4">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="resize-none"
                    rows={3}
                    disabled={isSendingComment}
                  />
                </div>
                <Button 
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || isSendingComment} 
                  className="w-full"
                >
                  <Send className={`h-4 w-4 mr-2 ${isSendingComment ? 'animate-pulse' : ''}`} />
                  {isSendingComment ? 'Enviando...' : 'Enviar Comentário'}
                </Button>
              </>
            )}
          </TabsContent>
          
          {/* Tab de Log de Alterações */}
          <TabsContent value="log" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">por {log.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                ))}
                
                {activityLog.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nenhuma alteração registrada.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
