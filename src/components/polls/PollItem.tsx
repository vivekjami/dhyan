// components/polls/PollItem.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePolls, Poll } from '@/contexts/PollContext';

interface PollItemProps {
  poll: Poll;
}

export default function PollItem({ poll }: PollItemProps) {
  const { vote, deletePoll } = usePolls();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;
    
    await vote(poll.id, selectedOption);
    setHasVoted(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePoll(poll.id);
    } catch (error) {
      console.error('Error deleting poll:', error);
      setIsDeleting(false);
    }
  };

  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <motion.div 
      className="retro-card mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">{poll.question}</h3>
        <motion.button
          className="text-red-500 hover:text-red-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : '✕'}
        </motion.button>
      </div>
      
      <div className="space-y-3 mb-4">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <motion.div 
              className={`
                p-3 rounded-md cursor-pointer border-2 transition-colors
                ${selectedOption === option.id 
                  ? 'border-orange-500 bg-slate-700' 
                  : 'border-slate-700 bg-slate-800 hover:border-purple-700'}
                ${hasVoted ? 'cursor-default' : 'cursor-pointer'}
              `}
              whileHover={!hasVoted ? { scale: 1.01 } : {}}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {hasVoted && (
                  <span className="text-sm font-mono">
                    {option.votes} vote{option.votes !== 1 ? 's' : ''} 
                    ({calculatePercentage(option.votes)}%)
                  </span>
                )}
              </div>
              
              {hasVoted && (
                <motion.div 
                  className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-purple-600 to-orange-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${calculatePercentage(option.votes)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div>
          {hasVoted ? (
            <span>Total: {totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          ) : (
            <button
              className={`retro-button ${!selectedOption ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleVote}
              disabled={!selectedOption}
            >
              Vote
            </button>
          )}
        </div>
        
        <div>
          Created: {poll.createdAt.toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}