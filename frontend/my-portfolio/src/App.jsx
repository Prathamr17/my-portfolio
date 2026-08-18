import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Component } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import AchievementsPage from './pages/AchievementsPage'

// Admin pages
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import {
  ManageProjects, ManageCertificates, ManageSkills,
  ManagePlatforms, ManageInternships, ManageAchievements,
} from './admin/ManagePages'
import { ManageAbout, ManageMessages } from './admin/AdminExtras'

// Error boundary to prevent one broken section from blanking the page
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <div style={{ color: 'var(--accent)', marginBottom: 8 }}>⚠ Component Error</div>
        <div>{this.state.error?.message}</div>
      </div>
    )
    return this.props.children
  }
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1528',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.8rem',
          },
          success: { iconTheme: { primary: '#06b6d4', secondary: '#0d1528' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0d1528' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"            element={<ErrorBoundary><Home /></ErrorBoundary>} />
        <Route path="/achievements" element={<ErrorBoundary><AchievementsPage /></ErrorBoundary>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"              element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"    element={<Dashboard />} />
            <Route path="/admin/about"        element={<ManageAbout />} />
            <Route path="/admin/projects"     element={<ManageProjects />} />
            <Route path="/admin/certificates" element={<ManageCertificates />} />
            <Route path="/admin/skills"       element={<ManageSkills />} />
            <Route path="/admin/platforms"    element={<ManagePlatforms />} />
            <Route path="/admin/internships"  element={<ManageInternships />} />
            <Route path="/admin/achievements" element={<ManageAchievements />} />
            <Route path="/admin/messages"     element={<ManageMessages />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, background:'var(--bg-primary)' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'4rem', color:'var(--accent)' }}>404</div>
            <div style={{ fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>Page not found</div>
            <a href="/" style={{ color:'var(--accent-2)', fontFamily:'var(--font-mono)', fontSize:'0.85rem' }}>← go home</a>
          </div>
        } />
      </Routes>
    </AuthProvider>
  )
}
