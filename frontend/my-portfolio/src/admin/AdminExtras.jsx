import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useFetch } from '../hooks/useFetch'
import { Trash2, CheckCheck } from 'lucide-react'

// ── About Me Editor ───────────────────────────────────────────────────────────
export function ManageAbout() {
  const { data, loading, refetch } = useFetch('/admin/about')
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (data) setForm(data) }, [data])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/admin/about', form)
      toast.success('About Me updated!')
      refetch()
    } catch { toast.error('Failed to save.') }
    finally { setSaving(false) }
  }

  const FIELDS = [
    { name:'name',           label:'Name',            type:'text' },
    { name:'tagline',        label:'Tagline',         type:'text' },
    { name:'bio',            label:'Bio',             type:'textarea' },
    { name:'email',          label:'Email',           type:'email' },
    { name:'phone',          label:'Phone',           type:'text' },
    { name:'college',        label:'College',         type:'text' },
    { name:'degree',         label:'Degree',          type:'text' },
    { name:'year',           label:'Year',            type:'text' },
    { name:'specialization', label:'Specialization',  type:'text' },
    { name:'github_url',     label:'GitHub URL',      type:'url' },
    { name:'linkedin_url',   label:'LinkedIn URL',    type:'url' },
    { name:'resume_url',     label:'Resume URL',      type:'text' },
    { name:'profile_photo_url', label:'Profile Photo URL', type:'text' },
  ]

  return (
    <div>
      <div className="admin-topbar">
        <span className="admin-page-title">About Me</span>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding:'8px 16px', fontSize:'0.82rem', opacity: saving ? 0.7 : 1 }}>
          <span>{saving ? 'Saving...' : '💾 Save Changes'}</span>
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}>
            {FIELDS.map(f => (
              <div key={f.name} className="input-group" style={ f.type === 'textarea' ? { gridColumn: '1 / -1' } : {} }>
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea name={f.name} value={form[f.name] || ''} onChange={handleChange} rows={5} />
                ) : (
                  <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Contact Messages ──────────────────────────────────────────────────────────
export function ManageMessages() {
  const { data, loading, refetch } = useFetch('/admin/messages')
  const [selected, setSelected] = useState(null)

  const markRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/read`)
      toast.success('Marked as read.')
      refetch()
    } catch { toast.error('Failed.') }
  }

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/admin/messages/${id}`)
      toast.success('Deleted.')
      if (selected?.id === id) setSelected(null)
      refetch()
    } catch { toast.error('Failed.') }
  }

  const msgs = data?.data || data || []

  return (
    <div>
      <div className="admin-topbar">
        <span className="admin-page-title">Contact Messages</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--text-muted)' }}>
          {msgs.filter(m => !m.is_read).length} unread
        </span>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
            {/* List */}
            <div className="admin-table-wrap">
              <div className="admin-table-header">
                <h3>{msgs.length} Messages</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {msgs.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No messages yet.</td></tr>
                  ) : msgs.map(m => (
                    <tr key={m.id} onClick={() => setSelected(m)} style={{ cursor:'pointer', background: selected?.id === m.id ? 'rgba(99,102,241,0.06)' : '' }}>
                      <td>
                        <div className="td-title">{m.sender_name}</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{m.sender_email}</div>
                      </td>
                      <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.subject}</td>
                      <td style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem' }}>
                        {new Date(m.received_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge-status ${m.is_read ? 'read' : 'unread'}`}>
                          {m.is_read ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="action-btns">
                          {!m.is_read && (
                            <button className="btn-edit" onClick={() => markRead(m.id)} title="Mark read">
                              <CheckCheck size={12} />
                            </button>
                          )}
                          <button className="btn-del" onClick={() => deleteMsg(m.id)} title="Delete">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detail pane */}
            {selected && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom:4 }}>{selected.subject}</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                      {new Date(selected.received_at).toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>×</button>
                </div>

                <div style={{
                  padding:'12px 16px', background:'var(--bg-secondary)',
                  borderRadius:8, marginBottom:16,
                  fontFamily:'var(--font-mono)', fontSize:'0.78rem',
                }}>
                  <div><span style={{ color:'var(--text-muted)' }}>From: </span><span style={{ color:'var(--accent-2)' }}>{selected.sender_name}</span></div>
                  <div><span style={{ color:'var(--text-muted)' }}>Email: </span><a href={`mailto:${selected.sender_email}`} style={{ color:'var(--accent)' }}>{selected.sender_email}</a></div>
                </div>

                <div style={{
                  padding: '16px', background:'var(--bg-secondary)',
                  borderRadius:8, fontSize:'0.88rem',
                  color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap',
                  marginBottom:20,
                }}>
                  {selected.message}
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <a
                    href={`mailto:${selected.sender_email}?subject=Re: ${selected.subject}`}
                    className="btn-primary" style={{ fontSize:'0.82rem', padding:'9px 18px' }}
                  >
                    <span>↩ Reply</span>
                  </a>
                  <button className="btn-del" onClick={() => deleteMsg(selected.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
