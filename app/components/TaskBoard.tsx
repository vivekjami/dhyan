
'use client';

import React, { useState } from 'react';
import { Task } from '../types/task';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { Plus } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string, description?: string, estimatedTime?: number) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskBoard({
  tasks,
  activeTaskId,
  onAddTask,
  onStartTask,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
}: TaskBoardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pendingTasks = tasks.filter(task => task.status === 'pending').sort((a, b) => a.order - b.order);
  const inProgressTask = tasks.find(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed').sort((a, b) => b.order - a.order);

  const handleEditTask = (id: string) => {
    // For now, we'll just log the edit action
    // In a full implementation, you'd open an edit modal
    console.log('Edit task:', id);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Create your first task to get started with your daily planning.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Your First Task
          </button>
        </div>
      )}

      {/* Task Lists */}
      {tasks.length > 0 && (
        <div className="space-y-8">
          {/* In Progress Section */}
          {inProgressTask && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Currently Working On</h2>
              <TaskCard
                task={inProgressTask}
                isActive={true}
                canStart={false}
                onStart={onStartTask}
                onComplete={onCompleteTask}
                onEdit={handleEditTask}
                onDelete={onDeleteTask}
              />
            </div>
          )}

          {/* Pending Tasks Section */}
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h2>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isActive={false}
                    canStart={!activeTaskId}
                    onStart={onStartTask}
                    onComplete={onCompleteTask}
                    onEdit={handleEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Tasks</h2>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isActive={false}
                    canStart={false}
                    onStart={onStartTask}
                    onComplete={onCompleteTask}
                    onEdit={handleEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Add Button */}
      {tasks.length > 0 && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(title, description, estimatedTime) => {
          onAddTask(title, description, estimatedTime);
        }}
      />
    </div>
  );
}
