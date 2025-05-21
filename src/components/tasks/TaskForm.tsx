// components/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { motion } from 'framer-motion';

export default function TaskForm() {
  const { addTask } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addTask({
        title,
        description,
        priority,
        completed: false,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error adding task', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      layout
      className="retro-card mb-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl mb-4">Add New Task</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="retro-input w-full"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isExpanded && e.target.value) {
                setIsExpanded(true);
              }
            }}
            onFocus={() => setIsExpanded(true)}
          />
        </div>
        
        <motion.div
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          initial={false}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mb-4">
            <textarea
              placeholder="Add description (optional)"
              className="retro-input w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Priority</label>
            <div className="flex space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio mr-2"
                  name="priority"
                  value="low"
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                />
                <span className="text-sm text-green-400">Low</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio mr-2"
                  name="priority"
                  value="medium"
                  checked={priority === 'medium'}
                  onChange={() => setPriority('medium')}
                />
                <span className="text-sm text-yellow-400">Medium</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio mr-2"
                  name="priority"
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                />
                <span className="text-sm text-red-400">High</span>
              </label>
            </div>
          </div>
        </motion.div>
        
        <div className="flex justify-end">
          {isExpanded && (
            <button
              type="button"
              className="mr-2 px-4 py-2 text-gray-300 hover:text-white"
              onClick={() => {
                setIsExpanded(false);
                if (!title) {
                  setTitle('');
                  setDescription('');
                  setPriority('medium');
                }
              }}
            >
              Cancel
            </button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="retro-button"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding
              </span>
            ) : (
              'Add Task'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}