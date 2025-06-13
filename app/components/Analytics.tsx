'use client';

import { TaskStats } from '../types/task';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { formatMinutes } from '../utils/helpers';

interface AnalyticsProps {
  stats: TaskStats;
}

export default function Analytics({ stats }: AnalyticsProps) {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Time Spent',
      value: formatMinutes(stats.totalTimeSpent),
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Productivity',
      value: `${stats.productivityPercentage}%`,
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Analytics</h2>
      
      <div className="space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">{item.label}</p>
                <p className="text-lg font-semibold text-slate-800">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Ring */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.productivityPercentage / 100)}`}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-slate-800">
              {stats.productivityPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}