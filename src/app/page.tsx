'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/components/auth/Auth';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskProgress from '@/components/tasks/TaskProgress';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'tasks' | 'polls'>('tasks');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <motion.div 
          className="text-orange-500 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="font-retro">
            <span className="inline-block">L</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.1s' }}>o</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>a</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>d</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>i</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.5s' }}>n</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.6s' }}>g</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.7s' }}>.</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.8s' }}>.</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.9s' }}>.</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 crt-effect scanline-effect">
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header 
          className="mb-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-orange-500 glitch" data-text="DHYAN">
              <span className="font-['Press_Start_2P']">DHYAN</span>
            </h1>
            <p className="text-purple-400 mt-1 font-['VT323'] text-xl">Task Management & Polls</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`retro-button ${view === 'tasks' ? 'bg-orange-500' : 'bg-slate-700'}`}
                onClick={() => setView('tasks')}
              >
                Tasks
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`retro-button ${view === 'polls' ? 'bg-orange-500' : 'bg-slate-700'}`}
                onClick={() => setView('polls')}
              >
                Polls
              </motion.button>
            </div>
            <Auth />
          </div>
        </motion.header>

        {!user ? (
          <motion.div 
            className="retro-card text-center p-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-2xl text-purple-400 mb-4">Welcome to Dhyan</h2>
            <p className="text-gray-300 mb-6">
              Sign in to manage your tasks and create polls with our retro-themed task manager.
            </p>
            <div className="flex justify-center">
              <Auth />
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'tasks' ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <motion.div variants={itemVariants}>
                      <TaskForm />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TaskList />
                    </motion.div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <motion.div 
                      className="retro-card mb-6"
                      variants={itemVariants}
                    >
                      <h3 className="text-xl mb-4 text-purple-400">Your Progress</h3>
                      <TaskProgress />
                      
                      <div className="mt-6 pt-4 border-t border-slate-700">
                        <h4 className="text-md text-orange-400 mb-2">Quick Tips</h4>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">→</span>
                            Drag tasks to reorder them
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">→</span>
                            Set priority levels for better organization
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">→</span>
                            Tasks are saved locally and synced when signed in
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-6 pulse-effect">
                        <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-orange-500">
                          <p className="text-sm text-white">
                            <span className="text-orange-400 font-bold">PRO TIP:</span> Complete tasks to increase your daily progress score!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="retro-card"
                      variants={itemVariants}
                    >
                      <h3 className="text-xl mb-4 text-purple-400">Coming Soon</h3>
                      <p className="text-gray-300 mb-4">
                        Poll creation and voting functionality will be available soon!
                      </p>
                      <div className="retro-progress rounded-lg overflow-hidden">
                        <div className="retro-progress-bar relative" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">60% complete</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="polls"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="retro-card text-center p-8">
                  <h2 className="text-2xl text-purple-400 mb-4">Polls Coming Soon</h2>
                  <p className="text-gray-300 mb-6">
                    The poll creation feature is currently under development. Check back soon!
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="retro-progress rounded-lg overflow-hidden">
                      <div className="retro-progress-bar relative" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">75% complete</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        <motion.footer 
          className="mt-12 text-center text-gray-500 text-sm"
          variants={itemVariants}
        >
          <p>Dhyan - Your Retro Task Manager &copy; {new Date().getFullYear()}</p>
        </motion.footer>
      </motion.div>
    </div>
  );
}