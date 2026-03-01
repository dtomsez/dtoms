import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { User } from '../types';

export function LoginPage() {
  const { users, login } = useTaskStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const employees = users.filter((u) => u.role === 'employee');
  const managers = users.filter((u) => u.role === 'manager');

  const handleLogin = () => {
    if (selected) login(selected);
  };

  const UserCard = ({ user }: { user: User }) => {
    const isSelected = selected === user.id;
    const isHovered = hoveredId === user.id;
    return (
      <button
        onClick={() => setSelected(user.id)}
        onMouseEnter={() => setHoveredId(user.id)}
        onMouseLeave={() => setHoveredId(null)}
        className={`
          w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
          flex items-center gap-4 group
          ${isSelected
            ? 'border-coffee-600 bg-coffee-50 shadow-md shadow-coffee-200'
            : isHovered
            ? 'border-coffee-300 bg-white shadow-sm'
            : 'border-slate-200 bg-white'
          }
        `}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: user.color + '20' }}
        >
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base truncate ${isSelected ? 'text-coffee-800' : 'text-slate-800'}`}>
            {user.name}
          </p>
          <p className={`text-sm truncate ${isSelected ? 'text-coffee-600' : 'text-slate-500'}`}>
            {user.position}
          </p>
        </div>
        <div className="flex-shrink-0">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-coffee-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-coffee-700 rounded-3xl mb-4 shadow-lg shadow-coffee-300">
            <span className="text-4xl">☕</span>
          </div>
          <h1 className="text-3xl font-bold text-coffee-900">Dtoms</h1>
          <p className="text-coffee-600 mt-1 text-sm">ระบบจัดการงานทีม</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-coffee-100 p-7 border border-coffee-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-5">เลือกผู้ใช้งาน</h2>

          {/* Employees */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">พนักงาน</p>
            <div className="space-y-2.5">
              {employees.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-slate-200" />
            </div>
          </div>

          {/* Managers */}
          <div className="mb-7">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ผู้จัดการ</p>
            <div className="space-y-2.5">
              {managers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selected}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200
              ${selected
                ? 'bg-coffee-700 hover:bg-coffee-800 text-white shadow-md shadow-coffee-300 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {selected ? `เข้าสู่ระบบ` : 'กรุณาเลือกผู้ใช้งาน'}
          </button>
        </div>

        <p className="text-center text-xs text-coffee-400 mt-6">Dtoms Team Dashboard v1.0</p>
      </div>
    </div>
  );
}
