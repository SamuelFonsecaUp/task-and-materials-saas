
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja receber as notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="w-4 h-4" />
                <div>
                  <Label>Notificações no app</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações dentro do aplicativo
                  </p>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Mail className="w-4 h-4" />
                <div>
                  <Label>Notificações por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações por email
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da conta</CardTitle>
            <CardDescription>
              Exporte ou delete seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Exportar dados</Button>
            <Button variant="destructive">Deletar conta</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
