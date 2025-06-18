
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, Table, Calendar, Clock } from "lucide-react";

interface TasksHeaderProps {
  viewMode: "table" | "board" | "days";
  setViewMode: (mode: "table" | "board" | "days") => void;
  onNewTask: () => void;
}

const TasksHeader = ({ viewMode, setViewMode, onNewTask }: TasksHeaderProps) => {
  const getViewIcon = () => {
    switch (viewMode) {
      case "table": return <Table className="h-4 w-4" />;
      case "board": return <Calendar className="h-4 w-4" />;
      case "days": return <Clock className="h-4 w-4" />;
      default: return <Table className="h-4 w-4" />;
    }
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "table": return "Tabela";
      case "board": return "Board";
      case "days": return "Por Dias";
      default: return "Tabela";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <p className="text-muted-foreground">Gerencie todas as tarefas do time</p>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {getViewIcon()}
              <span className="ml-2">{getViewLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewMode("days")}>
              <Clock className="mr-2 h-4 w-4" />
              Por Dias
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode("table")}>
              <Table className="mr-2 h-4 w-4" />
              Tabela
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode("board")}>
              <Calendar className="mr-2 h-4 w-4" />
              Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="bg-agency-primary hover:bg-agency-secondary"
          onClick={onNewTask}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;
