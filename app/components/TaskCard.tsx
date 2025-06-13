'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  GripVertical,
  MoreVertical 
} from 'lucide-react';
import { Task } from '../types/task';
import { formatMinutes } from '../utils/helpers';
import ProgressBar from './ProgressBar';
import ConfirmDialog from './ConfirmDialog';

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isActive: boolean;
  isDragging?: boolean;
}

export default function TaskCard({
  task,
  onStart,
  onComplete,
  onEdit,
  onDelete,
  isActive,
  isDragging = false,
}: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-success bg-success/5';
      case 'in-progress':
        return 'border-primary bg-primary/5';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in-progress':
        return <Pause className="w-5 h-5 text-primary" />;
      default:
        return <Play className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    
    switch (action) {
      case 'start':
        onStart(task.id);
        break;
      case 'complete':
        onComplete(task.id);
        break;
      case 'edit':
        onEdit(task.id);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          y: 0,
          scale: isDragging ? 1.02 : 1,
        }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: isDragging ? 1.02 : 1.02 }}
        className={`task-card p-4 rounded-xl border-2 ${getStatusColor()} ${
          task.status === 'completed' ? 'opacity-75' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="drag-handle mt-1">
              <GripVertical className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-slate-800 ${
                task.status === 'completed' ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatMinutes(task.estimatedTime)}</span>
                </div>
                <span>•</span>
                <span className="capitalize">{task.status.replace('-', ' ')}</span>
              </div>

              <ProgressBar
                estimatedTime={task.estimatedTime}
                startedAt={task.startedAt}
                isActive={task.status === 'in-progress'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-3">
            {task.status === 'pending' && (
              <button
                onClick={(e) => handleAction('start', e)}
                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                title="Start Task"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            
            {task.status === 'in-progress' && (
              <button
                onClick={(e) => handleAction('complete', e)}
                className="p-2 text-primary hover:text-success hover:bg-success/10 rounded-lg transition-all duration-200"
                title="Complete Task"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]"
                >
                  {task.status !== 'completed' && (
                    <button
                      onClick={(e) => handleAction('edit', e)}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => handleAction('delete', e)}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/5 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(task.id);
          setShowDeleteDialog(false);
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  );
}