import { Task } from '@/types/task';
import { formatTime } from '@/utils/helpers';

interface AnalyticsProps {
  tasks: Task[];
}

export default function Analytics({ tasks }: AnalyticsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  const totalTimeSpent = tasks
    .filter(task => task.completedAt && task.startedAt)
    .reduce((total, task) => {
      const start = new Date(task.startedAt!).getTime();
      const end = new Date(task.completedAt!).getTime();
      return total + Math.floor((end - start) / (1000 * 60));
    }, 0);

  const averageCompletionTime = completedTasks > 0 
    ? Math.floor(totalTimeSpent / completedTasks) 
    : 0;

  const productivityPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: completedTasks,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Time Spent',
      value: formatTime(totalTimeSpent),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Analytics</h2>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${stat.bgColor}`}></div>
              <span className="text-sm font-medium text-gray-700">{stat.label}</span>
            </div>
            <span className={`text-sm font-semibold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Productivity</span>
            <span className="text-sm font-semibold text-indigo-600">
              {productivityPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${productivityPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {averageCompletionTime > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500">Average Completion Time</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTime(averageCompletionTime)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}