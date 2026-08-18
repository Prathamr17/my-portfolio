import { useFetch } from '../hooks/useFetch'
import { FolderOpen, Award, Code2, Zap, Briefcase, Trophy, MessageSquare, Mail } from 'lucide-react'

const STAT_MAP = [
  { key: 'projects',        label: 'Projects',      icon: FolderOpen,     color: '#6366f1' },
  { key: 'certificates',    label: 'Certificates',  icon: Award,          color: '#06b6d4' },
  { key: 'skills',          label: 'Skills',        icon: Code2,          color: '#a855f7' },
  { key: 'platforms',       label: 'Platforms',     icon: Zap,            color: '#f59e0b' },
  { key: 'internships',     label: 'Internships',   icon: Briefcase,      color: '#10b981' },
  { key: 'achievements',    label: 'Achievements',  icon: Trophy,         color: '#ef4444' },
  { key: 'unread_messages', label: 'Unread Msgs',   icon: Mail,           color: '#ec4899' },
]

export default function Dashboard() {
  const { data, loading } = useFetch('/admin/dashboard')

  return (
    <div>
      <div className="admin-topbar">
        <span className="admin-page-title">Dashboard</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="admin-content">
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: 28,
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 4 }}>
            Welcome back, Pratham 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
            Manage your portfolio content from here.
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="admin-stat-grid">
            {STAT_MAP.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="admin-stat-card">
                <div className="icon" style={{ background: `${color}20`, color }}>
                  <Icon size={18} />
                </div>
                <div className="num">{data?.counts?.[key] ?? 0}</div>
                <div className="lbl">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent messages */}
        {data?.recent_messages?.length > 0 && (
          <div className="admin-table-wrap" style={{ marginTop: 8 }}>
            <div className="admin-table-header">
              <h3>Recent Messages</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_messages.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="td-title">{m.sender_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.sender_email}</div>
                    </td>
                    <td>{m.subject}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {new Date(m.received_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge-status ${m.is_read ? 'read' : 'unread'}`}>
                        {m.is_read ? '● Read' : '● New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
