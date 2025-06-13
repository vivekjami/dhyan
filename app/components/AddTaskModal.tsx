
'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description?: string, estimatedTime?: number) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [errors, setErrors] = useState<{ title?: string; estimatedTime?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setEstimatedTime(30);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { title?: string; estimatedTime?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }
    
    if (estimatedTime < 15 || estimatedTime > 480) {
      newErrors.estimatedTime = 'Estimated time must be between 15 and 480 minutes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd(title.trim(), description.trim() || undefined, estimatedTime);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? 'border-error' : 'border-gray-300'
              }`}
              placeholder="Enter task title..."
              maxLength={50}
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task description..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
          </div>

          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time (minutes) *
            </label>
            <input
              type="number"
              id="estimatedTime"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.estimatedTime ? 'border-error' : 'border-gray-300'
              }`}
              min={15}
              max={480}
            />
            {errors.estimatedTime && (
              <p className="text-error text-sm mt-1">{errors.estimatedTime}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Between 15-480 minutes</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
