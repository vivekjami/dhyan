'use client';

import { motion } from 'framer-motion';
import { useTasks } from '@/hooks/useTasks';
import { formatTime } from '@/utils/helpers';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const { analytics } = useTasks();

  const stats = [
    {
      label: 'Total Tasks',
      value: analytics.totalTasks,
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'Completed',
      value: analytics.completedTasks,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Time Planned',
      value: formatTime(analytics.totalEstimatedTime),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Productivity',
      value: `${analytics.productivityPercentage}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <motion.aside 
      className="w-80 bg-white border-r border-slate-200 p-6"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Analytics</h2>
          
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center p-4 rounded-lg border border-slate-100 hover:shadow-sm transition-shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className={`p-2 rounded-lg ${stat.bgColor} mr-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Ring */}
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={314}
                initial={{ strokeDashoffset: 314 }}
                animate={{ 
                  strokeDashoffset: 314 - (314 * analytics.productivityPercentage) / 100 
                }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {analytics.productivityPercentage}%
                </p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">Daily Progress</p>
        </motion.div>
      </div>
    </motion.aside>
  );
}