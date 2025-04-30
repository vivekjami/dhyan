'use client';

import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (title: string, description: string, estimatedTime: number) => void;
  taskCount: number;
}

export default function TaskForm({ onAddTask, taskCount }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskCount >= 5) {
      alert('Maximum 5 tasks per day!');
      return;
    }
    if (!title || !description || !estimatedTime) {
      alert('Please fill in all fields!');
      return;
    }
    onAddTask(title, description, parseInt(estimatedTime));
    setTitle('');
    setDescription('');
    setEstimatedTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 text-black">
      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter task title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Estimated Time (minutes)</label>
        <input
          type="number"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter time in minutes"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}