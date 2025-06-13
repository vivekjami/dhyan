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

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  totalTimeSpent: number;
  averageCompletionTime: number;
  productivityPercentage: number;
}