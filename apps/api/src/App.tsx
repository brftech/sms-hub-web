import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SuperadminLogin from './pages/SuperadminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SuperadminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/superadmins" element={<div>Superadmin Management - Coming Soon</div>} />
      <Route path="/users" element={<div>User Management - Coming Soon</div>} />
      <Route path="/companies" element={<div>Company Management - Coming Soon</div>} />
      <Route path="/campaigns" element={<div>Campaign Management - Coming Soon</div>} />
      <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
      <Route path="/settings" element={<div>System Settings - Coming Soon</div>} />
    </Routes>
  )
}

export default App
