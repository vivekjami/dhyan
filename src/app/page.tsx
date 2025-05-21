// app/page.tsx
'use client';

import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!user) return <p>Please sign in to manage your tasks.</p>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-4">
        <h1 className="text-3xl font-retro">My Tasks</h1>
      </header>

      <section className="mb-6">
        <TaskForm onComplete={() => console.log('Task completed')} />
      </section>

      <section>
        <TaskList />
      </section>
    </main>
  );
}
