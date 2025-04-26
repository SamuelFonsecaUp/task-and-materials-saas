
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, RefreshCw, CheckSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ProspectDetailModal from "@/components/crm/ProspectDetailModal";

// Interface para definir a estrutura de um prospecto
interface Prospect {
  id: number;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'contact' | 'proposal' | 'presentation';
  lastUpdated: string;
  nextAction: string;
  assignedTo: {
    id: number;
    name: string;
    avatar: string;
  };
  interactions?: {
    id: number;
    type: string;
    date: string;
    description: string;
    user: string;
  }[];
}

// Componente da página de CRM de Prospectos
const CrmProspects = () => {
  // Estados para gerenciar filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  
  // Estado para controle do modal de detalhes
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [prospectsPerPage] = useState(5);
  
  // Estado para carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Estado para ordenação
  const [sortField, setSortField] = useState<string>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Estado para seleção de prospectos (bulk actions)
  const [selectedProspects, setSelectedProspects] = useState<number[]>([]);

  // Mock de dados de usuários para o filtro de responsáveis
  const users = [
    { id: 1, name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "João Costa", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Maria Souza", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Carlos Pereira", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Paula Lima", avatar: "https://i.pravatar.cc/150?img=5" }
  ];

  // Mock de dados de prospectos
  const prospects: Prospect[] = [
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
    },
    {
      id: 5,
      companyName: "Consultoria Financeira Ltda",
      contactName: "Marcos Oliveira",
      contactEmail: "marcos@consultoriafinanceira.com",
      contactPhone: "(11) 93333-7777",
      status: "contact",
      lastUpdated: "30/04/2025",
      nextAction: "06/05/2025",
      assignedTo: {
        id: 5,
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      interactions: [
        {
          id: 1,
          type: "email",
          date: "30/04/2025",
          description: "Contato inicial via formulário do site",
          user: "Paula Lima"
        }
      ]
    },
    {
      id: 6,
      companyName: "Arquitetura Moderna",
      contactName: "Cláudia Santos",
      contactEmail: "claudia@arquiteturamoderna.com",
      contactPhone: "(11) 92222-3333",
      status: "proposal",
      lastUpdated: "01/05/2025",
      nextAction: "09/05/2025",
      assignedTo: {
        id: 1,
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      interactions: [
        {
          id: 1,
          type: "meeting",
          date: "29/04/2025",
          description: "Reunião presencial para apresentação de serviços",
          user: "Ana Silva"
        },
        {
          id: 2,
          type: "email",
          date: "01/05/2025",
          description: "Envio de proposta comercial detalhada",
          user: "Ana Silva"
        }
      ]
    },
    {
      id: 7,
      companyName: "Transportadora RápidoJá",
      contactName: "Paulo Mendes",
      contactEmail: "paulo@rapidoja.com",
      contactPhone: "(11) 94444-5555",
      status: "presentation",
      lastUpdated: "03/05/2025",
      nextAction: "12/05/2025",
      assignedTo: {
        id: 2,
        name: "João Costa",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      interactions: [
        {
          id: 1,
          type: "call",
          date: "01/05/2025",
          description: "Contato telefônico para agendamento de apresentação",
          user: "João Costa"
        },
        {
          id: 2,
          type: "email",
          date: "03/05/2025",
          description: "Confirmação de data para apresentação comercial",
          user: "João Costa"
        }
      ]
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

  // Função para ordenar prospectos com base nos critérios selecionados
  const sortProspects = (prospectsToSort: Prospect[]): Prospect[] => {
    return [...prospectsToSort].sort((a, b) => {
      let valueA, valueB;

      // Determinar valores a comparar com base no campo de ordenação
      switch (sortField) {
        case 'companyName':
          valueA = a.companyName;
          valueB = b.companyName;
          break;
        case 'contactName':
          valueA = a.contactName;
          valueB = b.contactName;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'lastUpdated':
          // Converter datas no formato DD/MM/YYYY para objetos Date
          const partsA = a.lastUpdated.split('/');
          const partsB = b.lastUpdated.split('/');
          valueA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`);
          valueB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`);
          break;
        case 'nextAction':
          // Converter datas no formato DD/MM/YYYY para objetos Date
          const nextPartsA = a.nextAction.split('/');
          const nextPartsB = b.nextAction.split('/');
          valueA = new Date(`${nextPartsA[2]}-${nextPartsA[1]}-${nextPartsA[0]}`);
          valueB = new Date(`${nextPartsB[2]}-${nextPartsB[1]}-${nextPartsB[0]}`);
          break;
        case 'assignedTo':
          valueA = a.assignedTo?.name || '';
          valueB = b.assignedTo?.name || '';
          break;
        default:
          valueA = a.companyName;
          valueB = b.companyName;
      }

      // Ordenar de acordo com a direção selecionada
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Filtrar prospectos com base nos critérios selecionados
  const applyFilters = (prospectsToFilter: Prospect[]): Prospect[] => {
    return prospectsToFilter.filter((prospect) => {
      const matchesSearch = 
        prospect.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prospect.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = filterStatus === "all" || prospect.status === filterStatus;
      const matchesResponsible = filterResponsible === "all" || 
                                (prospect.assignedTo && prospect.assignedTo.id.toString() === filterResponsible);
      
      return matchesSearch && matchesStatus && matchesResponsible;
    });
  };

  // Aplicar filtros e ordenação
  const filteredAndSortedProspects = sortProspects(applyFilters(prospects));

  // Calcular paginação
  const indexOfLastProspect = currentPage * prospectsPerPage;
  const indexOfFirstProspect = indexOfLastProspect - prospectsPerPage;
  const currentProspects = filteredAndSortedProspects.slice(indexOfFirstProspect, indexOfLastProspect);

  // Calcula o número total de páginas baseado nos prospectos filtrados
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredAndSortedProspects.length / prospectsPerPage)));
    // Resetar para primeira página quando filtros mudam
    setCurrentPage(1);
  }, [filteredAndSortedProspects.length, prospectsPerPage, searchTerm, filterStatus, filterResponsible]);

  // Função para abrir o modal de detalhes do prospecto
  const handleProspectClick = (prospect: Prospect) => {
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
  const renderStatus = (status: 'contact' | 'proposal' | 'presentation') => {
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

  // Função para selecionar/deselecionar um prospecto
  const handleProspectSelection = (prospectId: number) => {
    if (selectedProspects.includes(prospectId)) {
      setSelectedProspects(selectedProspects.filter(id => id !== prospectId));
    } else {
      setSelectedProspects([...selectedProspects, prospectId]);
    }
  };

  // Função para selecionar/deselecionar todos os prospectos da página atual
  const handleSelectAll = () => {
    if (selectedProspects.length === currentProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(currentProspects.map(p => p.id));
    }
  };

  // Função para lidar com ações em massa
  const handleBulkAction = (action: string) => {
    if (selectedProspects.length === 0) {
      toast({
        title: "Nenhum prospecto selecionado",
        description: "Selecione pelo menos um prospecto para realizar esta ação.",
        variant: "destructive"
      });
      return;
    }
    
    // Em um app real, aqui você enviaria uma requisição para o backend
    console.log(`Realizando ação "${action}" nos prospectos:`, selectedProspects);
    
    toast({
      title: "Ação realizada com sucesso",
      description: `${action} aplicado a ${selectedProspects.length} prospectos.`,
    });
    
    // Limpar seleção após ação
    setSelectedProspects([]);
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

  // Renderização do componente
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM de Prospectos</h1>
          <p className="text-muted-foreground">Gerencie potenciais clientes e acompanhe interações</p>
        </div>
        <Button className="bg-primary hover:bg-primary/80">
          <Plus className="mr-2 h-4 w-4" /> Novo Prospecto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa, contato ou email..."
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

      {/* Ações em massa */}
      {selectedProspects.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div className="text-sm">
            {selectedProspects.length} prospectos selecionados
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Alterar Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Definir status como</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("Alteração de status para: Entrar em Contato")}>
                  Entrar em Contato
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Alteração de status para: Enviar Proposta")}>
                  Enviar Proposta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Alteração de status para: Marcar Apresentação")}>
                  Marcar Apresentação
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Atribuir Para
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Selecione um responsável</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {users.map(user => (
                  <DropdownMenuItem 
                    key={user.id} 
                    onClick={() => handleBulkAction(`Atribuído para: ${user.name}`)}
                  >
                    {user.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedProspects([])}
            >
              Limpar Seleção
            </Button>
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        Exibindo {indexOfFirstProspect + 1}-{Math.min(indexOfLastProspect, filteredAndSortedProspects.length)} de {filteredAndSortedProspects.length} prospectos
      </div>

      {/* Tabela de Prospectos */}
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Prospect/Empresa</TableHead>
                <TableHead>Contato Principal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Próxima Ação</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={
                      currentProspects.length > 0 &&
                      selectedProspects.length === currentProspects.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('companyName')}>
                  <div className="flex items-center">
                    Prospect/Empresa
                    {sortField === 'companyName' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('contactName')}>
                  <div className="flex items-center">
                    Contato Principal
                    {sortField === 'contactName' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                  <div className="flex items-center">
                    Última Atualização
                    {sortField === 'lastUpdated' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('nextAction')}>
                  <div className="flex items-center">
                    Próxima Ação
                    {sortField === 'nextAction' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('assignedTo')}>
                  <div className="flex items-center">
                    Responsável
                    {sortField === 'assignedTo' && (
                      <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProspects.map((prospect) => (
                <TableRow 
                  key={prospect.id} 
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedProspects.includes(prospect.id)}
                      onCheckedChange={() => handleProspectSelection(prospect.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium" onClick={() => handleProspectClick(prospect)}>
                    {prospect.companyName}
                  </TableCell>
                  <TableCell onClick={() => handleProspectClick(prospect)}>
                    <div>
                      <p>{prospect.contactName}</p>
                      <p className="text-sm text-muted-foreground">{prospect.contactEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleProspectClick(prospect)}>
                    {renderStatus(prospect.status)}
                  </TableCell>
                  <TableCell onClick={() => handleProspectClick(prospect)}>
                    {prospect.lastUpdated}
                  </TableCell>
                  <TableCell onClick={() => handleProspectClick(prospect)}>
                    {prospect.nextAction}
                  </TableCell>
                  <TableCell onClick={() => handleProspectClick(prospect)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={prospect.assignedTo.avatar} alt={prospect.assignedTo.name} loading="lazy" />
                        <AvatarFallback>{getInitials(prospect.assignedTo.name)}</AvatarFallback>
                      </Avatar>
                      <span>{prospect.assignedTo.name}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAndSortedProspects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg font-medium mb-2">Nenhum prospecto encontrado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Tente ajustar seus filtros ou criar um novo prospecto
              </p>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="mr-2 h-4 w-4" /> Novo Prospecto
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Paginação */}
      {!isLoading && filteredAndSortedProspects.length > 0 && (
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
