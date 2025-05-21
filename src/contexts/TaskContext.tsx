// contexts/TaskContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
//   DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  order: number;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  completedTasksCount: number;
  totalTasksCount: number;
  progressPercentage: number;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // Calculate task statistics
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const progressPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Load tasks from Firestore when user logs in
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        // If not logged in, try to load from localStorage
        const storedTasks = localStorage.getItem('dhyan_tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
        return;
      }

      try {
        const q = query(
          collection(db, 'tasks'), 
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const loadedTasks: Task[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedTasks.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            priority: data.priority,
            createdAt: data.createdAt?.toDate() || new Date(),
            order: data.order || 0
          });
        });
        
        // Sort by order
        loadedTasks.sort((a, b) => a.order - b.order);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks', error);
      }
    };

    loadTasks();
  }, [user]);

  // Save to localStorage when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('dhyan_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    try {
      const newOrder = tasks.length > 0 
        ? Math.max(...tasks.map(t => t.order)) + 1 
        : 0;
      
      if (user) {
        // Add to Firestore if logged in
        const docRef = await addDoc(collection(db, 'tasks'), {
          ...task,
          userId: user.uid,
          createdAt: serverTimestamp(),
          order: newOrder
        });
        
        setTasks([...tasks, {
          id: docRef.id,
          ...task,
          createdAt: new Date(),
          order: newOrder
        }]);
      } else {
        // Add to local state only
        const newTask: Task = {
          id: Date.now().toString(),
          ...task,
          createdAt: new Date(),
          order: newOrder
        };
        
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      if (user) {
        // Update in Firestore if logged in
        const taskRef = doc(db, 'tasks', id);
        await updateDoc(taskRef, updatedTask);
      }
      
      // Update in local state
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      ));
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (user) {
        // Delete from Firestore if logged in
        const taskRef = doc(db, 'tasks', id);
        await deleteDoc(taskRef);
      }
      
      // Delete from local state
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const reorderTasks = async (reorderedTasks: Task[]) => {
    try {
      // Update order property for each task
      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        order: index
      }));
      
      setTasks(updatedTasks);
      
      // Update in Firestore if logged in
      if (user) {
        updatedTasks.forEach(async (task) => {
          const taskRef = doc(db, 'tasks', task.id);
          await updateDoc(taskRef, { order: task.order });
        });
      }
    } catch (error) {
      console.error('Error reordering tasks', error);
    }
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        reorderTasks,
        completedTasksCount,
        totalTasksCount,
        progressPercentage
      }}
    >
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