'use client';

import { getCurrentDate } from '@/utils/helpers';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-slate-200 px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <motion.h1 
            className="text-2xl font-bold text-slate-800"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Dhyan
          </motion.h1>
          <motion.p 
            className="text-sm text-slate-500 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {getCurrentDate()}
          </motion.p>
        </div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">Focus Mode</p>
            <p className="text-xs text-slate-500">Stay productive today</p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}