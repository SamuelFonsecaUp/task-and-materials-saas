
export interface Task {
  id: number;
  companyName: string;
  companyLogo: string;
  title: string;
  status: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    name: string;
    avatar: string;
  };
  description?: string;
  project?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  checklist?: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Project {
  id: number;
  name: string;
}
