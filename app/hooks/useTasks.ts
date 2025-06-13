import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats } from '../types/task';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dhyan-tasks', []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Find the active task
  const activeTask = tasks.find(task => task.status === 'in-progress');

  useEffect(() => {
    if (activeTask) {
      setActiveTaskId(activeTask.id);
    } else {
      setActiveTaskId(null);
    }
  }, [activeTask]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'order' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'pending',
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
      // Stop any other active tasks
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

  const getTaskStats = useCallback((): TaskStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    const completedTasks = todayTasks.filter(task => task.status === 'completed');
    
    const totalTimeSpent = completedTasks.reduce((total, task) => {
      if (task.startedAt && task.completedAt) {
        const timeSpent = (task.completedAt.getTime() - task.startedAt.getTime()) / (1000 * 60);
        return total + timeSpent;
      }
      return total;
    }, 0);

    const averageCompletionTime = completedTasks.length > 0 
      ? totalTimeSpent / completedTasks.length 
      : 0;

    const productivityPercentage = todayTasks.length > 0 
      ? (completedTasks.length / todayTasks.length) * 100 
      : 0;

    return {
      totalTasks: todayTasks.length,
      completedTasks: completedTasks.length,
      totalTimeSpent: Math.round(totalTimeSpent),
      averageCompletionTime: Math.round(averageCompletionTime),
      productivityPercentage: Math.round(productivityPercentage),
    };
  }, [tasks]);

  return {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    reorderTasks,
    getTaskStats,
  };
}