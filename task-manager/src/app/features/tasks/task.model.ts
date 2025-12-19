export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  completed: boolean;
  userEmail: string;
}
