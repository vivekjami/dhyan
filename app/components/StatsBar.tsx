import { Task } from '../types/task';

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="bg-white p-4 rounded shadow mb-4 text-black">
      <p className="text-sm">Total Tasks: {tasks.length}</p>
      <p className="text-sm">Completed Tasks Today: {completedTasks}</p>
    </div>
  );
}