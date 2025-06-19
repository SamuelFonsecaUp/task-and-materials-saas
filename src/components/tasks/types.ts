
// Types for the task components (UI layer)
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
}

// Task type for UI components (table, board, etc.)
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
    id: string;
    name: string;
  };
}
