import { useAppStore } from './store/appStore'
import LoginPage from './components/LoginPage'
import Layout from './components/Layout'
import ProfileSetup from './components/ProfileSetup'
import BaZiModule from './components/BaZiModule'
import TongShuModule from './components/TongShuModule'
import QiMenModule from './components/QiMenModule'
import SeshetaChat from './components/SeshetaChat'
import NumerologyModule from './components/NumerologyModule'

export default function App() {
  const { user, birth, module } = useAppStore()

  if (!user) return <LoginPage />

  return (
    <Layout>
      {module === 'bazi' && (birth ? <BaZiModule /> : <ProfileSetup />)}
      {module === 'tongshu' && <TongShuModule />}
      {module === 'qimen' && <QiMenModule />}
      {module === 'sesheta' && <SeshetaChat />}
      {module === 'numerology' && <NumerologyModule />}
    </Layout>
  )
}
