import { Routes, Route } from 'react-router-dom'
import { useHub } from '@sms-hub/ui'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Verify } from './pages/Verify'
import { Campaigns } from './pages/Campaigns'
import { Messages } from './pages/Messages'
import { Settings } from './pages/Settings'
import { Layout } from './components/Layout'

function App() {
  useHub() // Initialize hub context

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App