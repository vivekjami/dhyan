// components/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '@/contexts/TaskContext';

interface TaskFormProps {
  onComplete: () => void;
}

export default function TaskForm({ onComplete }: TaskFormProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    await addTask({
      title,
      description,
      priority,
      completed: false,
    });
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <motion.form 
      className="retro-card mb-6 crt-effect"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg mb-4">New Task</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="retro-input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            className="retro-input w-full h-24"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Priority
          </label>
          <div className="flex space-x-4">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <motion.div 
                key={p}
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="radio"
                  id={`priority-${p}`}
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="hidden"
                />
                <label
                  htmlFor={`priority-${p}`}
                  className={`
                    px-3 py-1 rounded cursor-pointer border-2
                    ${priority === p 
                      ? p === 'low' 
                        ? 'bg-green-700 border-green-500' 
                        : p === 'medium' 
                          ? 'bg-yellow-700 border-yellow-500' 
                          : 'bg-red-700 border-red-500'
                      : 'bg-gray-800 border-gray-700'
                    }
                  `}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </label>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <motion.button
            type="button"
            className="retro-button bg-gray-700 border-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            className="retro-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">Saving...</span>
            ) : (
              'Save Task'
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}