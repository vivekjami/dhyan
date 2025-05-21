// components/polls/PollList.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePolls } from '@/contexts/PollContext';
import PollItem from './PollItem';
import PollForm from './PollForm';

export default function PollList() {
  const { polls } = usePolls();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-xl md:text-2xl"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Poll Creator
        </motion.h2>
        <motion.button
          className="retro-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : 'Create Poll'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PollForm onComplete={() => setIsFormOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {polls.length === 0 ? (
          <div className="retro-card p-8 text-center">
            <p className="text-xl text-gray-400">No polls yet. Create one to get started!</p>
          </div>
        ) : (
          <AnimatePresence>
            {polls.map((poll) => (
              <PollItem key={poll.id} poll={poll} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}