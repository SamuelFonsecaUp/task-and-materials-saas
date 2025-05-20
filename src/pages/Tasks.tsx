
import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { useToast } from "@/components/ui/use-toast";
import TaskTable from "@/components/tasks/TaskTable";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import TasksFilter from "@/components/tasks/TasksFilter";
import TasksPagination from "@/components/tasks/TasksPagination";
import TasksEmptyState from "@/components/tasks/TasksEmptyState";
import TasksHeader from "@/components/tasks/TasksHeader";
import { Task } from "@/components/tasks/types";
import { sortTasks, applyFilters } from "@/services/taskService";
import { users, projects, tasks as mockTasks } from "@/data/mockData";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterResponsible, setFilterResponsible] = useState("all");
  const [isMyTasksMode, setIsMyTasksMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"table" | "board">("table");
  
  const { toast } = useToast();
  const auth = useAuth();
  const currentUser = auth.user;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedTasks = sortTasks(
    applyFilters(mockTasks, searchTerm, filterStatus, filterProject, filterResponsible, isMyTasksMode, currentUser),
    sortField,
    sortDirection
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredAndSortedTasks.length / tasksPerPage)));
    setCurrentPage(1);
  }, [filteredAndSortedTasks.length, tasksPerPage, searchTerm, filterStatus, filterProject, filterResponsible, isMyTasksMode]);

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
        setIsLoading={setIsLoading}
        users={users}
        projects={projects}
      />

      <div className="text-sm text-muted-foreground">
        Exibindo {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredAndSortedTasks.length)} de {filteredAndSortedTasks.length} tarefas
      </div>

      <div className="mt-6">
        {viewMode === "table" ? (
          <TaskTable 
            tasks={currentTasks} 
            onTaskClick={handleTaskClick}
            isLoading={isLoading}
            onSort={handleSort}
          />
        ) : (
          <TaskBoard
            tasks={currentTasks}
            onTaskClick={handleTaskClick}
          />
        )}
        
        {!isLoading && filteredAndSortedTasks.length === 0 && (
          <TasksEmptyState onNewTask={handleNewTask} />
        )}
      </div>

      {!isLoading && filteredAndSortedTasks.length > 0 && viewMode === "table" && (
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
