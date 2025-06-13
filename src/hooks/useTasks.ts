import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';
import { generateId, isNewDay } from '@/utils/helpers';

export function useTasks() {
  const [tasks, setTasks, isLoading] = useLocalStorage<Task[]>('dhyan-tasks', []);
  const [lastDate, setLastDate] = useLocalStorage('dhyan-last-date', new Date().toDateString());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Reset tasks if it's a new day
  useEffect(() => {
    if (!isLoading && isNewDay(lastDate)) {
      setTasks([]);
      setLastDate(new Date().toDateString());
    }
  }, [isLoading, lastDate, setTasks, setLastDate]);

  // Find active task
  useEffect(() => {
    const activeTask = tasks.find(task => task.status === 'in-progress');
    setActiveTaskId(activeTask?.id || null);
  }, [tasks]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'order' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date(),
      order: tasks.length
    };
    console.log('Adding new task:', newTask);
    setTasks(prev => [...prev, newTask]);
  }, [tasks.length, setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    console.log('Updating task:', id, updates);
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    console.log('Deleting task:', id);
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const startTask = useCallback((id: string) => {
    console.log('Starting task with ID:', id);
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === id) {
          console.log('Found task to start:', task.title);
          return { 
            ...task, 
            status: 'in-progress' as const, 
            startedAt: new Date() 
          };
        }
        // Stop any other active task
        if (task.status === 'in-progress') {
          console.log('Stopping previously active task:', task.title);
          return { 
            ...task, 
            status: 'pending' as const, 
            startedAt: undefined 
          };
        }
        return task;
      });
      
      console.log('Updated tasks after starting:', updatedTasks);
      return updatedTasks;
    });
  }, [setTasks]);

  const completeTask = useCallback((id: string) => {
    console.log('Completing task with ID:', id);
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: 'completed' as const, completedAt: new Date() }
        : task
    ));
  }, [setTasks]);

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index
    }));
    setTasks(tasksWithNewOrder);
  }, [setTasks]);

  // Analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const completedTime = tasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + task.estimatedTime, 0);
  
  const productivityPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    tasks: tasks.sort((a, b) => {
      // Sort by status first (in-progress, pending, completed), then by order
      const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.order - b.order;
    }),
    isLoading,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    reorderTasks,
    analytics: {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalEstimatedTime,
      completedTime,
      productivityPercentage
    }
  };
}