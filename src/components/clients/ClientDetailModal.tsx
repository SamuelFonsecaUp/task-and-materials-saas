
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientHeader from "./ClientHeader";
import ClientContactInfo from "./ClientContactInfo";
import ClientAdditionalDetails from "./ClientAdditionalDetails";
import ClientDetailTabs from "./ClientDetailTabs";
import ClientEditForm from "./ClientEditForm";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import type { Client } from "@/services/clientService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ClientDetailModal = ({ client, isOpen, onClose, onUpdate }: ClientDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  
  if (!client) return null;

  const handleSave = async (updatedData: any) => {
    try {
      await updateClient.mutateAsync({ 
        id: client.id, 
        updates: updatedData 
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(client.id);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  // Mock data for client projects - será implementado com dados reais posteriormente
  const clientProjects = [
    { id: 1, name: "Campanha Digital", status: "active", progress: 75, dueDate: "28/05/2025" },
    { id: 2, name: "Redesign Website", status: "active", progress: 40, dueDate: "15/06/2025" },
  ];

  // Mock data for client invoices - será implementado com dados reais posteriormente
  const clientInvoices = [
    { id: "INV-2025-001", date: "10/01/2025", amount: "R$ 5.000,00", status: "paid" },
    { id: "INV-2025-002", date: "10/02/2025", amount: "R$ 5.000,00", status: "paid" },
    { id: "INV-2025-003", date: "10/03/2025", amount: "R$ 5.000,00", status: "pending" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-start">
          <ClientHeader 
            name={client.name}
            logo={client.logo_url}
            industry={client.industry}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              disabled={updateClient.isPending}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o cliente "{client.name}"? 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteClient.isPending}
                  >
                    {deleteClient.isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {isEditing ? (
            <ClientEditForm 
              client={client} 
              onSave={handleSave} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClientContactInfo 
                  email={client.email}
                  phone={client.phone}
                  address={client.address}
                  website={client.website}
                />
                
                <ClientAdditionalDetails
                  contactPerson={client.contact_person}
                  joinDate={client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : undefined}
                  projects={clientProjects.length}
                />
              </div>
              
              <ClientDetailTabs
                clientProjects={clientProjects}
                clientInvoices={clientInvoices}
                lookerStudioEmbed={client.looker_studio_embed}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
