'use client';

import { useState } from 'react';
import { Task } from '../types/task';
import ProgressBar from './ProgressBar';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
  onStartTask,
  onCompleteTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime.toString());

  const handleSave = () => {
    onUpdateTask(task.id, {
      title,
      description,
      estimatedTime: parseInt(estimatedTime),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-2">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter task description"
          />
          
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter estimated time"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-black p-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-black p-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <p className="text-sm">Estimated Time: {task.estimatedTime} minutes</p>
          <p className="text-sm">Status: {task.status}</p>
          {task.status === 'in-progress' && <ProgressBar progress={task.progress} />}
          <div className="mt-2 flex space-x-2">
            {task.status === 'pending' && (
              <button
                onClick={() => onStartTask(task.id)}
                className="bg-blue-500 text-black p-2 rounded"
              >
                Start Task
              </button>
            )}
            {task.status === 'in-progress' && (
              <button
                onClick={() => onCompleteTask(task.id)}
                className="bg-green-500 text-black p-2 rounded"
              >
                Complete Task
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-black p-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-500 text-black p-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}