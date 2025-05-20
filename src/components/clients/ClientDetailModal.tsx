
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientHeader from "./ClientHeader";
import ClientContactInfo from "./ClientContactInfo";
import ClientAdditionalDetails from "./ClientAdditionalDetails";
import ClientDetailTabs from "./ClientDetailTabs";

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
  lookerStudioEmbed?: string;
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <ClientHeader 
            name={client.name}
            logo={client.logo}
            industry={client.industry}
          />
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClientContactInfo 
              email={client.email}
              phone={client.phone}
              address={client.address}
              website={client.website}
            />
            
            <ClientAdditionalDetails
              contactPerson={client.contactPerson}
              joinDate={client.joinDate}
              projects={client.projects}
            />
          </div>
          
          <ClientDetailTabs
            clientProjects={clientProjects}
            clientInvoices={clientInvoices}
            lookerStudioEmbed={client.lookerStudioEmbed}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
