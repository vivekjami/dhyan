'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  SortableItem,
} from './SortableTaskCard';
import { Task } from '../types/task';
import { Plus, ListTodo } from 'lucide-react';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  onAddTask: () => void;
  activeTaskId: string | null;
}

export default function TaskBoard({
  tasks,
  onStart,
  onComplete,
  onEdit,
  onDelete,
  onReorder,
  onAddTask,
  activeTaskId,
}: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separate tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Only allow reordering of pending tasks
  const sortableTasks = pendingTasks.sort((a, b) => a.order - b.order);

  function handleDragStart(event: any) {
    setDraggedTaskId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggedTaskId(null);
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortableTasks.findIndex(task => task.id === active.id);
      const newIndex = sortableTasks.findIndex(task => task.id === over?.id);

      const reorderedPendingTasks = arrayMove(sortableTasks, oldIndex, newIndex);
      const reorderedAllTasks = [
        ...reorderedPendingTasks,
        ...inProgressTasks,
        ...completedTasks,
      ];

      onReorder(reorderedAllTasks);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h3>
          <p className="text-slate-600 mb-6 max-w-sm">
            Start your productive day by adding your first task. Break down your goals into manageable chunks.
          </p>
          <button
            onClick={onAddTask}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Task</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* In Progress Tasks */}
      {inProgressTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-slow"></div>
            <span>In Progress</span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={onStart}
                  onComplete={onComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isActive={task.id === activeTaskId}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span>Pending Tasks</span>
          </h2>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                <AnimatePresence>
                  {sortableTasks.map((task) => (
                    <SortableItem key={task.id} id={task.id}>
                      <TaskCard
                        task={task}
                        onStart={onStart}
                        onComplete={onComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isActive={task.id === activeTaskId}
                        isDragging={task.id === draggedTaskId}
                      />
                    </SortableItem>
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Completed ({completedTasks.length})</span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="celebrate"
                >
                  <TaskCard
                    task={task}
                    onStart={onStart}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isActive={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <motion.button
        onClick={onAddTask}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}