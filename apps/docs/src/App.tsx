import { Routes, Route } from 'react-router-dom'
import { useHub } from '@sms-hub/ui'
import { Home } from './pages/Home'
import { GettingStarted } from './pages/GettingStarted'
import { APIReference } from './pages/APIReference'
import { Guides } from './pages/Guides'
import { SDKs } from './pages/SDKs'
import { Layout } from './components/Layout'

function App() {
  const { hubConfig } = useHub()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="api" element={<APIReference />} />
          <Route path="guides" element={<Guides />} />
          <Route path="sdks" element={<SDKs />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App