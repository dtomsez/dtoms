import { useTaskStore } from './store/taskStore';
import { LoginPage } from './components/LoginPage';
import { PersonalDashboard } from './components/PersonalDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';

function App() {
  const { currentUser } = useTaskStore();

  if (!currentUser) return <LoginPage />;
  if (currentUser.role === 'manager') return <ManagerDashboard />;
  return <PersonalDashboard />;
}

export default App;
