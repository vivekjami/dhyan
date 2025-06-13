
'use client';

import React from 'react';
import Header from './components/Header';
import Analytics from './components/Analytics';
import TaskBoard from './components/TaskBoard';
import { useTasks } from './hooks/useTasks';

export default function Home() {
  const {
    tasks,
    activeTaskId,
    analytics,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
  } = useTasks();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex">
        <Analytics analytics={analytics} />
        <TaskBoard
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAddTask={addTask}
          onStartTask={startTask}
          onCompleteTask={completeTask}
          onEditTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
}
