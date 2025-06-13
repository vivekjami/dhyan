import { useState, useEffect, useRef } from 'react';

export function useTimer(isActive: boolean, startTime?: Date) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && startTime) {
      const updateElapsedTime = () => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      };

      // Update immediately
      updateElapsedTime();

      // Then update every second
      intervalRef.current = setInterval(updateElapsedTime, 1000);
      
      console.log('Timer started for task started at:', startTime);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!isActive) {
        setElapsedTime(0);
      }
      console.log('Timer stopped, isActive:', isActive);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, startTime]);

  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    formattedTime: formatElapsedTime(elapsedTime)
  };
}