
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Mail, Phone, CalendarDays, FileText, Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Added the missing import

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

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailModal = ({ client, isOpen, onClose }: ClientDetailModalProps) => {
  if (!client) return null;

  // Mock data for client projects
  const clientProjects = [
    { id: 1, name: "Campanha de Lançamento", status: "active", progress: 75, dueDate: "28/05/2025" },
    { id: 2, name: "Redesign de Site", status: "active", progress: 40, dueDate: "15/06/2025" },
  ];

  // Mock data for client invoices
  const clientInvoices = [
    { id: "INV-2025-001", date: "10/01/2025", amount: "R$ 5.000,00", status: "paid" },
    { id: "INV-2025-002", date: "10/02/2025", amount: "R$ 5.000,00", status: "paid" },
    { id: "INV-2025-003", date: "10/03/2025", amount: "R$ 5.000,00", status: "pending" },
  ];

  const renderInvoiceStatus = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-xs font-medium text-success">Pago</span>;
      case "pending":
        return <span className="text-xs font-medium text-warning">Pendente</span>;
      case "overdue":
        return <span className="text-xs font-medium text-destructive">Atrasado</span>;
      default:
        return <span className="text-xs font-medium">{status}</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-md overflow-hidden">
              <img
                src={client.logo}
                alt={client.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{client.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{client.industry || "Empresa"}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Informações de Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{client.address}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {client.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Detalhes Adicionais</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contato Principal</span>
                    <span>{client.contactPerson || "Não especificado"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Data de Início</span>
                    <span>{client.joinDate || "Não especificado"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Projetos</span>
                    <span>{client.projects || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="projects">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-4">
              <div className="space-y-3">
                {clientProjects.length > 0 ? (
                  clientProjects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{project.name}</h4>
                            <span className={`text-xs font-medium ${
                              project.status === "active" ? "text-success" : 
                              project.status === "paused" ? "text-warning" : ""
                            }`}>
                              {project.status === "active" ? "Ativo" : 
                              project.status === "paused" ? "Pausado" : 
                              project.status === "completed" ? "Concluído" : project.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Data de entrega: {project.dueDate}</span>
                            <span>{project.progress}% concluído</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Nenhum projeto encontrado para este cliente.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="invoices" className="mt-4">
              <div className="space-y-3">
                {clientInvoices.length > 0 ? (
                  clientInvoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-3 w-3" />
                                <span>{invoice.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{invoice.amount}</p>
                            {renderInvoiceStatus(invoice.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Nenhuma fatura encontrada para este cliente.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
