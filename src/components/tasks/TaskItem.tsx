// components/tasks/TaskItem.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks, Task } from '@/contexts/TaskContext';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isExpanded, setIsExpanded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleEdit = () => {
    if (isEditing) {
      updateTask(task.id, {
        title: editedTitle,
        description: editedDescription
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const priorityColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500'
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`retro-task ${priorityColors[task.priority]} rounded-md ${task.completed ? 'opacity-70' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center cursor-grab" {...listeners}>
            <motion.div
              className="w-6 h-1 bg-gray-500 rounded mb-1"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div
              className="w-6 h-1 bg-gray-500 rounded"
              whileHover={{ scale: 1.2 }}
            />
          </div>
        </div>

        <div className="col-span-9 overflow-hidden">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="retro-input w-full mb-2"
                autoFocus
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="retro-input w-full h-20"
              />
            </div>
          ) : (
            <div onClick={() => setIsExpanded(!isExpanded)}>
              <h3 className={`font-bold text-lg cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </h3>
              {(isExpanded || task.description.length < 50) && (
                <motion.p 
                  className={`text-sm mt-1 text-gray-300 ${task.completed ? 'line-through' : ''}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {task.description}
                </motion.p>
              )}
            </div>
          )}
        </div>

        <div className="col-span-2 flex justify-end items-start space-x-1">
          <motion.button
            className="w-6 h-6 flex items-center justify-center rounded bg-purple-800 text-white"
            whileHover={{ scale: 1.1, backgroundColor: '#6d28d9' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComplete}
          >
            {task.completed ? '✓' : '○'}
          </motion.button>
          
          <motion.button
            className="w-6 h-6 flex items-center justify-center rounded bg-blue-800 text-white"
            whileHover={{ scale: 1.1, backgroundColor: '#1e40af' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
          >
            {isEditing ? '💾' : '✎'}
          </motion.button>
          
          <motion.button
            className="w-6 h-6 flex items-center justify-center rounded bg-red-800 text-white"
            whileHover={{ scale: 1.1, backgroundColor: '#b91c1c' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
          >
            ×
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}