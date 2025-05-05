import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientDetailModal } from "@/components/clients/ClientDetailModal";

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

const Clients = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Mock data for clients
  const clients: Client[] = [
    {
      id: 1,
      name: "Empresa A",
      logo: "https://i.pravatar.cc/150?img=1",
      email: "contato@empresaA.com",
      phone: "(11) 99999-0001",
      address: "Rua A, 123",
      website: "https://www.empresaA.com",
      industry: "Tecnologia",
      contactPerson: "João Silva",
      joinDate: "2022-01-15",
      projects: 5,
      status: "active",
    },
    {
      id: 2,
      name: "Empresa B",
      logo: "https://i.pravatar.cc/150?img=2",
      email: "contato@empresaB.com",
      phone: "(11) 99999-0002",
      address: "Rua B, 456",
      website: "https://www.empresaB.com",
      industry: "Marketing",
      contactPerson: "Maria Oliveira",
      joinDate: "2022-02-20",
      projects: 3,
      status: "inactive",
    },
  ];

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Clientes</h1>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.filter(client => client.status === "active").map(client => (
              <Card key={client.id} onClick={() => handleClientClick(client)} className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{client.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={client.logo} alt={client.name} className="w-16 h-16 mb-2" />
                  <p>{client.industry}</p>
                  <p>{client.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.filter(client => client.status === "inactive").map(client => (
              <Card key={client.id} onClick={() => handleClientClick(client)} className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{client.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={client.logo} alt={client.name} className="w-16 h-16 mb-2" />
                  <p>{client.industry}</p>
                  <p>{client.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedClient && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <ClientDetailModal client={selectedClient} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </Dialog>
      )}
    </div>
  );
};

export default Clients;
