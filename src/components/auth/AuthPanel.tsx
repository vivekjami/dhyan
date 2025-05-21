// components/auth/AuthPanel.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function AuthPanel() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="retro-card mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.photoURL && (
                <motion.img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full pixelated retro-border"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.8 }}
                />
              )}
              <div>
                <h3 className="text-sm md:text-base font-bold text-green-400">
                  <span data-text="LOGGED IN" className="glitch">LOGGED IN</span>
                </h3>
                <p className="text-xs md:text-sm text-gray-300">{user.displayName || user.email}</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-sm md:text-base font-bold text-yellow-400">
                <span data-text="GUEST MODE" className="glitch">GUEST MODE</span>
              </h3>
              <p className="text-xs md:text-sm text-gray-300">Sign in to sync across devices</p>
            </div>
          )}
        </div>
        
        <motion.button
          className="retro-button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={user ? signOut : signInWithGoogle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {user ? 'Log Out' : 'Log In with Google'}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-white opacity-10 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}