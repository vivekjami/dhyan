
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Analytics } from '../types/task';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dhyan-tasks', []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const addTask = useCallback((title: string, description?: string, estimatedTime: number = 30) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      estimatedTime,
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
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }, [setTasks, activeTaskId]);

  const startTask = useCallback((id: string) => {
    // Stop any currently active task
    if (activeTaskId) {
      updateTask(activeTaskId, { status: 'pending' });
    }
    
    updateTask(id, { 
      status: 'in-progress', 
      startedAt: new Date() 
    });
    setActiveTaskId(id);
  }, [activeTaskId, updateTask]);

  const completeTask = useCallback((id: string) => {
    updateTask(id, { 
      status: 'completed', 
      completedAt: new Date() 
    });
    setActiveTaskId(null);
  }, [updateTask]);

  const reorderTasks = useCallback((draggedId: string, targetId: string) => {
    setTasks(prev => {
      const draggedIndex = prev.findIndex(task => task.id === draggedId);
      const targetIndex = prev.findIndex(task => task.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const newTasks = [...prev];
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);
      
      return newTasks.map((task, index) => ({ ...task, order: index }));
    });
  }, [setTasks]);

  const analytics: Analytics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    totalTimeSpent: tasks
      .filter(task => task.completedAt && task.startedAt)
      .reduce((total, task) => {
        const duration = new Date(task.completedAt!).getTime() - new Date(task.startedAt!).getTime();
        return total + (duration / (1000 * 60)); // Convert to minutes
      }, 0),
    averageCompletionTime: (() => {
      const completedTasks = tasks.filter(task => task.completedAt && task.startedAt);
      if (completedTasks.length === 0) return 0;
      const totalTime = completedTasks.reduce((total, task) => {
        const duration = new Date(task.completedAt!).getTime() - new Date(task.startedAt!).getTime();
        return total + (duration / (1000 * 60));
      }, 0);
      return totalTime / completedTasks.length;
    })(),
    productivityPercentage: tasks.length > 0 ? 
      (tasks.filter(task => task.status === 'completed').length / tasks.length) * 100 : 0,
  };

  return {
    tasks,
    activeTaskId,
    analytics,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    reorderTasks,
  };
}
