import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { KanbanBoard } from './KanbanBoard';
import { Navbar } from './Navbar';
import type { Task, TaskPriority } from '../types';
import { PRIORITY_CONFIG } from '../types';
import { isPast, parseISO } from 'date-fns';

function StatsCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export function PersonalDashboard() {
  const { currentUser, tasks } = useTaskStore();

  if (!currentUser) return null;

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeIds.includes(currentUser.id)),
    [tasks, currentUser.id]
  );

  const activeTasks = myTasks.filter((t) => t.status !== 'เสร็จสิ้น');
  const overdueTasks = activeTasks.filter((t) => isPast(parseISO(t.dueDate)));
  const highPriority = activeTasks.filter((t) => t.priority === 'สูง');

  const priorityBreakdown = (['สูง', 'กลาง', 'ต่ำ'] as TaskPriority[]).map((p) => ({
    priority: p,
    count: activeTasks.filter((t) => t.priority === p).length,
    config: PRIORITY_CONFIG[p],
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                สวัสดี, {currentUser.name}! 👋
              </h2>
              <p className="text-slate-500 text-sm">{currentUser.position}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-1 ml-1">
            คุณมีงานที่รอดำเนินการ <span className="text-coffee-700 font-semibold">{activeTasks.length}</span> งาน
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatsCard label="งานทั้งหมด" value={myTasks.length} icon="📋" color="bg-slate-100" />
          <StatsCard label="กำลังดำเนินการ" value={activeTasks.length} icon="⚡" color="bg-amber-100" />
          <StatsCard label="งานด่วน" value={highPriority.length} icon="🔥" color="bg-red-100" />
          <StatsCard label="เกินกำหนด" value={overdueTasks.length} icon="⚠️" color="bg-orange-100" />
        </div>

        {/* Priority breakdown */}
        {activeTasks.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">ความสำคัญงานที่เหลือ</p>
            <div className="flex gap-3">
              {priorityBreakdown.map(({ priority, count, config }) => (
                <div key={priority} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  <span className={`text-sm font-semibold ${config.color}`}>{count}</span>
                  <span className={`text-xs ${config.color}`}>{priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Board section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-700">
              บอร์ดงานของฉัน
            </h3>
            <p className="text-xs text-slate-400">
              แสดงเฉพาะงานที่ยังไม่เสร็จ • ลากการ์ดเพื่อเปลี่ยนสถานะ
            </p>
          </div>

          {activeTasks.length > 0 ? (
            <KanbanBoard tasks={activeTasks} showAssignees={false} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">งานเสร็จหมดแล้ว!</h3>
              <p className="text-slate-400 text-sm">ยอดเยี่ยมมาก คุณทำงานครบทุกอย่างแล้ว</p>
            </div>
          )}
        </div>

        {/* Completed tasks summary */}
        {myTasks.filter((t) => t.status === 'เสร็จสิ้น').length > 0 && (
          <CompletedTasksList tasks={myTasks.filter((t: Task) => t.status === 'เสร็จสิ้น')} />
        )}
      </main>
    </div>
  );
}

function CompletedTasksList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
        <span>✅</span>
        งานที่เสร็จสิ้นแล้ว ({tasks.length})
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 opacity-60">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-slate-600 line-through">{task.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
