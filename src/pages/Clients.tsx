
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building,
  Edit,
  FileSpreadsheet,
  Folder,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash,
  Users,
} from "lucide-react";

// Define types
type Sector = "trafego" | "design" | "webdesign" | "atendimento";

interface Client {
  id: number;
  name: string;
  logoUrl: string;
  sectors: Sector[];
  contactName: string;
  email: string;
  phone: string;
  activeProjects: number;
  pendingMaterials: number;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mock clients data
  const clients: Client[] = [
    {
      id: 1,
      name: "Empresa XYZ",
      logoUrl: "https://via.placeholder.com/100?text=XYZ",
      sectors: ["trafego", "design"],
      contactName: "João Silva",
      email: "joao@empresaxyz.com",
      phone: "(11) 98765-4321",
      activeProjects: 3,
      pendingMaterials: 5,
    },
    {
      id: 2,
      name: "Contábil ABC",
      logoUrl: "https://via.placeholder.com/100?text=ABC",
      sectors: ["design", "webdesign"],
      contactName: "Maria Souza",
      email: "maria@contabilabc.com",
      phone: "(11) 91234-5678",
      activeProjects: 1,
      pendingMaterials: 0,
    },
    {
      id: 3,
      name: "Tech Solutions",
      logoUrl: "https://via.placeholder.com/100?text=TECH",
      sectors: ["webdesign", "atendimento"],
      contactName: "Pedro Santos",
      email: "pedro@techsolutions.com",
      phone: "(11) 94567-8901",
      activeProjects: 2,
      pendingMaterials: 3,
    },
    {
      id: 4,
      name: "Fashion Store",
      logoUrl: "https://via.placeholder.com/100?text=FASHION",
      sectors: ["trafego", "atendimento"],
      contactName: "Ana Pereira",
      email: "ana@fashionstore.com",
      phone: "(11) 92345-6789",
      activeProjects: 1,
      pendingMaterials: 2,
    },
    {
      id: 5,
      name: "Health Clinic",
      logoUrl: "https://via.placeholder.com/100?text=HEALTH",
      sectors: ["trafego", "design", "webdesign"],
      contactName: "Carlos Oliveira",
      email: "carlos@healthclinic.com",
      phone: "(11) 93456-7890",
      activeProjects: 2,
      pendingMaterials: 1,
    },
  ];

  // Filter clients based on search term and sector
  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSector =
      filterSector === "all" ||
      client.sectors.includes(filterSector as Sector);

    return matchesSearch && matchesSector;
  });

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  const getSectorLabel = (sector: Sector): string => {
    const labels = {
      trafego: "Tráfego",
      design: "Design",
      webdesign: "Webdesign",
      atendimento: "Atendimento",
    };
    return labels[sector];
  };

  const getSectorColor = (sector: Sector): string => {
    const colors = {
      trafego: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      webdesign: "bg-green-100 text-green-800",
      atendimento: "bg-orange-100 text-orange-800",
    };
    return colors[sector];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerenciamento de clientes da agência
          </p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterSector} onValueChange={setFilterSector}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="trafego">Tráfego</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="webdesign">Webdesign</SelectItem>
            <SelectItem value="atendimento">Atendimento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="card-hover">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div className="flex flex-row gap-4">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription>{client.contactName}</CardDescription>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => openClientDetails(client)}
                  >
                    <Users className="mr-2 h-4 w-4" /> Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Folder className="mr-2 h-4 w-4" /> Projetos
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Dashboards
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1 mb-3">
                {client.sectors.map((sector) => (
                  <Badge
                    key={sector}
                    className={`${getSectorColor(sector)} font-normal`}
                  >
                    {getSectorLabel(sector)}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" /> 
                  {client.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Folder className="mr-2 h-4 w-4" /> 
                  {client.activeProjects} projetos ativos
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => openClientDetails(client)}
              >
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg font-medium mb-2">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Tente ajustar seus filtros ou adicionar um novo cliente
          </p>
          <Button className="bg-agency-primary hover:bg-agency-secondary">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedClient && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedClient.name}</DialogTitle>
              <DialogDescription>
                Detalhes completos do cliente
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-1">
                <h3 className="font-medium mb-2">Informações</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Contato Principal</p>
                    <p className="font-medium">{selectedClient.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Setores</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedClient.sectors.map((sector) => (
                        <Badge
                          key={sector}
                          className={`${getSectorColor(sector)} font-normal`}
                        >
                          {getSectorLabel(sector)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Projetos em Andamento</h3>
                  {selectedClient.activeProjects > 0 ? (
                    <div className="space-y-2">
                      {[...Array(selectedClient.activeProjects)].map((_, i) => (
                        <div key={i} className="flex justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">Projeto {i + 1}</p>
                            <p className="text-sm text-muted-foreground">Descrição exemplo</p>
                          </div>
                          <Badge>Em andamento</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum projeto ativo.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Materiais Pendentes</h3>
                  {selectedClient.pendingMaterials > 0 ? (
                    <div className="space-y-2">
                      {[...Array(selectedClient.pendingMaterials)].map((_, i) => (
                        <div key={i} className="flex justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">Material {i + 1}</p>
                            <p className="text-sm text-muted-foreground">Aguardando aprovação</p>
                          </div>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum material pendente.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Dashboard</h3>
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                  Aqui seria incorporado o dashboard do Looker Studio
                  <br />
                  <Button variant="outline" className="mt-2">
                    Configurar Dashboard
                  </Button>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Fechar
              </Button>
              <Button className="bg-agency-primary">
                <Edit className="mr-2 h-4 w-4" /> Editar Cliente
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Clients;
