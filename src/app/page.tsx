'use client';

import { useTasks } from '@/hooks/useTasks';
import Header from '@/components/Header';
import Analytics from '@/components/Analytics';
import TaskBoard from '@/components/TaskBoard';

export default function HomePage() {
  const {
    tasks,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Analytics */}
          <div className="lg:col-span-1">
            <Analytics tasks={tasks} />
          </div>
          
          {/* Main Task Board */}
          <div className="lg:col-span-3">
            <TaskBoard
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onStartTask={startTask}
              onCompleteTask={completeTask}
              activeTaskId={activeTaskId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}