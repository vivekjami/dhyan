export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const calculateProgress = (startedAt: Date, estimatedTime: number): number => {
  const now = new Date();
  const elapsedTime = (now.getTime() - startedAt.getTime()) / (1000 * 60); // in minutes
  return Math.min((elapsedTime / estimatedTime) * 100, 100);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isNewDay = (lastDate: string): boolean => {
  const today = new Date().toDateString();
  return lastDate !== today;
};