
import { useState } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building, Plus, Search } from "lucide-react";
import ClientDetailModal from "@/components/clients/ClientDetailModal";

// Client interface
interface Client {
  id: number;
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  industry?: string;
  contactPerson?: string;
  joinDate?: string;
  projects?: number;
  status: 'active' | 'inactive';
}

// Mock clients data
const clients: Client[] = [
  {
    id: 1,
    name: "Empresa ABC",
    logo: "https://ui-avatars.com/api/?name=Empresa+ABC&background=0D8ABC&color=fff",
    email: "contato@empresaabc.com",
    phone: "(11) 9999-8888",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    website: "www.empresaabc.com",
    industry: "Tecnologia",
    contactPerson: "João Silva",
    joinDate: "01/01/2025",
    projects: 3,
    status: 'active'
  },
  {
    id: 2,
    name: "Empresa XYZ",
    logo: "https://ui-avatars.com/api/?name=Empresa+XYZ&background=FF5722&color=fff",
    email: "contato@empresaxyz.com",
    phone: "(11) 7777-6666",
    address: "Rua Augusta, 500 - São Paulo, SP",
    industry: "E-commerce",
    contactPerson: "Maria Souza",
    joinDate: "15/02/2025",
    projects: 2,
    status: 'active'
  },
  {
    id: 3,
    name: "Empresa 123",
    logo: "https://ui-avatars.com/api/?name=Empresa+123&background=4CAF50&color=fff",
    email: "contato@empresa123.com",
    phone: "(11) 5555-4444",
    address: "Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP",
    website: "www.empresa123.com",
    industry: "Marketing",
    contactPerson: "Ana Santos",
    joinDate: "01/03/2025",
    projects: 1,
    status: 'active'
  },
  {
    id: 4,
    name: "Cliente Novo",
    logo: "https://ui-avatars.com/api/?name=Cliente+Novo&background=9C27B0&color=fff",
    email: "contato@clientenovo.com",
    phone: "(11) 3333-2222",
    address: "Alameda Santos, 800 - São Paulo, SP",
    industry: "Saúde",
    joinDate: "10/03/2025",
    status: 'inactive'
  },
  {
    id: 5,
    name: "Empresa 456",
    logo: "https://ui-avatars.com/api/?name=Empresa+456&background=FFC107&color=fff",
    email: "contato@empresa456.com",
    phone: "(11) 1111-0000",
    address: "Rua Oscar Freire, 300 - São Paulo, SP",
    website: "www.empresa456.com",
    industry: "Varejo",
    contactPerson: "Carlos Oliveira",
    joinDate: "20/03/2025",
    projects: 2,
    status: 'active'
  }
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter clients based on search term and status
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie todos os clientes da agência</p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Buscar por nome, email ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground mr-2" />}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Projetos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.industry || "Empresa"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{client.email}</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{client.projects || 0}</TableCell>
                  <TableCell>
                    {client.status === 'active' ? (
                      <Badge className="bg-success/20 text-success">Ativo</Badge>
                    ) : (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(client)}
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-10">
              <Building className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-lg font-medium mb-2">Nenhum cliente encontrado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Tente ajustar seus filtros ou adicione um novo cliente
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Clients;
