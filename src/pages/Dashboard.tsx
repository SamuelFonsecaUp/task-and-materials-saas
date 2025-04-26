
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardCheck, Folder, MessageCircle, User } from "lucide-react";

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Projetos Ativos",
      value: "12",
      icon: <Folder className="h-5 w-5" />,
      change: "+2",
      color: "bg-agency-primary/10 text-agency-primary",
    },
    {
      title: "Tarefas Pendentes",
      value: "36",
      icon: <ClipboardCheck className="h-5 w-5" />,
      change: "-5",
      color: "bg-warning/10 text-warning",
    },
    {
      title: "Materiais para Aprovação",
      value: "8",
      icon: <MessageCircle className="h-5 w-5" />,
      change: "+3",
      color: "bg-agency-secondary/10 text-agency-secondary",
    },
    {
      title: "Clientes Ativos",
      value: "24",
      icon: <User className="h-5 w-5" />,
      change: "+1",
      color: "bg-success/10 text-success",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Campanha de Lançamento",
      client: "Empresa ABC",
      progress: 75,
      tasks: { completed: 15, total: 20 },
      dueDate: "28/05/2025",
    },
    {
      id: 2,
      name: "Redesign de Site",
      client: "Empresa XYZ",
      progress: 40,
      tasks: { completed: 8, total: 20 },
      dueDate: "15/06/2025",
    },
    {
      id: 3,
      name: "Campanha de Mídia Social",
      client: "Empresa 123",
      progress: 90,
      tasks: { completed: 18, total: 20 },
      dueDate: "10/05/2025",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Revisar materiais de campanha",
      project: "Campanha de Lançamento",
      dueDate: "05/05/2025",
      status: "pending",
    },
    {
      id: 2,
      title: "Finalizar design da home",
      project: "Redesign de Site",
      dueDate: "07/05/2025",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Criar copy para anúncios",
      project: "Campanha de Mídia Social",
      dueDate: "10/05/2025",
      status: "pending",
    },
    {
      id: 4,
      title: "Apresentação para cliente",
      project: "Campanha de Lançamento",
      dueDate: "12/05/2025",
      status: "pending",
    },
  ];

  const recentMaterials = [
    {
      id: 1,
      name: "Banner Principal - Home",
      project: "Redesign de Site",
      uploadDate: "03/05/2025",
      status: "pending-approval",
    },
    {
      id: 2,
      name: "Logotipo Final",
      project: "Redesign de Marca",
      uploadDate: "02/05/2025",
      status: "changes-requested",
    },
    {
      id: 3,
      name: "Post Instagram - Produto X",
      project: "Campanha de Mídia Social",
      uploadDate: "01/05/2025",
      status: "approved",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Reunião de Kick-off",
      project: "Novo Projeto",
      date: "08/05/2025",
      time: "10:00",
    },
    {
      id: 2,
      title: "Apresentação para Cliente",
      project: "Campanha de Lançamento",
      date: "10/05/2025",
      time: "14:30",
    },
    {
      id: 3,
      title: "Review de Materiais",
      project: "Redesign de Site",
      date: "12/05/2025",
      time: "11:00",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className={stat.change.includes("+") ? "text-success" : "text-warning"}>
                  {stat.change} este mês
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <h2 className="section-header">Projetos em Andamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-start">
                    <span>{project.name}</span>
                  </CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </CardHeader>
                <CardContent>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <h2 className="section-header">Tarefas Próximas</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <Card key={task.id} className="card-hover">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.dueDate}</p>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="materials" className="space-y-4">
          <h2 className="section-header">Materiais Recentes</h2>
          <div className="space-y-4">
            {recentMaterials.map((material) => (
              <Card key={material.id} className="card-hover">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{material.name}</h3>
                    <p className="text-sm text-muted-foreground">{material.project}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{material.uploadDate}</p>
                      <Badge 
                        className={`
                          ${material.status === 'pending-approval' ? 'status-pending' : ''}
                          ${material.status === 'changes-requested' ? 'status-changes-requested' : ''}
                          ${material.status === 'approved' ? 'status-approved' : ''}
                        `}
                      >
                        {material.status === 'pending-approval' ? 'Aguardando Aprovação' : ''}
                        {material.status === 'changes-requested' ? 'Alterações Solicitadas' : ''}
                        {material.status === 'approved' ? 'Aprovado' : ''}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard de Tráfego Pago</CardTitle>
              <CardDescription>Visão geral das campanhas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-lg bg-gray-50 text-center p-4">
                <div>
                  <p className="text-lg font-medium text-agency-primary mb-2">Looker Studio Dashboard</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integração com Looker Studio para visualização de dados de tráfego pago aparecerá aqui.
                  </p>
                  <Badge className="bg-agency-primary">Implementação Futura</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Próximos Eventos</span>
                <Calendar className="h-5 w-5 text-agency-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-3 last:border-0">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.project}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{event.date}</span>
                      <span className="mx-1">•</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
