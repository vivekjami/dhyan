'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import TaskItem from './TaskItem';
// import {  AnimatePresence } from 'framer-motion';

export default function TaskList() {
  const { tasks, reorderTasks, isLoading } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [forceRender, setForceRender] = useState(0);

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

  // Force a re-render once component is mounted
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      setForceRender(prev => prev + 1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Force re-render when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      setForceRender(prev => prev + 1);
    }
  }, [tasks.length]);

  return (
    <div className="retro-card mb-6" key={`task-list-${forceRender}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl">Task List</h3>
        <div className="flex space-x-2 text-xs">
          <button
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => {
              setFilter('all');
              setForceRender(prev => prev + 1);
            }}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => {
              setFilter('active');
              setForceRender(prev => prev + 1);
            }}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-orange-500' : 'bg-slate-700'}`}
            onClick={() => {
              setFilter('completed');
              setForceRender(prev => prev + 1);
            }}
          >
            Completed
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="task-list-container">
          {filteredTasks.length > 0 ? (
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
                <div className="space-y-2">
                  {filteredTasks.map((task) => (
                    <TaskItem key={`${task.id}-${forceRender}`} task={task} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {filter === 'all' ? "No tasks yet. Add your first task!" : 
               filter === 'active' ? "No active tasks. Great job!" : 
               "No completed tasks yet."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}