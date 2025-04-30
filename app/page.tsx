'use client';

import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsBar from './components/StatsBar';

export default function Home() {
  const { tasks, addTask, updateTask, deleteTask, startTask, completeTask } = useTasks();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
      <h1 className="text-3xl font-bold mb-6">Dhyan - Focus on One Task</h1>
      <div className="w-full max-w-md">
        <TaskForm onAddTask={addTask} taskCount={tasks.length} />
        <StatsBar tasks={tasks} />
        <TaskList
          tasks={tasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onStartTask={startTask}
          onCompleteTask={completeTask}
        />
      </div>
    </div>
  );
}