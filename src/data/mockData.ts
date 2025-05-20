
import { Task, User, Project } from "@/components/tasks/types";

export const users: User[] = [
  { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
];

export const projects: Project[] = [
  { id: 1, name: "Campanha de Lançamento" },
  { id: 2, name: "Redesign de Site" },
  { id: 3, name: "Campanha de Mídia Social" },
  { id: 4, name: "Redesign de Marca" },
  { id: 5, name: "Marketing de Conteúdo" }
];

export const tasks: Task[] = [
  {
    id: 1,
    companyName: "Tech Solutions",
    companyLogo: "https://i.pravatar.cc/150?img=10",
    title: "Revisar conteúdo da landing page",
    status: "pending",
    dueDate: "15/06/2023",
    priority: "high",
    assignedTo: users[0],
    description: "Revisar e aprovar o conteúdo da nova landing page para o lançamento do produto.",
    project: projects[0]
  },
  {
    id: 2,
    companyName: "Marketing Pro",
    companyLogo: "https://i.pravatar.cc/150?img=11",
    title: "Criar posts para redes sociais",
    status: "in-progress",
    dueDate: "20/06/2023",
    priority: "medium",
    assignedTo: users[1],
    description: "Desenvolver uma série de posts para Instagram e Facebook sobre o novo serviço.",
    project: projects[2]
  },
  {
    id: 3,
    companyName: "Design Studio",
    companyLogo: "https://i.pravatar.cc/150?img=12",
    title: "Finalizar novo logotipo",
    status: "completed",
    dueDate: "10/06/2023",
    priority: "low",
    assignedTo: users[2],
    description: "Finalizar as versões do novo logotipo para aprovação do cliente.",
    project: projects[3]
  },
  {
    id: 4,
    companyName: "Web Agency",
    companyLogo: "https://i.pravatar.cc/150?img=13",
    title: "Implementar Google Analytics",
    status: "pending",
    dueDate: "25/06/2023",
    priority: "high",
    assignedTo: users[3],
    description: "Configurar e implementar Google Analytics no novo site do cliente.",
    project: projects[1]
  },
  {
    id: 5,
    companyName: "Content First",
    companyLogo: "https://i.pravatar.cc/150?img=14",
    title: "Escrever artigo sobre SEO",
    status: "in-progress",
    dueDate: "30/06/2023",
    priority: "medium",
    assignedTo: users[4],
    description: "Desenvolver um artigo sobre boas práticas de SEO para o blog do cliente.",
    project: projects[4]
  },
  {
    id: 6,
    companyName: "Tech Solutions",
    companyLogo: "https://i.pravatar.cc/150?img=10",
    title: "Preparar apresentação de resultados",
    status: "pending",
    dueDate: "05/07/2023",
    priority: "high",
    assignedTo: users[0],
    description: "Preparar apresentação com os resultados da campanha para reunião com o cliente.",
    project: projects[0]
  }
];
