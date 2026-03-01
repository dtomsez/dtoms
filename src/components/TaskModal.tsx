import { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../types';
import { useTaskStore } from '../store/taskStore';
import { format, parseISO } from 'date-fns';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  mode?: 'view' | 'edit';
}

export function TaskModal({ task, onClose, mode = 'view' }: TaskModalProps) {
  const { updateTask, deleteTask, users, currentUser } = useTaskStore();
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [form, setForm] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) setForm({ ...task });
  }, [task]);

  if (!task) return null;

  const isManager = currentUser?.role === 'manager';
  const statusConfig = STATUS_CONFIG[task.status];

  const handleSave = () => {
    if (form && task) {
      updateTask(task.id, form);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('ต้องการลบงานนี้หรือไม่?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const assignees = task.assigneeIds
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex-1 min-w-0 pr-4">
            {isEditing ? (
              <input
                className="w-full text-lg font-bold text-slate-800 border-b-2 border-coffee-400 pb-1 outline-none bg-transparent"
                value={form.title ?? ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            ) : (
              <h2 className="text-lg font-bold text-slate-800 leading-snug">{task.title}</h2>
            )}
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">รายละเอียด</label>
            {isEditing ? (
              <textarea
                rows={3}
                className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-3 outline-none focus:border-coffee-400 resize-none"
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{task.description || 'ไม่มีรายละเอียด'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">สถานะ</label>
              {isEditing ? (
                <select
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-coffee-400"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                >
                  {(['ยังไม่เริ่ม', 'กำลังทำ', 'เสร็จสิ้น'] as TaskStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {task.status}
                </span>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">ความสำคัญ</label>
              {isEditing ? (
                <select
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-coffee-400"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                >
                  {(['สูง', 'กลาง', 'ต่ำ'] as TaskPriority[]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${PRIORITY_CONFIG[task.priority].bg} ${PRIORITY_CONFIG[task.priority].color}`}>
                  <span className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[task.priority].dot}`} />
                  {task.priority}
                </span>
              )}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">วันครบกำหนด</label>
            {isEditing ? (
              <input
                type="date"
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-coffee-400"
                value={form.dueDate ?? ''}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            ) : (
              <p className="text-sm text-slate-700">{format(parseISO(task.dueDate), 'd MMMM yyyy')}</p>
            )}
          </div>

          {/* Assignees */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">ผู้รับผิดชอบ</label>
            <div className="flex flex-wrap gap-2">
              {assignees.map((u) => u && (
                <div
                  key={u.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: u.color + '15', borderColor: u.color + '40', color: u.color }}
                >
                  <span>{u.avatar}</span>
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">แท็ก</label>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-coffee-50 text-coffee-700 text-xs rounded-lg border border-coffee-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          {isManager && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              ลบงาน
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-coffee-700 hover:bg-coffee-800 text-white transition-colors"
                >
                  บันทึก
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-coffee-700 hover:bg-coffee-800 text-white transition-colors"
              >
                แก้ไข
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
