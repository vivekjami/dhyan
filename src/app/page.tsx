'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TaskBoard from '@/components/TaskBoard';

export default function HomePage() {
  return (
    <motion.div 
      className="flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <TaskBoard />
      </div>
    </motion.div>
  );
}