
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import TaskTable from "@/components/tasks/TaskTable";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import TasksFilter from "@/components/tasks/TasksFilter";
import TasksPagination from "@/components/tasks/TasksPagination";
import TasksEmptyState from "@/components/tasks/TasksEmptyState";
import TasksHeader from "@/components/tasks/TasksHeader";
import TasksByDay from "@/components/tasks/TasksByDay";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { Task, groupTasksByDay } from "@/services/taskService";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  const [isMyTasksMode, setIsMyTasksMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("due_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"table" | "board" | "days">("days");
  
  const { toast } = useToast();
  const auth = useAuth();
  const currentUser = auth.user;

  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesProject = filterProject === "all" || task.project_id === filterProject;
    const matchesResponsible = filterResponsible === "all" || 
                            (task.assigned_to && task.assigned_to === filterResponsible);
    const matchesMyTaskMode = !isMyTasksMode || 
                          (task.assigned_to && task.assigned_to === currentUser?.id);
    
    return matchesSearch && matchesStatus && matchesProject && matchesResponsible && matchesMyTaskMode;
  });

  // Agrupar tarefas por dia
  const groupedTasksByDay = groupTasksByDay(filteredTasks);

  // Paginação para view de tabela
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / tasksPerPage));

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  const handleNewTask = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novas tarefas estará disponível em breve.",
    });
  };

  const handleAddTaskByDay = (day: string) => {
    toast({
      title: "Adicionar tarefa",
      description: `Funcionalidade para adicionar tarefa em ${day} será implementada em breve.`,
    });
  };

  // Criar lista de usuários e projetos para os filtros
  const users = Array.from(new Set(tasks.map(task => task.assigned_user).filter(Boolean)))
    .map(user => ({ id: user!.id, name: user!.name || 'Usuário', avatar: user!.avatar_url }));

  const projectsForFilter = projects.map(project => ({ 
    id: project.id, 
    name: project.name 
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <TasksHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onNewTask={handleNewTask}
      />

      <TasksFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        filterResponsible={filterResponsible}
        setFilterResponsible={setFilterResponsible}
        isMyTasksMode={isMyTasksMode}
        setIsMyTasksMode={setIsMyTasksMode}
        isLoading={isLoading}
        setIsLoading={() => {}} // Não usado mais
        users={users}
        projects={projectsForFilter}
      />

      <div className="text-sm text-muted-foreground">
        Exibindo {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''}
      </div>

      <div className="mt-6">
        {viewMode === "table" ? (
          <TaskTable 
            tasks={currentTasks} 
            onTaskClick={handleTaskClick}
            isLoading={isLoading}
            onSort={handleSort}
          />
        ) : viewMode === "board" ? (
          <TaskBoard
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <TasksByDay
            groupedTasks={groupedTasksByDay}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTaskByDay}
          />
        )}
        
        {!isLoading && filteredTasks.length === 0 && (
          <TasksEmptyState onNewTask={handleNewTask} />
        )}
      </div>

      {!isLoading && filteredTasks.length > 0 && viewMode === "table" && (
        <TasksPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Tasks;
