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
  isLoading: boolean;
  addTask: (task: NewTask) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  forceUpdate: () => void;
}

// Create context with default values
const TaskContext = createContext<TaskContextType>({
  tasks: [],
  isLoading: true,
  addTask: async () => {},
  updateTask: () => {},
  deleteTask: () => {},
  reorderTasks: () => {},
  progressPercentage: 0,
  completedTasksCount: 0,
  totalTasksCount: 0,
  forceUpdate: () => {},
});

// Custom hook to use the TaskContext
export const useTasks = () => useContext(TaskContext);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateCounter, setUpdateCounter] = useState(0);

  // Force update function to trigger re-renders when needed
  const forceUpdate = () => {
    setUpdateCounter(prev => prev + 1);
  };

  // Calculate progress metrics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Load tasks from localStorage on initial render
  useEffect(() => {
    // Function to load tasks from localStorage
    const loadTasks = () => {
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
          
          // Process tasks and force them to be valid
          const validTasks = parsedTasks.map((task: Partial<Task>) => ({
            id: task.id || String(Date.now() + Math.random()),
            title: task.title || 'Untitled Task',
            description: task.description || '',
            priority: task.priority && ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
            completed: Boolean(task.completed),
            createdAt: task.createdAt instanceof Date ? task.createdAt : new Date()
          }));
          
          setTasks(validTasks);
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        // Fallback to empty array if there's an error
        setTasks([]);
      } finally {
        // Give a short delay to ensure the UI has updated
        setTimeout(() => {
          setIsLoading(false);
        }, 50);
      }
    };

    // Small timeout to ensure we're fully client-side
    const timer = setTimeout(loadTasks, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    // Only save tasks if they've been loaded first (not in the initial loading state)
    if (!isLoading) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    }
  }, [tasks, isLoading, updateCounter]);

  // Add a new task
  const addTask = async (newTask: NewTask): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate network delay for better UX feedback
      setTimeout(() => {
        const task: Task = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : String(Date.now() + Math.random()),
          ...newTask,
          createdAt: new Date()
        };
        
        setTasks(prevTasks => [...prevTasks, task]);
        forceUpdate();
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
    forceUpdate();
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    forceUpdate();
  };

  // Reorder tasks (for drag and drop functionality)
  const reorderTasks = (newOrder: Task[]) => {
    setTasks(newOrder);
    forceUpdate();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        progressPercentage,
        completedTasksCount,
        totalTasksCount,
        forceUpdate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};