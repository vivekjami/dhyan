'use client';

import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/helpers';

interface ProgressBarProps {
  estimatedTime: number;
  startedAt?: Date;
  isActive: boolean;
}

export default function ProgressBar({ estimatedTime, startedAt, isActive }: ProgressBarProps) {
  const { elapsedTime, progressPercentage, remainingTime } = useTimer(
    isActive,
    estimatedTime,
    startedAt
  );

  if (!isActive || !startedAt) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between text-xs text-slate-600">
        <span>Progress: {Math.round(progressPercentage)}%</span>
        <span>Remaining: {formatTime(remainingTime)}</span>
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="progress-bar h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      
      <div className="text-xs text-slate-500 text-center">
        Elapsed: {formatTime(elapsedTime)}
      </div>
    </div>
  );
}