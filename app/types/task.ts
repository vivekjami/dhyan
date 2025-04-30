export interface Task {
    id: string;
    title: string;
    description: string;
    estimatedTime: number; // in minutes
    status: 'pending' | 'in-progress' | 'completed';
    progress: number; // 0 to 100
  }