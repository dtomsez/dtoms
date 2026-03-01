import { useState } from 'react';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../types';
import { STATUS_COLUMNS, STATUS_CONFIG } from '../types';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  showAssignees?: boolean;
}

function KanbanColumn({ status, tasks, onTaskClick, showAssignees }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-0 flex-1">
      {/* Column Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-t-4 ${config.border} ${config.bg}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          <span className={`
            inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
            ${config.bg} ${config.color} border ${config.border}
          `}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`
          kanban-column flex-1 p-3 rounded-b-xl border border-t-0 ${config.border} transition-colors
          ${isOver ? 'bg-coffee-50' : 'bg-slate-50/70'}
        `}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
                showAssignees={showAssignees}
              />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-slate-400">ไม่มีงาน</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  tasks: Task[];
  showAssignees?: boolean;
}

export function KanbanBoard({ tasks, showAssignees = false }: KanbanBoardProps) {
  const { updateTaskStatus } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // handled in dragEnd for simplicity
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    // Check if dropped on a column
    if (STATUS_COLUMNS.includes(over.id as TaskStatus)) {
      const newStatus = over.id as TaskStatus;
      if (draggedTask.status !== newStatus) {
        updateTaskStatus(draggedTask.id, newStatus);
      }
      return;
    }

    // Dropped on another card — find that card's column
    const targetTask = tasks.find((t) => t.id === over.id);
    if (targetTask && targetTask.status !== draggedTask.status) {
      updateTaskStatus(draggedTask.id, targetTask.status);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {STATUS_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onTaskClick={setSelectedTask}
              showAssignees={showAssignees}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask && (
            <div className="rotate-1 scale-105 shadow-2xl">
              <TaskCard task={activeTask} showAssignees={showAssignees} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
