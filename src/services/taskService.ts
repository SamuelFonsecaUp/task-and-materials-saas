
import { Task } from "@/components/tasks/types";

export const sortTasks = (tasks: Task[], sortField: string, sortDirection: 'asc' | 'desc'): Task[] => {
  return [...tasks].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case 'companyName':
        valueA = a.companyName;
        valueB = b.companyName;
        break;
      case 'title':
        valueA = a.title;
        valueB = b.title;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'dueDate':
        const partsA = a.dueDate.split('/');
        const partsB = b.dueDate.split('/');
        valueA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`);
        valueB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`);
        break;
      case 'priority':
        const priorityMap: {[key: string]: number} = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
        valueA = priorityMap[a.priority];
        valueB = priorityMap[b.priority];
        break;
      case 'assignedTo':
        valueA = a.assignedTo?.name || '';
        valueB = b.assignedTo?.name || '';
        break;
      default:
        valueA = a.dueDate;
        valueB = b.dueDate;
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
};

export const applyFilters = (
  tasks: Task[], 
  searchTerm: string,
  filterStatus: string,
  filterProject: string,
  filterResponsible: string,
  isMyTasksMode: boolean,
  currentUser: { name: string } | null
): Task[] => {
  return tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesProject = filterProject === "all" || task.project?.id.toString() === filterProject;
    const matchesResponsible = filterResponsible === "all" || 
                            (task.assignedTo && task.assignedTo.name === filterResponsible);
    const matchesMyTaskMode = !isMyTasksMode || 
                          (task.assignedTo && task.assignedTo.name === currentUser?.name);
    
    return matchesSearch && matchesStatus && matchesProject && matchesResponsible && matchesMyTaskMode;
  });
};
