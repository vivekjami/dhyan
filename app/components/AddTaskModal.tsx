'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Task } from '../types/task';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'status'>) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }

    if (description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (estimatedTime < 15 || estimatedTime > 480) {
      newErrors.estimatedTime = 'Estimated time must be between 15 and 480 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedTime,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setEstimatedTime(30);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setEstimatedTime(30);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Add New Task</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`input-field ${errors.title ? 'border-error' : ''}`}
                  placeholder="Enter task title..."
                  maxLength={50}
                />
                {errors.title && (
                  <p className="text-error text-xs mt-1">{errors.title}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">{title.length}/50 characters</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`input-field resize-none h-20 ${errors.description ? 'border-error' : ''}`}
                  placeholder="Enter task description..."
                  maxLength={200}
                />
                {errors.description && (
                  <p className="text-error text-xs mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">{description.length}/200 characters</p>
              </div>

              <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-slate-700 mb-1">
                  Estimated Time (minutes) *
                </label>
                <input
                  type="number"
                  id="estimatedTime"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                  className={`input-field ${errors.estimatedTime ? 'border-error' : ''}`}
                  min={15}
                  max={480}
                />
                {errors.estimatedTime && (
                  <p className="text-error text-xs mt-1">{errors.estimatedTime}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">Between 15 and 480 minutes</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}