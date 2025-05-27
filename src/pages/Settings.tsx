
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusManager } from "@/components/tasks/TaskStatusManager";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <ErrorBoundary>
        <Card>
          <CardHeader>
            <CardTitle>Status das Tarefas</CardTitle>
            <CardDescription>
              Personalize os status e cores das tarefas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusManager />
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

export default Settings;
