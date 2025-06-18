
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ClientDetailModal from "@/components/clients/ClientDetailModal";
import ClientCreateModal from "@/components/clients/ClientCreateModal";
import { Pencil, Plus, Search } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import type { Client } from "@/services/clientService";

const Clients = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clients = [], isLoading, error } = useClients();

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleClientUpdate = () => {
    // A atualização será tratada pelo React Query automaticamente
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeClients = filteredClients.filter(client => client.status === "active");
  const inactiveClients = filteredClients.filter(client => client.status === "inactive");

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar clientes</h2>
          <p className="text-muted-foreground">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Ativos ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inativos ({inactiveClients.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-16 rounded mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeClients.map(client => (
                <Card key={client.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClientClick(client);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </CardHeader>
                  <CardContent onClick={() => handleClientClick(client)}>
                    {client.logo_url && (
                      <img 
                        src={client.logo_url} 
                        alt={client.name} 
                        className="w-16 h-16 mb-2 rounded object-cover"
                      />
                    )}
                    <p className="text-sm text-muted-foreground mb-1">{client.industry}</p>
                    <p className="text-sm">{client.email}</p>
                    {client.phone && (
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveClients.map(client => (
              <Card key={client.id} className="cursor-pointer hover:shadow-lg transition-shadow opacity-75">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClientClick(client);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </CardHeader>
                <CardContent onClick={() => handleClientClick(client)}>
                  {client.logo_url && (
                    <img 
                      src={client.logo_url} 
                      alt={client.name} 
                      className="w-16 h-16 mb-2 rounded object-cover"
                    />
                  )}
                  <p className="text-sm text-muted-foreground mb-1">{client.industry}</p>
                  <p className="text-sm">{client.email}</p>
                  {client.phone && (
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredClients.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-lg font-medium mb-2">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro cliente"}
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-agency-primary hover:bg-agency-secondary">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      )}

      {selectedClient && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <ClientDetailModal 
            client={selectedClient} 
            isOpen={isDetailOpen} 
            onClose={() => setIsDetailOpen(false)} 
            onUpdate={handleClientUpdate}
          />
        </Dialog>
      )}

      <ClientCreateModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};

export default Clients;
