// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskProgress from '@/components/tasks/TaskProgress';
import { useTasks } from '@/contexts/TaskContext';

export default function HomePage() {
  const { tasks } = useTasks();
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Simulate loading for animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Hide intro after animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4 md:p-6 overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold text-orange-500 glitch" data-text="DHYAN">DHYAN</h1>
              <p className="mt-2 text-purple-400">Task Management System</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && !isLoading && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -50 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl font-bold text-orange-500"
                animate={{ 
                  textShadow: [
                    "0 0 7px #ff7e33",
                    "0 0 10px #ff7e33",
                    "0 0 21px #ff7e33",
                    "0 0 42px #ff7e33",
                    "0 0 82px #ff7e33",
                    "0 0 92px #ff7e33",
                    "0 0 102px #ff7e33",
                    "0 0 151px #ff7e33"
                  ]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: 0
                }}
              >
                Welcome to Dhyan
              </motion.h1>
              <motion.p 
                className="mt-2 text-cyan-400"
                animate={{ opacity: [0, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Your retro-themed productivity system
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 mt-6">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-orange-500">DHYAN</h1>
            <TaskProgress />
          </motion.div>
          <motion.div 
            className="mt-2 h-1 bg-gradient-to-r from-orange-600 via-purple-600 to-cyan-600"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          />
        </header>

        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <TaskForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            <TaskList />
          </motion.div>

          {tasks.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                📝
              </motion.div>
              <h2 className="text-2xl text-purple-400 mb-2">Ready to be productive?</h2>
              <p className="text-gray-400">Add your first task to get started!</p>
            </motion.div>
          )}
        </main>

        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-gray-500">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
          >
            Dhyan - Retro Task Management © {new Date().getFullYear()}
          </motion.p>
        </footer>
      </div>
    </div>
  );
}