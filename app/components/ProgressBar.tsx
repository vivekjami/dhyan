
'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  remainingTime: number;
  elapsedTime: number;
}

export default function ProgressBar({ percentage, remainingTime, elapsedTime }: ProgressBarProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {Math.round(percentage)}%</span>
        <span>Remaining: {formatTime(remainingTime)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full progress-bar"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 text-center">
        Elapsed: {formatTime(elapsedTime)}
      </div>
    </div>
  );
}
