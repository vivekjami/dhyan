import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item, (key, value) => {
          // Convert date strings back to Date objects
          if (key.endsWith('At') && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        });
        setStoredValue(parsed);
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}