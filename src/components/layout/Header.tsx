// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Auth from '../auth/Auth';
import { motion } from 'framer-motion';

export default function Header() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isGlitching, setIsGlitching] = useState(false);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <header className="bg-slate-800 border-b-4 border-orange-500 mb-8 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -5 }}
              animate={{ rotate: isGlitching ? [0, -3, 5, -5, 0] : 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-orange-500 glitch" data-text="DHYAN">
                DHYAN
              </h1>
            </motion.div>
            <span className="ml-2 text-xs text-cyan-400 bg-slate-900 px-2 py-1 rounded">v1.0</span>
          </div>
          
          <Auth />
        </div>
        
        <div className="flex mt-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'tasks'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            TASKS
          </button>
          <button
            onClick={() => setActiveTab('polls')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'polls'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            POLLS
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'analytics'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ANALYTICS
          </button>
        </div>
      </div>
    </header>
  );
}