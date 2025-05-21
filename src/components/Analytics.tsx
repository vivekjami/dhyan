'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/contexts/TaskContext';

interface AnalyticsProps {
  tasks: Task[];
  theme: 'office' | 'gaming';
}

export default function Analytics({ tasks, theme }: AnalyticsProps) {
  const [completedToday, setCompletedToday] = useState(0);
  const [completedThisWeek, setCompletedThisWeek] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  
  useEffect(() => {
    // Calculate tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCompleted = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return task.completed && taskDate.getTime() === today.getTime();
    }).length;
    
    // Calculate tasks completed this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekCompleted = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return task.completed && taskDate >= weekStart;
    }).length;
    
    // Calculate streak (simulated for demo)
    // In a real app, you'd track this in the database
    const calculatedStreak = Math.min(7, Math.max(1, todayCompleted > 0 ? 
      Math.floor(Math.random() * 5) + 1 : 0));
    
    setCompletedToday(todayCompleted);
    setCompletedThisWeek(weekCompleted);
    setStreakDays(calculatedStreak);
  }, [tasks]);

  return (
    <div className={`${theme === 'office' ? 'bg-slate-700/50' : 'bg-indigo-700/50'} rounded-lg p-4`}>
      <h3 className={`text-sm font-bold mb-3 ${theme === 'office' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
        Your Stats
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">Today</span>
            <span className={`text-xs font-bold ${theme === 'office' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
              {completedToday} tasks
            </span>
          </div>
          <motion.div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`h-full rounded-full ${theme === 'office' ? 'bg-cyan-500' : 'bg-fuchsia-500'}`}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, completedToday * 20)}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">This Week</span>
            <span className={`text-xs font-bold ${theme === 'office' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
              {completedThisWeek} tasks
            </span>
          </div>
          <motion.div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`h-full rounded-full ${theme === 'office' ? 'bg-cyan-500' : 'bg-fuchsia-500'}`}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, completedThisWeek * 10)}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Current Streak</span>
            <span className={`text-sm font-bold ${theme === 'office' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
              {streakDays} days
            </span>
          </div>
          
          <div className="flex justify-between mt-2">
            {[...Array(7)].map((_, i) => (
              <motion.div 
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  i < streakDays 
                    ? theme === 'office' 
                      ? 'bg-cyan-500 text-black' 
                      : 'bg-fuchsia-500 text-black'
                    : 'bg-gray-700 text-gray-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}