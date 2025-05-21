// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TaskProvider>
      {children}
    </TaskProvider>
  );
}