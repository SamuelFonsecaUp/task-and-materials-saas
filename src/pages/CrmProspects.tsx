
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProspectDetailModal from "@/components/crm/ProspectDetailModal";

// Componente da página de CRM de Prospectos
const CrmProspects = () => {
  // Estados para gerenciar filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  
  // Estado para controle do modal de detalhes
  const [selectedProspect, setSelectedProspect] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock de dados de usuários para o filtro de responsáveis
  const users = [
    { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
  ];

  // Mock de dados de prospectos
  const prospects = [
    {
      id: 1,
      companyName: "Tech Solutions",
      contactName: "Roberto Gomes",
      contactEmail: "roberto@techsolutions.com",
      contactPhone: "(11) 98765-4321",
      status: "contact",
      lastUpdated: "02/05/2025",
      nextAction: "05/05/2025",
      assignedTo: {
        id: 1,
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      interactions: [
        {
          id: 1,
          type: "email",
          date: "01/05/2025",
          description: "Envio de email inicial apresentando nossos serviços",
          user: "Ana Silva"
        },
        {
          id: 2,
          type: "call",
          date: "02/05/2025",
          description: "Ligação para follow-up do email. Cliente mostrou interesse.",
          user: "Ana Silva"
        }
      ]
    },
    {
      id: 2,
      companyName: "Global Marketing",
      contactName: "Lúcia Ferreira",
      contactEmail: "lucia@globalmarketing.com",
      contactPhone: "(11) 91234-5678",
      status: "proposal",
      lastUpdated: "03/05/2025",
      nextAction: "07/05/2025",
      assignedTo: {
        id: 2,
        name: "João Costa",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      interactions: [
        {
          id: 1,
          type: "meeting",
          date: "28/04/2025",
          description: "Reunião inicial para entender necessidades",
          user: "João Costa"
        },
        {
          id: 2,
          type: "email",
          date: "03/05/2025",
          description: "Envio de proposta comercial",
          user: "João Costa"
        }
      ]
    },
    {
      id: 3,
      companyName: "Mega Indústrias",
      contactName: "André Santos",
      contactEmail: "andre@megaindustrias.com",
      contactPhone: "(11) 97777-8888",
      status: "presentation",
      lastUpdated: "01/05/2025",
      nextAction: "06/05/2025",
      assignedTo: {
        id: 3,
        name: "Maria Souza",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      interactions: [
        {
          id: 1,
          type: "call",
          date: "27/04/2025",
          description: "Primeiro contato por telefone",
          user: "Maria Souza"
        },
        {
          id: 2,
          type: "email",
          date: "29/04/2025",
          description: "Envio de catálogo de serviços",
          user: "Maria Souza"
        },
        {
          id: 3,
          type: "meeting",
          date: "01/05/2025",
          description: "Reunião para entendimento de necessidades",
          user: "Maria Souza"
        }
      ]
    },
    {
      id: 4,
      companyName: "Comércio Express",
      contactName: "Fernando Lima",
      contactEmail: "fernando@comercioexpress.com",
      contactPhone: "(11) 95555-6666",
      status: "contact",
      lastUpdated: "04/05/2025",
      nextAction: "08/05/2025",
      assignedTo: {
        id: 4,
        name: "Carlos Pereira",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      interactions: [
        {
          id: 1,
          type: "email",
          date: "04/05/2025",
          description: "Envio de email inicial apresentando nossos serviços",
          user: "Carlos Pereira"
        }
      ]
    }
  ];

  // Filtrar prospectos com base nos critérios selecionados
  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch = prospect.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || prospect.status === filterStatus;
    const matchesResponsible = filterResponsible === "all" || 
                             (prospect.assignedTo && prospect.assignedTo.id.toString() === filterResponsible);
    
    return matchesSearch && matchesStatus && matchesResponsible;
  });

  // Função para abrir o modal de detalhes do prospecto
  const handleProspectClick = (prospect: any) => {
    setSelectedProspect(prospect);
    setIsModalOpen(true);
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

  // Função para renderizar o status com cores diferentes
  const renderStatus = (status: string) => {
    switch (status) {
      case 'contact':
        return <Badge className="bg-primary/20 text-primary">Entrar em Contato</Badge>;
      case 'proposal':
        return <Badge className="bg-warning/20 text-warning">Enviar Proposta</Badge>;
      case 'presentation':
        return <Badge className="bg-success/20 text-success">Marcar Apresentação</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM de Prospectos</h1>
          <p className="text-muted-foreground">Gerencie potenciais clientes e acompanhe interações</p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Prospecto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prospectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        
        {/* Filtro de status */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="contact">Entrar em Contato</SelectItem>
            <SelectItem value="proposal">Enviar Proposta</SelectItem>
            <SelectItem value="presentation">Marcar Apresentação</SelectItem>
          </SelectContent>
        </Select>
        
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
      </div>

      {/* Tabela de Prospectos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prospect/Empresa</TableHead>
              <TableHead>Contato Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead>Próxima Ação</TableHead>
              <TableHead>Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProspects.map((prospect) => (
              <TableRow 
                key={prospect.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleProspectClick(prospect)}
              >
                <TableCell className="font-medium">{prospect.companyName}</TableCell>
                <TableCell>
                  <div>
                    <p>{prospect.contactName}</p>
                    <p className="text-sm text-muted-foreground">{prospect.contactEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{renderStatus(prospect.status)}</TableCell>
                <TableCell>{prospect.lastUpdated}</TableCell>
                <TableCell>{prospect.nextAction}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={prospect.assignedTo.avatar} alt={prospect.assignedTo.name} />
                      <AvatarFallback>{getInitials(prospect.assignedTo.name)}</AvatarFallback>
                    </Avatar>
                    <span>{prospect.assignedTo.name}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProspects.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium mb-2">Nenhum prospecto encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar seus filtros ou criar um novo prospecto
            </p>
            <Button className="bg-agency-primary hover:bg-agency-secondary">
              <Plus className="mr-2 h-4 w-4" /> Novo Prospecto
            </Button>
          </div>
        )}
      </div>

      {/* Modal de detalhes do prospecto */}
      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CrmProspects;
