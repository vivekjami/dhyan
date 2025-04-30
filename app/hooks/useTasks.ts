'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/task';
import { loadTasks, saveTasks } from '../utils/localStorageHelpers';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks());

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Timer for progress bar
  useEffect(() => {
    const inProgressTask = tasks.find((task) => task.status === 'in-progress');
    if (!inProgressTask) return;

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === inProgressTask.id && task.progress < 100) {
            const seconds = task.estimatedTime * 60;
            const increment = 100 / seconds;
            const newProgress = Math.min(task.progress + increment, 100);
            return { ...task, progress: newProgress };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (title: string, description: string, estimatedTime: number) => {
    if (tasks.length >= 10) {
      alert('Maximum 10 tasks per day!');
      return;
    }
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      estimatedTime,
      status: 'pending',
      progress: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startTask = (id: string) => {
    const hasInProgress = tasks.some((task) => task.status === 'in-progress');
    if (hasInProgress) {
      alert('Only one task can be in progress at a time!');
      return;
    }
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: 'in-progress' as const, progress: 0 } : task
      )
    );
  };

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: 'completed' as const, progress: 100 } : task
      )
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTasks(result);
  };

  return { tasks, addTask, updateTask, deleteTask, startTask, completeTask, reorderTasks };
};