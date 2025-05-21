// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { PollProvider } from '@/contexts/PollContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        <PollProvider>
          {children}
        </PollProvider>
      </TaskProvider>
    </AuthProvider>
  );
}