'use client';

import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { calculateProgress } from '@/utils/helpers';

interface ProgressBarProps {
  startedAt: Date;
  estimatedTime: number;
  isActive: boolean;
}

export default function ProgressBar({ startedAt, estimatedTime, isActive }: ProgressBarProps) {
  const { elapsedTime, formattedTime } = useTimer(isActive, startedAt);
  const progress = calculateProgress(startedAt, estimatedTime);

  return (
    <div className="space-y-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
      <div className="flex justify-between items-center text-sm">
        <span className="text-indigo-700 font-medium">Task in Progress</span>
        <span className="font-mono text-indigo-800 font-bold">{formattedTime}</span>
      </div>
      
      <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-indigo-600">
        <span>Started</span>
        <span className="font-medium">{Math.round(progress)}% complete</span>
        <span>Target: {estimatedTime}m</span>
      </div>
    </div>
  );
}