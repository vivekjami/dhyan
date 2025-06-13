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
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600">Progress</span>
        <span className="font-medium text-slate-800">{formattedTime}</span>
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>0m</span>
        <span>{Math.round(progress)}%</span>
        <span>{estimatedTime}m</span>
      </div>
    </div>
  );
}