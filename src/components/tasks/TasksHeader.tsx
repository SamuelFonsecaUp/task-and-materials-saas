
import { LayoutGrid, Plus, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TasksHeaderProps {
  viewMode: "table" | "board";
  setViewMode: (viewMode: "table" | "board") => void;
  onNewTask: () => void;
}

const TasksHeader = ({ viewMode, setViewMode, onNewTask }: TasksHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <p className="text-muted-foreground">Gerencie as tarefas de todos os projetos</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setViewMode(viewMode === "table" ? "board" : "table")}
        >
          {viewMode === "table" ? (
            <>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Visualização em Colunas
            </>
          ) : (
            <>
              <TableIcon className="mr-2 h-4 w-4" />
              Visualização em Tabela
            </>
          )}
        </Button>
        <Button className="bg-primary hover:bg-primary/80" onClick={onNewTask}>
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;
