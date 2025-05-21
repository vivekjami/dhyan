'use client';

import  TaskList  from '@/components/tasks/TaskList';
import  PollList from '@/components/polls/PollList';
import { DndContext } from '@dnd-kit/core';

export function DashboardLayout() {
  return (
    <DndContext>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="retro-card">
          <h2 className="text-2xl mb-4">Tasks</h2>
          <TaskList />
        </div>
        <div className="retro-card">
          <h2 className="text-2xl mb-4">Polls</h2>
          <PollList />
        </div>
      </div>
    </DndContext>
  );
}