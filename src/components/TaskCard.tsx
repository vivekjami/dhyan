import { useState } from 'react';
import { Play, Pause, CheckCircle, Edit2, Trash2, Clock, GripVertical } from 'lucide-react';
import { Task } from '@/types/task';
import { formatTime, formatElapsedTime, calculateProgress } from '@/utils/helpers';
import { useTimer } from '@/hooks/useTimer';
import ProgressBar from './ProgressBar';

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isActive: boolean;
}

export default function TaskCard({ 
  task, 
  onStart, 
  onComplete, 
  onEdit, 
  onDelete, 
  isActive 
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const elapsedTime = useTimer(task.status === 'in-progress', task.startedAt);
  const progress = task.status === 'in-progress' 
    ? calculateProgress(elapsedTime, task.estimatedTime)
    : task.status === 'completed' ? 100 : 0;

  const getStatusColor = () => {
    switch (task.status) {
      case 'pending': return 'border-gray-300 bg-gray-50';
      case 'in-progress': return 'border-blue-500 bg-blue-50';
      case 'completed': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusIndicator = () => {
    switch (task.status) {
      case 'pending': return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
      case 'in-progress': return <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  return (
    <div 
      className={`task-card border-2 rounded-lg p-4 ${getStatusColor()} ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <GripVertical size={16} className="text-gray-400 cursor-grab" />
          {getStatusIndicator()}
          <div className="flex-1">
            <h3 className={`font-semibold ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          {task.status !== 'completed' && (
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-1">
          <Clock size={14} />
          <span>{formatTime(task.estimatedTime)}</span>
        </div>
        
        {task.status === 'in-progress' && (
          <span className="font-medium text-blue-600">
            {formatElapsedTime(elapsedTime)}
          </span>
        )}
        
        {task.status === 'completed' && task.completedAt && task.startedAt && (
          <span className="font-medium text-green-600">
            Completed in {formatTime(
              Math.floor((new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime()) / (1000 * 60))
            )}
          </span>
        )}
      </div>

      {(task.status === 'in-progress' || task.status === 'completed') && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      )}

      <div className="flex space-x-2">
        {task.status === 'pending' && !isActive && (
          <button
            onClick={() => onStart(task.id)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Play size={16} />
            <span>Start Task</span>
          </button>
        )}
        
        {task.status === 'pending' && isActive && (
          <button
            disabled
            className="flex-1 px-3 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
          >
            Another task in progress
          </button>
        )}
        
        {task.status === 'in-progress' && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium bounce"
          >
            <CheckCircle size={16} />
            <span>Complete Task</span>
          </button>
        )}
        
        {task.status === 'completed' && (
          <div className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            <CheckCircle size={16} />
            <span>Completed</span>
          </div>
        )}
      </div>
    </div>
  );
}