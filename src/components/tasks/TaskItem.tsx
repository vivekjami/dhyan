'use client';

import { useState, useEffect } from 'react';
import { Task, useTasks } from '@/contexts/TaskContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask, forceUpdate } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedPriority, setEditedPriority] = useState(task.priority);

  // DnD setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Update local state if task prop changes
  useEffect(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedPriority(task.priority);
  }, [task]);

  // Toggle task completion
  const handleToggle = () => {
    updateTask(task.id, { completed: !task.completed });
    forceUpdate(); // Force context update
  };

  // Save edited task
  const handleSave = () => {
    if (!editedTitle.trim()) return;
    
    updateTask(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as 'low' | 'medium' | 'high',
    });
    setIsEditing(false);
    forceUpdate(); // Force context update
  };

  // Handle delete task
  const handleDelete = () => {
    deleteTask(task.id);
    forceUpdate(); // Force context update
  };

  // Get priority class for visual indication
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  if (isEditing) {
    return (
      <div className={`retro-task rounded-md ${getPriorityClass()}`}>
        <div className="mb-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="retro-input w-full mb-2"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="retro-input w-full h-20"
            placeholder="Task description"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <label htmlFor="priority-select" className="sr-only">Priority</label>
          <select
            id="priority-select"
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="retro-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-500"
              disabled={!editedTitle.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`retro-task rounded-md ${getPriorityClass()} ${task.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start">
        <div
          className="cursor-grab pt-1"
          {...listeners}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        
        <div className="ml-3 flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle}
                className="h-4 w-4 mr-2"
                title="Mark task as completed"
              />
              <h4 className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </h4>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-cyan-400 hover:text-cyan-300"
                title="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300"
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.priority === 'high' ? 'bg-red-900 text-red-200' :
              task.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
              'bg-green-900 text-green-200'
            }`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            <span className="text-xs text-gray-400">
              {task.createdAt instanceof Date ? task.createdAt.toLocaleDateString() : new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}