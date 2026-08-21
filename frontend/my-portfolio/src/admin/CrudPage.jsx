import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { Plus, X } from 'lucide-react'
import ImageUploadInput from './ImageUploadInput'

/**
 * Generic CRUD page.
 * Props:
 *   title        - page heading
 *   endpoint     - e.g. '/admin/projects'
 *   data         - array from useFetch
 *   loading      - bool
 *   refetch      - fn
 *   columns      - [{ label, render(row) }]
 *   fields       - [{ name, label, type, options, required, placeholder }]
 *   emptyForm    - object with default values
 *   rowKey       - field name for row id (default 'id')
 */
export default function CrudPage({
  title, endpoint, data, loading, refetch,
  columns, fields, emptyForm, rowKey = 'id'
}) {
  const [modal, setModal]   = useState(null) // null | 'create' | 'edit'
  const [form, setForm]     = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); setModal('create') }
  const openEdit   = (row) => {
    const f = {}
    fields.forEach(fi => {
      let v = row[fi.name]
      if (Array.isArray(v)) v = v.join(', ')
      if (fi.type === 'date' && v) v = v.split('T')[0]
      f[fi.name] = v ?? ''
    })
    setForm({ ...f, _id: row[rowKey] })
    setModal('edit')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const buildPayload = () => {
    const p = {}
    fields.forEach(fi => {
      let v = form[fi.name]
      if (fi.type === 'tags') v = v ? v.split(',').map(s => s.trim()).filter(Boolean) : []
      if (fi.type === 'number') v = v !== '' ? Number(v) : undefined
      if (fi.type === 'checkbox') v = !!v
      p[fi.name] = v
    })
    return p
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = buildPayload()
      if (modal === 'create') {
        await api.post(endpoint, payload)
        toast.success(`${title.replace(/s$/, '')} created!`)
      } else {
        await api.put(`${endpoint}/${form._id}`, payload)
        toast.success('Updated!')
      }
      setModal(null)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    try {
      await api.delete(`${endpoint}/${id}`)
      toast.success('Deleted.')
      refetch()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <span className="admin-page-title">{title}</span>
        <button className="btn-primary" onClick={openCreate} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          <span><Plus size={14} style={{ marginRight: 4 }} /> Add New</span>
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <h3>{data?.length || 0} {title}</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    {columns.map(c => <th key={c.label}>{c.label}</th>)}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data || []).length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                        No {title.toLowerCase()} yet. Click "Add New" to create one.
                      </td>
                    </tr>
                  ) : (data || []).map(row => (
                    <tr key={row[rowKey]}>
                      {columns.map(c => <td key={c.label}>{c.render(row)}</td>)}
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => openEdit(row)}>Edit</button>
                          <button className="btn-del"  onClick={() => handleDelete(row[rowKey])}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'create' ? `Add ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {fields.map(fi => (
                fi.type === 'image' || fi.type === 'file' ? (
                  <ImageUploadInput
                    key={fi.name}
                    name={fi.name}
                    value={form[fi.name] || ''}
                    onChange={handleChange}
                    label={fi.label + (fi.required ? ' *' : '')}
                    hint={fi.hint}
                    accept={fi.accept || (fi.type === 'file' ? 'image/*,.pdf' : 'image/*')}
                  />
                ) : (
                  <div key={fi.name} className="input-group">
                    <label>{fi.label}{fi.required ? ' *' : ''}</label>
                    {fi.type === 'textarea' ? (
                      <textarea name={fi.name} value={form[fi.name] || ''} onChange={handleChange} placeholder={fi.placeholder || ''} />
                    ) : fi.type === 'select' ? (
                      <select name={fi.name} value={form[fi.name] || ''} onChange={handleChange}>
                        <option value="">Select...</option>
                        {fi.options?.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : fi.type === 'checkbox' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexDirection: 'row' }}>
                        <input type="checkbox" name={fi.name} checked={!!form[fi.name]} onChange={handleChange} style={{ width: 'auto' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{fi.checkLabel || 'Yes'}</span>
                      </label>
                    ) : (
                      <input
                        type={fi.type || 'text'}
                        name={fi.name}
                        value={form[fi.name] || ''}
                        onChange={handleChange}
                        placeholder={fi.placeholder || ''}
                        required={fi.required}
                      />
                    )}
                    {fi.hint && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{fi.hint}</span>}
                  </div>
                )
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
