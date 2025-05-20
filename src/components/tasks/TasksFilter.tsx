
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Project } from "./types";

interface TasksFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterProject: string;
  setFilterProject: (project: string) => void;
  filterResponsible: string;
  setFilterResponsible: (responsible: string) => void;
  isMyTasksMode: boolean;
  setIsMyTasksMode: (isMyTasksMode: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  users: User[];
  projects: Project[];
}

const TasksFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterProject,
  setFilterProject,
  filterResponsible,
  setFilterResponsible,
  isMyTasksMode,
  setIsMyTasksMode,
  isLoading,
  setIsLoading,
  users,
  projects,
}: TasksFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
      <div className="md:flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas por título, empresa ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      
      <Button 
        variant={isMyTasksMode ? "default" : "outline"}
        onClick={() => setIsMyTasksMode(!isMyTasksMode)}
        className={`w-full md:w-auto ${isMyTasksMode ? 'bg-primary hover:bg-primary/80' : ''}`}
      >
        {isMyTasksMode ? (
          <Badge variant="outline" className="bg-white text-primary border-white mr-2">
            Ativado
          </Badge>
        ) : null}
        Modo EU
      </Button>
      
      <Select value={filterResponsible} onValueChange={setFilterResponsible}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="in-progress">Em andamento</SelectItem>
          <SelectItem value="completed">Concluídas</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filterProject} onValueChange={setFilterProject}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Projeto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        variant="outline"
        onClick={() => setIsLoading(true)}
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  );
};

export default TasksFilter;
