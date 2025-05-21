// contexts/TaskContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('dhyan_tasks');
    if (savedTasks) {
      try {
        // Convert ISO date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks).map((task: Omit<Task, 'createdAt'> & { createdAt: string }) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('dhyan_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Calculate progress whenever tasks change
  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    setCompletedTasksCount(completed);
    setProgressPercentage(tasks.length ? Math.round((completed / tasks.length) * 100) : 0);
  }, [tasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return Promise.resolve();
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      reorderTasks,
      progressPercentage,
      completedTasksCount,
      totalTasksCount: tasks.length
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}