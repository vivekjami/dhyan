'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '@/hooks/useTasks';
import { TaskFormData } from '@/types/task';
import { X, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    estimatedTime: 30
  });
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (formData.estimatedTime < 15 || formData.estimatedTime > 480) {
      newErrors.estimatedTime = 'Time must be between 15 and 480 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addTask(formData);
      setFormData({ title: '', description: '', estimatedTime: 30 });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', estimatedTime: 30 });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Add New Task</h2>
                <motion.button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="What needs to be done?"
                    maxLength={50}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.title.length}/50 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Add more details about this task..."
                    rows={3}
                    maxLength={200}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.description.length}/200 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="estimatedTime" className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.estimatedTime ? 'border-red-500' : 'border-slate-300'
                    }`}
                    min={15}
                    max={480}
                    step={15}
                  />
                  {errors.estimatedTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.estimatedTime}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Between 15 minutes and 8 hours
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}