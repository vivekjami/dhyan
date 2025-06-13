'use client';

import { useState } from 'react';
import Header from './components/Header';
import Analytics from './components/Analytics';
import TaskBoard from './components/TaskBoard';
import AddTaskModal from './components/AddTaskModal';
import { useTasks } from './hooks/useTasks';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    reorderTasks,
    getTaskStats,
  } = useTasks();

  const stats = getTaskStats();

  const handleAddTask = (taskData: Parameters<typeof addTask>[0]) => {
    addTask(taskData);
  };

  const handleEditTask = (id: string) => {
    // For now, we'll just log this - you could implement an edit modal
    console.log('Edit task:', id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Analytics */}
          <div className="lg:col-span-1">
            <Analytics stats={stats} />
          </div>

          {/* Main Task Board */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Today's Tasks</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary hidden sm:flex items-center space-x-2"
                >
                  <span>Add Task</span>
                </button>
              </div>

              <TaskBoard
                tasks={tasks}
                onStart={startTask}
                onComplete={completeTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                onAddTask={() => setIsAddModalOpen(true)}
                activeTaskId={activeTaskId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}