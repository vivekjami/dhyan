// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger glitch effect on hover
  const triggerGlitch = () => {
    if (!isGlitching) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 2000);
    }
  };

  return (
    <header className="bg-slate-800 border-b-4 border-orange-500 p-4 sticky top-0 z-10 scanline-effect">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <h1 
              className={`text-2xl md:text-3xl font-bold ${isGlitching ? 'glitch' : ''}`} 
              data-text="DHYAN"
              onMouseEnter={triggerGlitch}
            >
              DHYAN
            </h1>
          </Link>
          <span className="ml-2 text-xs bg-purple-600 text-white px-1 rounded">v1.0</span>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AuthButton />
        </motion.div>
      </div>
    </header>
  );
}