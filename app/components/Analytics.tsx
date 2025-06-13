
'use client';

import React from 'react';
import { Analytics as AnalyticsType } from '../types/task';
import { Clock, CheckCircle, Target, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  analytics: AnalyticsType;
}

export default function Analytics({ analytics }: AnalyticsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const progressRingStyle = (percentage: number) => ({
    strokeDasharray: `${2 * Math.PI * 40}`,
    strokeDashoffset: `${2 * Math.PI * 40 * (1 - percentage / 100)}`,
  });

  return (
    <div className="w-80 bg-white shadow-sm border-r border-gray-100 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Analytics</h2>
        
        {/* Progress Ring */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#6366f1"
                strokeWidth="8"
                fill="none"
                className="transition-all duration-1000 ease-out"
                style={progressRingStyle(analytics.productivityPercentage)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {Math.round(analytics.productivityPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Total Tasks</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{analytics.totalTasks}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-gray-700">Completed</span>
            </div>
            <span className="text-lg font-bold text-success">{analytics.completedTasks}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Time Spent</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {formatTime(analytics.totalTimeSpent)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-gray-700">Avg. Time</span>
            </div>
            <span className="text-lg font-bold text-secondary">
              {formatTime(analytics.averageCompletionTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
