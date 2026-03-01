import { useTaskStore } from '../store/taskStore';

export function Navbar() {
  const { currentUser, logout } = useTaskStore();

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-coffee-700 rounded-xl flex items-center justify-center text-lg">
          ☕
        </div>
        <div>
          <h1 className="text-base font-bold text-coffee-900 leading-none">Dtoms</h1>
          <p className="text-xs text-coffee-500 leading-none mt-0.5">ระบบจัดการงานทีม</p>
        </div>
      </div>

      {/* Current user & role badge */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-base">{currentUser.avatar}</span>
          <div>
            <p className="text-xs font-semibold text-slate-700 leading-none">{currentUser.name}</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">{currentUser.position}</p>
          </div>
          {currentUser.role === 'manager' && (
            <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-md font-medium">
              Manager
            </span>
          )}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </nav>
  );
}
