import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useProgressStore } from './store/progressStore'
import { warmUpVoices } from './lib/speech'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import LearnPath from './pages/LearnPath'
import UnitLesson from './pages/UnitLesson'
import ReviewSession from './pages/ReviewSession'
import Practice from './pages/Practice'
import Speaking from './pages/Speaking'
import Writing from './pages/Writing'
import Reading from './pages/Reading'
import Profile from './pages/Profile'

export default function App() {
  const { status, init } = useAuthStore()
  const pullFromServer = useProgressStore((s) => s.pullFromServer)

  useEffect(() => {
    warmUpVoices()
    void init()
  }, [init])

  useEffect(() => {
    if (status === 'authed') void pullFromServer()
  }, [status, pullFromServer])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">🌏</div>
          กำลังโหลด...
        </div>
      </div>
    )
  }

  if (status === 'signedout') {
    return <LoginPage />
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Navigate to="/learn/en" replace />} />
          <Route path="/learn/:lang" element={<LearnPath />} />
          <Route path="/lesson/:unitId" element={<UnitLesson />} />
          <Route path="/review" element={<ReviewSession />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/speaking/:lang" element={<Speaking />} />
          <Route path="/writing/:lang" element={<Writing />} />
          <Route path="/reading/:lang" element={<Reading />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
