
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface ClientProjectsProps {
  projects: Project[];
}

const ClientProjects = ({ projects }: ClientProjectsProps) => {
  return (
    <div className="space-y-3">
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">{project.name}</h4>
                  <span className={`text-xs font-medium ${
                    project.status === "active" ? "text-success" : 
                    project.status === "paused" ? "text-warning" : ""
                  }`}>
                    {project.status === "active" ? "Ativo" : 
                     project.status === "paused" ? "Pausado" : 
                     project.status === "completed" ? "Concluído" : project.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data de entrega: {project.dueDate}</span>
                  <span>{project.progress}% concluído</span>
                </div>
                <Progress value={project.progress} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Nenhum projeto encontrado para este cliente.
        </div>
      )}
    </div>
  );
};

export default ClientProjects;
