
'use client';

import { useState, useEffect, useRef } from 'react';

export function useTimer(isActive: boolean, estimatedTime: number, startedAt?: Date) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && startedAt) {
      const updateElapsed = () => {
        const now = new Date().getTime();
        const start = new Date(startedAt).getTime();
        const elapsed = Math.floor((now - start) / 1000); // in seconds
        setElapsedTime(elapsed);
      };

      updateElapsed(); // Initial calculation
      intervalRef.current = setInterval(updateElapsed, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!isActive) {
        setElapsedTime(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, startedAt]);

  const progressPercentage = Math.min((elapsedTime / (estimatedTime * 60)) * 100, 100);
  const remainingTime = Math.max((estimatedTime * 60) - elapsedTime, 0);

  return {
    elapsedTime,
    progressPercentage,
    remainingTime,
  };
}
