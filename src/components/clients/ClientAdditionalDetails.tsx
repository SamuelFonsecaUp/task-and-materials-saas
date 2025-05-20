
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ClientAdditionalDetailsProps {
  contactPerson?: string;
  joinDate?: string;
  projects?: number;
}

const ClientAdditionalDetails = ({ contactPerson, joinDate, projects }: ClientAdditionalDetailsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-3">Detalhes Adicionais</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Contato Principal</span>
            <span>{contactPerson || "Não especificado"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Data de Início</span>
            <span>{joinDate || "Não especificado"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Projetos</span>
            <span>{projects || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientAdditionalDetails;
