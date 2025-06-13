export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  order: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  estimatedTime: number;
}