'use client';

import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import { Task } from '../types/task';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onStartTask,
  onCompleteTask,
}: TaskListProps) {
  const { reorderTasks } = useTasks();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                      onStartTask={onStartTask}
                      onCompleteTask={onCompleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}