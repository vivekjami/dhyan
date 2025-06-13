'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { Plus, CheckCircle } from 'lucide-react';

export default function TaskBoard() {
  const { tasks, reorderTasks } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Task Board</h2>
            <p className="text-slate-600 mt-1">Organize and track your daily tasks</p>
          </div>
        </motion.div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h3>
            <p className="text-slate-600 mb-6">Start by adding your first task to get organized</p>
            <motion.button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Task</span>
            </motion.button>
          </motion.div>
        )}

        {/* Task Lists */}
        {tasks.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="space-y-8">
              {/* In Progress Tasks */}
              {inProgressTasks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    In Progress
                  </h3>
                  <SortableContext items={inProgressTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {inProgressTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </motion.section>
              )}

              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-slate-400 rounded-full mr-2"></div>
                    Pending ({pendingTasks.length})
                  </h3>
                  <SortableContext items={pendingTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {pendingTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </motion.section>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    Completed ({completedTasks.length})
                  </h3>
                  <SortableContext items={completedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {completedTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </motion.section>
              )}
            </div>
          </DndContext>
        )}

        {/* Floating Action Button */}
        {tasks.length > 0 && (
          <motion.button
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}

        <AddTaskModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </div>
    </div>
  );
}