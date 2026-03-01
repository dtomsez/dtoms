import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { PRIORITY_CONFIG } from '../types';
import { useTaskStore } from '../store/taskStore';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  showAssignees?: boolean;
}

export function TaskCard({ task, onClick, showAssignees = false }: TaskCardProps) {
  const { getUserById } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITY_CONFIG[task.priority];
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'เสร็จสิ้น';
  const dueDateLabel = formatDistanceToNow(dueDate, { addSuffix: true, locale: th });

  const assignees = task.assigneeIds
    .map((id) => getUserById(id))
    .filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer
        hover:shadow-md hover:border-coffee-300 transition-all duration-150 group
        ${isDragging ? 'opacity-40 shadow-xl border-coffee-400' : ''}
        select-none
      `}
      onClick={() => onClick?.(task)}
    >
      {/* Drag handle + Priority */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-0.5 p-1 rounded text-slate-300 hover:text-slate-500 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="6" cy="5" r="1.5" />
            <circle cx="14" cy="5" r="1.5" />
            <circle cx="6" cy="10" r="1.5" />
            <circle cx="14" cy="10" r="1.5" />
            <circle cx="6" cy="15" r="1.5" />
            <circle cx="14" cy="15" r="1.5" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{task.title}</p>
        </div>

        <span className={`
          flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
          ${priority.bg} ${priority.color}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2.5 ml-6">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5 ml-6">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-coffee-50 text-coffee-700 text-xs rounded-md border border-coffee-100">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 ml-6">
        {/* Due date */}
        <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOverdue ? 'เกินกำหนด' : dueDateLabel}
        </span>

        {/* Assignees avatars */}
        {showAssignees && assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {assignees.slice(0, 3).map((u) => u && (
              <div
                key={u.id}
                title={u.name}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs"
                style={{ backgroundColor: u.color + '30' }}
              >
                {u.avatar}
              </div>
            ))}
            {assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-medium">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
