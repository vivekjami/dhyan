'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { formatTime } from '@/utils/helpers';
import ProgressBar from './ProgressBar';
import ConfirmDialog from './ConfirmDialog';
import { 
  Play, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  GripVertical,
  Pause
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { startTask, completeTask, deleteTask, updateTask } = useTasks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const getStatusColor = () => {
    switch (task.status) {
      case 'pending': return 'border-slate-300';
      case 'in-progress': return 'border-indigo-400 ring-2 ring-indigo-100';
      case 'completed': return 'border-emerald-400 bg-emerald-50';
      default: return 'border-slate-300';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending': return <Play className="w-4 h-4" />;
      case 'in-progress': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleStart = () => {
    if (task.status === 'pending') {
      startTask(task.id);
    }
  };

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      updateTask(task.id, {
        title: editTitle,
        description: editDescription
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        className={`
          bg-white rounded-lg border-2 p-4 transition-all duration-200
          ${getStatusColor()}
          ${isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md hover:scale-102'}
          ${task.status === 'completed' ? 'opacity-75' : ''}
        `}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <GripVertical className="w-4 h-4 text-slate-400 mt-1 cursor-grab" />
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm font-medium"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm resize-none"
                    rows={2}
                    placeholder="Description (optional)"
                  />
                </div>
              ) : (
                <>
                  <h3 className={`font-medium text-slate-800 ${task.status === 'completed' ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm text-slate-600 mt-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleEdit}
              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Progress Bar for Active Tasks */}
        <AnimatePresence>
          {task.status === 'in-progress' && task.startedAt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <ProgressBar
                startedAt={task.startedAt}
                estimatedTime={task.estimatedTime}
                isActive={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{formatTime(task.estimatedTime)}</span>
          </div>

          <div className="flex items-center space-x-2">
            {task.status === 'pending' && (
              <motion.button
                onClick={handleStart}
                className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getStatusIcon()}
                <span>Start</span>
              </motion.button>
            )}

            {task.status === 'in-progress' && (
              <motion.button
                onClick={handleComplete}
                className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete</span>
              </motion.button>
            )}

            {task.status === 'completed' && (
              <div className="flex items-center space-x-1 text-emerald-600 text-sm font-medium">
                {getStatusIcon()}
                <span>Done</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
}