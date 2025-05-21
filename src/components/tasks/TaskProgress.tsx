'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '@/contexts/TaskContext';

export default function TaskProgress() {
  const { progressPercentage, completedTasksCount, totalTasksCount } = useTasks();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full md:w-72">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">Daily Progress</span>
        <span className="text-sm font-bold text-orange-500">{progressPercentage}%</span>
      </div>
      
      <div className="retro-progress rounded-lg overflow-hidden">
        <motion.div 
          className="retro-progress-bar relative"
          initial={{ width: '0%' }}
          animate={{ width: isVisible ? `${progressPercentage}%` : '0%' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Pixelated progress effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full w-full grid grid-cols-12 pixelated-mask">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-full bg-orange-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i * 8.33 <= progressPercentage ? 1 : 0.2 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="text-xs text-gray-400 mt-1 text-right">
        {completedTasksCount} of {totalTasksCount} tasks completed
      </div>
    </div>
  );
}