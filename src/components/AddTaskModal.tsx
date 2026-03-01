import { useState } from 'react';
import type { TaskStatus, TaskPriority } from '../types';
import { useTaskStore } from '../store/taskStore';

interface AddTaskModalProps {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { addTask, users } = useTaskStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeIds: [] as string[],
    status: 'ยังไม่เริ่ม' as TaskStatus,
    priority: 'กลาง' as TaskPriority,
    dueDate: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.assigneeIds.length === 0 || !form.dueDate) return;

    addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      assigneeIds: form.assigneeIds,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  const toggleAssignee = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(id)
        ? prev.assigneeIds.filter((a) => a !== id)
        : [...prev.assigneeIds, id],
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">เพิ่มงานใหม่</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">ชื่องาน *</label>
            <input
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400"
              placeholder="ระบุชื่องาน..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">รายละเอียด</label>
            <textarea
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400 resize-none"
              placeholder="รายละเอียดเพิ่มเติม..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">สถานะ</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              >
                <option>ยังไม่เริ่ม</option>
                <option>กำลังทำ</option>
                <option>เสร็จสิ้น</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">ความสำคัญ</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              >
                <option>สูง</option>
                <option>กลาง</option>
                <option>ต่ำ</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">วันครบกำหนด *</label>
            <input
              required
              type="date"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">ผู้รับผิดชอบ *</label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => {
                const isSelected = form.assigneeIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleAssignee(u.id)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                      ${isSelected
                        ? 'border-coffee-600 bg-coffee-50 text-coffee-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }
                    `}
                  >
                    <span>{u.avatar}</span>
                    <span>{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">แท็ก (คั่นด้วย ,)</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-coffee-400"
              placeholder="เช่น สต็อก, กาแฟ, หน้าร้าน"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-coffee-700 hover:bg-coffee-800 text-white transition-colors"
            >
              เพิ่มงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
