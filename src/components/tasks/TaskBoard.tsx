
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Task } from "./TaskTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskBoard = ({ tasks, onTaskClick }: TaskBoardProps) => {
  // Group tasks by due date
  const groupedTasks = tasks.reduce((groups, task) => {
    let dueDate: Date;
    
    // Handle different date formats
    if (task.dueDate.includes('/')) {
      // Format: DD/MM/YYYY
      const [day, month, year] = task.dueDate.split('/').map(Number);
      dueDate = new Date(year, month - 1, day);
    } else {
      // ISO format or other format
      dueDate = new Date(task.dueDate);
    }
    
    // Format date as YYYY-MM-DD for grouping
    const dateKey = format(dueDate, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // Get unique dates and sort them
  const dates = Object.keys(groupedTasks).sort();

  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return "Hoje";
    }
    if (isTomorrow(date)) {
      return "Amanhã";
    }
    
    return format(date, "EEEE, dd/MM", { locale: ptBR });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {dates.map((dateKey) => (
        <Card key={dateKey} className="min-w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="capitalize">{formatDateHeading(dateKey)}</span>
              <span className="text-sm text-muted-foreground">
                {groupedTasks[dateKey].length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedTasks[dateKey].map((task) => (
              <Card 
                key={task.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onTaskClick(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description || "Sem descrição"}
                      </p>
                    </div>
                    {task.assignedTo?.avatar && (
                      <img 
                        src={task.assignedTo.avatar} 
                        alt={task.assignedTo.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskBoard;
