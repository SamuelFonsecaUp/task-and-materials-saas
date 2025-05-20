
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientLookerStudioProps {
  embedCode?: string;
}

const ClientLookerStudio = ({ embedCode }: ClientLookerStudioProps) => {
  if (!embedCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          Nenhum dashboard configurado para este cliente.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden" style={{ height: "500px" }}>
          <div 
            dangerouslySetInnerHTML={{ __html: embedCode }}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientLookerStudio;
