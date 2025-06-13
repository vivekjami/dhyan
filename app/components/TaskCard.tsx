
'use client';

import React, { useState } from 'react';
import { Task } from '../types/task';
import { Play, Square, CheckCircle, Edit2, Trash2, GripVertical } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useTimer } from '../hooks/useTimer';

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  canStart: boolean;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  isActive,
  canStart,
  onStart,
  onComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { elapsedTime, progressPercentage, remainingTime } = useTimer(
    isActive,
    task.estimatedTime,
    task.startedAt
  );

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-l-success bg-green-50';
      case 'in-progress':
        return 'border-l-primary bg-blue-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const formatEstimatedTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className={`task-card border-l-4 ${getStatusColor()} rounded-lg shadow-sm p-4 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <GripVertical className="w-4 h-4 text-gray-400 mt-1 cursor-grab" />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Est. {formatEstimatedTime(task.estimatedTime)}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(task.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={task.status === 'completed'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className={`p-1 transition-colors ${
                    showDeleteConfirm 
                      ? 'text-error hover:text-red-700' 
                      : 'text-gray-400 hover:text-error'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Active Task */}
      {isActive && (
        <div className="mt-4">
          <ProgressBar
            percentage={progressPercentage}
            remainingTime={remainingTime}
            elapsedTime={elapsedTime}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        {task.status === 'pending' && (
          <button
            onClick={() => onStart(task.id)}
            disabled={!canStart}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              canStart
                ? 'bg-primary text-white hover:bg-indigo-700 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 inline mr-2" />
            Start Task
          </button>
        )}
        
        {task.status === 'in-progress' && (
          <button
            onClick={() => onComplete(task.id)}
            className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-green-700 hover:scale-105 transition-all"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Complete Task
          </button>
        )}

        {task.status === 'completed' && (
          <div className="flex items-center text-success">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-error">
          Click delete again to confirm (auto-cancels in 5s)
        </div>
      )}
    </div>
  );
}
