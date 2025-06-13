import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dhyan-tasks', []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    const activeTask = tasks.find(task => task.status === 'in-progress');
    setActiveTaskId(activeTask?.id || null);
  }, [tasks]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      order: tasks.length,
    };
    setTasks(prev => [...prev, newTask]);
  }, [tasks.length, setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const startTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return { ...task, status: 'in-progress' as const, startedAt: new Date() };
      }
      if (task.status === 'in-progress') {
        return { ...task, status: 'pending' as const, startedAt: undefined };
      }
      return task;
    }));
  }, [setTasks]);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: 'completed' as const, completedAt: new Date() }
        : task
    ));
  }, [setTasks]);

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    setTasks(tasksWithNewOrder);
  }, [setTasks]);

  return {
    tasks,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    reorderTasks,
  };
}