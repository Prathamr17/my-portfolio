import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, FolderOpen, Award, Zap, Code2,
  Briefcase, Trophy, MessageSquare, User, LogOut, ExternalLink
} from 'lucide-react'

const NAV = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/about',        icon: User,            label: 'About Me' },
  { to: '/admin/projects',     icon: FolderOpen,      label: 'Projects' },
  { to: '/admin/certificates', icon: Award,           label: 'Certificates' },
  { to: '/admin/skills',       icon: Code2,           label: 'Skills' },
  { to: '/admin/platforms',    icon: Zap,             label: 'Platforms' },
  { to: '/admin/internships',  icon: Briefcase,       label: 'Internships' },
  { to: '/admin/achievements', icon: Trophy,          label: 'Achievements' },
  { to: '/admin/messages',     icon: MessageSquare,   label: 'Messages' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out.')
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          ⚡ Portfolio Admin
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2, fontWeight: 400 }}>
            {admin?.email}
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-link" style={{ marginBottom: 4 }}>
            <ExternalLink size={16} />
            View Portfolio
          </a>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
