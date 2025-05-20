
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building, Globe } from "lucide-react";

interface ClientContactInfoProps {
  email: string;
  phone: string;
  address: string;
  website?: string;
}

const ClientContactInfo = ({ email, phone, address, website }: ClientContactInfoProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-3">Informações de Contato</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{address}</span>
          </div>
          {website && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientContactInfo;
