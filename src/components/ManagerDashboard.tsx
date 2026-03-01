import { useState, useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { KanbanBoard } from './KanbanBoard';
import { Navbar } from './Navbar';
import { AddTaskModal } from './AddTaskModal';
import type { Task, User, TaskStatus } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../types';
import { isPast, parseISO, format } from 'date-fns';

type ViewMode = 'board' | 'list';
type FilterMode = 'all' | string; // 'all' or user id

function TeamMemberCard({
  user,
  tasks,
  isSelected,
  onClick,
}: {
  user: User;
  tasks: Task[];
  isSelected: boolean;
  onClick: () => void;
}) {
  const activeTasks = tasks.filter((t) => t.status !== 'เสร็จสิ้น');
  const done = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-2xl border-2 transition-all duration-150
        ${isSelected
          ? 'border-coffee-500 bg-coffee-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: user.color + '20' }}
        >
          {user.avatar}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-coffee-800' : 'text-slate-800'}`}>
            {user.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{user.position}</p>
        </div>
        {user.role === 'manager' && (
          <span className="ml-auto flex-shrink-0 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
            MGR
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>{activeTasks.length} งานที่เหลือ</span>
        <span className="font-semibold" style={{ color: user.color }}>{progress}%</span>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: user.color }}
        />
      </div>
    </button>
  );
}

function TaskListRow({ task, users }: { task: Task; users: User[] }) {
  const assignees = task.assigneeIds.map((id) => users.find((u) => u.id === id)).filter(Boolean);
  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isOverdue = isPast(parseISO(task.dueDate)) && task.status !== 'เสร็จสิ้น';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        {task.description && (
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{task.description}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex -space-x-1">
          {assignees.map((u) => u && (
            <div
              key={u.id}
              title={u.name}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-sm"
              style={{ backgroundColor: u.color + '25' }}
            >
              {u.avatar}
            </div>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
          {task.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
          {task.priority}
        </span>
      </td>
      <td className={`px-4 py-3 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
        {format(parseISO(task.dueDate), 'd MMM yy')}
        {isOverdue && <span className="ml-1 text-red-500">⚠</span>}
      </td>
    </tr>
  );
}

export function ManagerDashboard() {
  const { currentUser, tasks, users } = useTaskStore();
  const [filter, setFilter] = useState<FilterMode>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showAddTask, setShowAddTask] = useState(false);

  if (!currentUser) return null;

  const allUsers = users;

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.assigneeIds.includes(filter));
  }, [tasks, filter]);

  const totalActive = tasks.filter((t) => t.status !== 'เสร็จสิ้น').length;
  const totalDone = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const overdue = tasks.filter((t) => isPast(parseISO(t.dueDate)) && t.status !== 'เสร็จสิ้น').length;

  const statusCounts: Record<TaskStatus, number> = {
    'ยังไม่เริ่ม': tasks.filter((t) => t.status === 'ยังไม่เริ่ม').length,
    'กำลังทำ': tasks.filter((t) => t.status === 'กำลังทำ').length,
    'เสร็จสิ้น': totalDone,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Manager Dashboard</h2>
            <p className="text-slate-400 text-sm mt-0.5">ภาพรวมงานทีม • อัปเดตแบบ Real-time</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มงาน
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'งานทั้งหมด', value: tasks.length, icon: '📋', bg: 'bg-slate-100' },
            { label: 'กำลังดำเนินการ', value: totalActive, icon: '⚡', bg: 'bg-amber-100' },
            { label: 'เสร็จสิ้น', value: totalDone, icon: '✅', bg: 'bg-green-100' },
            { label: 'เกินกำหนด', value: overdue, icon: '⚠️', bg: 'bg-red-100' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Status distribution bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">การกระจายสถานะ</p>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {tasks.length > 0 && (
              <>
                <div className="bg-slate-300 rounded-l-full" style={{ width: `${(statusCounts['ยังไม่เริ่ม'] / tasks.length) * 100}%` }} title="ยังไม่เริ่ม" />
                <div className="bg-amber-400" style={{ width: `${(statusCounts['กำลังทำ'] / tasks.length) * 100}%` }} title="กำลังทำ" />
                <div className="bg-green-400 rounded-r-full" style={{ width: `${(statusCounts['เสร็จสิ้น'] / tasks.length) * 100}%` }} title="เสร็จสิ้น" />
              </>
            )}
          </div>
          <div className="flex gap-4 mt-2.5">
            {[
              { label: 'ยังไม่เริ่ม', value: statusCounts['ยังไม่เริ่ม'], color: 'bg-slate-300' },
              { label: 'กำลังทำ', value: statusCounts['กำลังทำ'], color: 'bg-amber-400' },
              { label: 'เสร็จสิ้น', value: statusCounts['เสร็จสิ้น'], color: 'bg-green-400' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
                {s.label} ({s.value})
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Team sidebar */}
          <div className="w-56 flex-shrink-0 hidden lg:block">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">ทีมงาน</h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-coffee-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                ทีมทั้งหมด ({tasks.length})
              </button>
              {allUsers.map((user) => (
                <TeamMemberCard
                  key={user.id}
                  user={user}
                  tasks={tasks.filter((t) => t.assigneeIds.includes(user.id))}
                  isSelected={filter === user.id}
                  onClick={() => setFilter(filter === user.id ? 'all' : user.id)}
                />
              ))}
            </div>
          </div>

          {/* Main board area */}
          <div className="flex-1 min-w-0">
            {/* View toggles */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {/* Mobile team filter */}
                <select
                  className="lg:hidden text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">ทีมทั้งหมด</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                <h3 className="text-sm font-semibold text-slate-700 hidden lg:block">
                  {filter === 'all'
                    ? `งานทั้งหมด (${filteredTasks.length})`
                    : `งานของ ${allUsers.find((u) => u.id === filter)?.name} (${filteredTasks.length})`
                  }
                </h3>
              </div>

              <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'board' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                    </svg>
                    Board
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                  </span>
                </button>
              </div>
            </div>

            {viewMode === 'board' ? (
              <KanbanBoard tasks={filteredTasks} showAssignees={true} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่องาน</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ผู้รับผิดชอบ</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ความสำคัญ</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">กำหนด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">
                          ไม่มีงานในขณะนี้
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <TaskListRow key={task.id} task={task} users={users} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} />}
    </div>
  );
}
