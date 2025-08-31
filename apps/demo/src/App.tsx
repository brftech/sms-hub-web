import { Routes, Route } from 'react-router-dom'
import { useHub } from '@sms-hub/ui'
import { Home } from './pages/Home'
import { Features } from './pages/Features'
import { Pricing } from './pages/Pricing'
import { Contact } from './pages/Contact'
import { Layout } from './components/Layout'

function App() {
  const { hubConfig } = useHub()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App