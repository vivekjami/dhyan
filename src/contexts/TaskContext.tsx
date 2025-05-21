'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define Task type
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

// Define new task input type
export interface NewTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: NewTask) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

// Create context with default values
const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: async () => {},
  updateTask: () => {},
  deleteTask: () => {},
  reorderTasks: () => {},
  progressPercentage: 0,
  completedTasksCount: 0,
  totalTasksCount: 0,
});

// Custom hook to use the TaskContext
export const useTasks = () => useContext(TaskContext);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Calculate progress metrics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        // Parse the stored JSON and convert date strings back to Date objects
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
          if (key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    // Only save tasks if they've been loaded first
    if (loaded) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    }
  }, [tasks, loaded]);

  // Add a new task
  const addTask = async (newTask: NewTask): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate network delay for better UX feedback
      setTimeout(() => {
        const task: Task = {
          id: crypto.randomUUID(),
          ...newTask,
          createdAt: new Date()
        };
        
        setTasks(prevTasks => [...prevTasks, task]);
        resolve();
      }, 300);
    });
  };

  // Update an existing task
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Reorder tasks (for drag and drop functionality)
  const reorderTasks = (newOrder: Task[]) => {
    setTasks(newOrder);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        progressPercentage,
        completedTasksCount,
        totalTasksCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};