
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarDays } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface ClientInvoicesProps {
  invoices: Invoice[];
}

const ClientInvoices = ({ invoices }: ClientInvoicesProps) => {
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
    <div className="space-y-3">
      {invoices.length > 0 ? (
        invoices.map((invoice) => (
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
  );
};

export default ClientInvoices;
