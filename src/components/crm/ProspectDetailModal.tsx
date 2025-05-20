import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Mail, Phone, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

// Interface para as props do modal
interface ProspectDetailModalProps {
  prospect: any;
  isOpen: boolean;
  onClose: () => void;
}

// Componente do modal de detalhes do prospecto
const ProspectDetailModal = ({ prospect, isOpen, onClose }: ProspectDetailModalProps) => {
  // Estados para gerenciar o formulário de nova interação
  const [interactionType, setInteractionType] = useState("email");
  const [interactionDescription, setInteractionDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("details");

  // Interações do prospecto
  const [interactions, setInteractions] = useState(prospect.interactions || []);

  // Função para registrar nova interação
  const handleAddInteraction = () => {
    if (interactionDescription.trim() && date) {
      const newInteraction = {
        id: interactions.length + 1,
        type: interactionType,
        date: format(date, "dd/MM/yyyy"),
        description: interactionDescription,
        user: "Admin User" // Em um app real, pegaria do contexto de autenticação
      };
      
      setInteractions([...interactions, newInteraction]);
      setInteractionDescription("");
      setInteractionType("email");
      setDate(new Date());

      // Aqui seria feita uma chamada para API para salvar a interação
    }
  };

  // Função para obter as iniciais do nome para o fallback do avatar
  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  // Função para lidar com a alteração da data
  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  // Ícone para o tipo de interação
  const getInteractionIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-primary" />;
      case 'call':
        return <Phone className="h-4 w-4 text-warning" />;
      case 'meeting':
        return <CalendarIcon className="h-4 w-4 text-success" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{prospect.companyName}</DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="interactions">Histórico de Interações</TabsTrigger>
          </TabsList>
          
          {/* Tab de Detalhes do Prospecto */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Informações da Empresa</h4>
                <p className="text-sm font-medium">Nome da Empresa</p>
                <p className="text-sm mb-2">{prospect.companyName}</p>
                
                <p className="text-sm font-medium">Status</p>
                <div className="mb-2">
                  {prospect.status === 'contact' && <Badge className="bg-primary/20 text-primary">Entrar em Contato</Badge>}
                  {prospect.status === 'proposal' && <Badge className="bg-warning/20 text-warning">Enviar Proposta</Badge>}
                  {prospect.status === 'presentation' && <Badge className="bg-success/20 text-success">Marcar Apresentação</Badge>}
                </div>
                
                <p className="text-sm font-medium">Última Atualização</p>
                <p className="text-sm mb-2">{prospect.lastUpdated}</p>
                
                <p className="text-sm font-medium">Próxima Ação</p>
                <p className="text-sm">{prospect.nextAction}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Contato Principal</h4>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm mb-2">{prospect.contactName}</p>
                
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm mb-2">{prospect.contactEmail}</p>
                
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm mb-2">{prospect.contactPhone}</p>
                
                <p className="text-sm font-medium">Responsável</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={prospect.assignedTo.avatar} alt={prospect.assignedTo.name} />
                    <AvatarFallback>{getInitials(prospect.assignedTo.name)}</AvatarFallback>
                  </Avatar>
                  <span>{prospect.assignedTo.name}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tab de Histórico de Interações */}
          <TabsContent value="interactions" className="space-y-6">
            {/* Lista de interações */}
            <div className="space-y-4 mt-4">
              {interactions.map((interaction: any) => (
                <div key={interaction.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getInteractionIcon(interaction.type)}
                    <span className="font-medium">{
                      interaction.type === 'email' ? 'Email' :
                      interaction.type === 'call' ? 'Ligação' :
                      'Reunião'
                    }</span>
                  </div>
                  <p className="text-sm mb-1">{interaction.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>por {interaction.user}</span>
                    <span>{interaction.date}</span>
                  </div>
                </div>
              ))}

              {interactions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Nenhuma interação registrada.</p>
                </div>
              )}
            </div>
            
            {/* Formulário para registrar nova interação */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-4">Registrar Nova Interação</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Seletor de tipo de interação */}
                <Select value={interactionType} onValueChange={setInteractionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Seletor de data - agora usando input simples */}
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="interaction-date"
                    type="date"
                    value={format(date, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    className="w-full"
                  />
                </div>
                
                {/* Descrição da interação */}
                <div className="md:col-span-2">
                  <Textarea 
                    value={interactionDescription}
                    onChange={(e) => setInteractionDescription(e.target.value)}
                    placeholder="Detalhes da interação"
                    className="h-[38px] resize-none"
                  />
                </div>
              </div>
              
              {/* Botão de enviar */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddInteraction}
                  disabled={!interactionDescription.trim()}
                  size="sm"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Registrar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectDetailModal;
