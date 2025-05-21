// components/tasks/TaskList.tsx
'use client';

import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskList() {
  const { tasks, reorderTasks } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="retro-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl">Task List</h3>
        <div className="flex space-x-2 text-xs">
          <button
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext 
          items={filteredTasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              <motion.div layout className="space-y-2">
                {filteredTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                {filter === 'all' ? "No tasks yet. Add your first task!" : 
                 filter === 'active' ? "No active tasks. Great job!" : 
                 "No completed tasks yet."}
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  );
}