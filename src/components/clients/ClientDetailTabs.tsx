
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientProjects from "./ClientProjects";
import ClientInvoices from "./ClientInvoices";
import ClientLookerStudio from "./ClientLookerStudio";

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface ClientDetailTabsProps {
  clientProjects: Project[];
  clientInvoices: Invoice[];
  lookerStudioEmbed?: string;
}

const ClientDetailTabs = ({ clientProjects, clientInvoices, lookerStudioEmbed }: ClientDetailTabsProps) => {
  return (
    <Tabs defaultValue="projects">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="projects">Projetos</TabsTrigger>
        <TabsTrigger value="invoices">Faturas</TabsTrigger>
        <TabsTrigger value="stats">Estatísticas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects" className="mt-4">
        <ClientProjects projects={clientProjects} />
      </TabsContent>
      
      <TabsContent value="invoices" className="mt-4">
        <ClientInvoices invoices={clientInvoices} />
      </TabsContent>

      <TabsContent value="stats" className="mt-4">
        <ClientLookerStudio embedCode={lookerStudioEmbed} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDetailTabs;
