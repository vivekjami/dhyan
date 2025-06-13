import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import ConfirmDialog from './ConfirmDialog';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  activeTaskId: string | null;
}

export default function TaskBoard({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onStartTask,
  onCompleteTask,
  activeTaskId,
}: TaskBoardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: string | null }>({
    isOpen: false,
    taskId: null,
  });

  const pendingTasks = tasks.filter(task => task.status === 'pending').sort((a, b) => a.order - b.order);
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed').sort((a, b) => 
    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  );

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddModalOpen(true);
  };

  const handleAddOrUpdate = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      onAddTask(taskData);
    }
  };

  const handleDelete = (taskId: string) => {
    setDeleteConfirm({ isOpen: true, taskId });
  };

  const confirmDelete = () => {
    if (deleteConfirm.taskId) {
      onDeleteTask(deleteConfirm.taskId);
    }
    setDeleteConfirm({ isOpen: false, taskId: null });
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started with your daily focus.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add Your First Task
          </button>
        </div>

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onAdd={handleAddOrUpdate}
          editTask={editingTask || undefined}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={onStartTask}
                onComplete={onCompleteTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isActive={!!activeTaskId}
              />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Tasks */}
      {inProgressTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={onStartTask}
                onComplete={onCompleteTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Today</h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={onStartTask}
                onComplete={onCompleteTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-200 flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddOrUpdate}
        editTask={editingTask || undefined}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, taskId: null })}
      />
    </div>
  );
}