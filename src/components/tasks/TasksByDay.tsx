
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Task } from "@/services/taskService";

interface TasksByDayProps {
  groupedTasks: {
    hoje: Task[];
    amanha: Task[];
    segunda: Task[];
    terca: Task[];
    quarta: Task[];
  };
  onTaskClick: (task: Task) => void;
  onAddTask: (day: string) => void;
}

const TasksByDay = ({ groupedTasks, onTaskClick, onAddTask }: TasksByDayProps) => {
  const [expandedGroups, setExpandedGroups] = useState({
    hoje: true,
    amanha: true,
    segunda: true,
    terca: true,
    quarta: true,
  });

  const toggleGroup = (day: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const dayLabels = {
    hoje: "HOJE",
    amanha: "AMANHÃ", 
    segunda: "SEGUNDA-FEIRA",
    terca: "TERÇA-FEIRA",
    quarta: "QUARTA-FEIRA",
  };

  const renderTaskGroup = (dayKey: keyof typeof groupedTasks, tasks: Task[]) => (
    <div key={dayKey} className="mb-4">
      <div 
        className="flex items-center justify-between py-3 px-4 bg-muted/30 cursor-pointer hover:bg-muted/50 rounded-lg"
        onClick={() => toggleGroup(dayKey)}
      >
        <div className="flex items-center gap-3">
          {expandedGroups[dayKey] ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
          <span className="font-semibold text-sm">{dayLabels[dayKey]}</span>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(dayKey);
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="ml-1 text-xs">Adicionar</span>
        </Button>
      </div>
      
      {expandedGroups[dayKey] && (
        <div className="mt-2 space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhuma tarefa para {dayLabels[dayKey].toLowerCase()}
            </div>
          ) : (
            tasks.map((task) => (
              <Card 
                key={task.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onTaskClick(task)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          {task.priority === 'high' ? 'Alta' :
                           task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${
                            task.status === 'pending' ? 'bg-orange-50 text-orange-700' :
                            task.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}
                        >
                          {task.status === 'pending' ? 'Pendente' :
                           task.status === 'in-progress' ? 'Em Andamento' : 'Concluída'}
                        </Badge>
                      </div>
                    </div>
                    {task.assigned_user?.avatar_url && (
                      <img 
                        src={task.assigned_user.avatar_url} 
                        alt={task.assigned_user.name || "Usuário"}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {Object.entries(groupedTasks).map(([dayKey, tasks]) => 
        renderTaskGroup(dayKey as keyof typeof groupedTasks, tasks)
      )}
    </div>
  );
};

export default TasksByDay;
