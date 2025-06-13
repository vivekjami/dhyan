import { Suspense } from 'react';
import ClientDashboard from '@/components/ClientDashboard';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <ClientDashboard />
    </Suspense>
  );
}