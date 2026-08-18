// ── All Admin CRUD pages ──────────────────────────────────────────────────────
import { useFetch } from '../hooks/useFetch'
import CrudPage from './CrudPage'

// ── Projects ──────────────────────────────────────────────────────────────────
export function ManageProjects() {
  const { data, loading, refetch } = useFetch('/admin/projects')
  return (
    <CrudPage
      title="Projects"
      endpoint="/admin/projects"
      data={data} loading={loading} refetch={refetch}
      columns={[
        { label: 'Title',    render: r => <span className="td-title">{r.title}</span> },
        { label: 'Tags',     render: r => <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>{r.tech_tags?.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}</div> },
        { label: 'Featured', render: r => r.is_featured ? '⭐ Yes' : 'No' },
        { label: 'GitHub',   render: r => r.github_url ? <a href={r.github_url} target="_blank" rel="noreferrer" style={{color:'var(--accent-2)',fontSize:'0.8rem'}}>Link</a> : '—' },
      ]}
      fields={[
        { name: 'title',         label: 'Title',             required: true,  placeholder: 'Project name' },
        { name: 'description',   label: 'Description',       type: 'textarea', placeholder: 'What does this project do?' },
        { name: 'tech_tags',     label: 'Tech Tags',         type: 'tags',    placeholder: 'Python, Flask, MySQL', hint: 'Comma-separated values' },
        { name: 'github_url',    label: 'GitHub URL',        placeholder: 'https://github.com/...' },
        { name: 'live_url',      label: 'Live URL',          placeholder: 'https://...' },
        { name: 'thumbnail_url', label: 'Thumbnail URL',     placeholder: '/uploads/image.png' },
        { name: 'is_featured',   label: 'Featured',          type: 'checkbox', checkLabel: 'Show as featured project' },
        { name: 'order_index',   label: 'Order',             type: 'number',  placeholder: '0' },
      ]}
      emptyForm={{ title:'', description:'', tech_tags:'', github_url:'', live_url:'', thumbnail_url:'', is_featured: false, order_index: 0 }}
    />
  )
}

// ── Certificates ──────────────────────────────────────────────────────────────
export function ManageCertificates() {
  const { data, loading, refetch } = useFetch('/admin/certificates')
  return (
    <CrudPage
      title="Certificates"
      endpoint="/admin/certificates"
      data={data} loading={loading} refetch={refetch}
      columns={[
        { label: 'Title',    render: r => <span className="td-title">{r.title}</span> },
        { label: 'Issuer',   render: r => r.issuer || '—' },
        { label: 'Category', render: r => <span className="tag">{r.category}</span> },
        { label: 'Date',     render: r => r.issue_date ? new Date(r.issue_date).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '—' },
        { label: 'Image',    render: r => r.image_url ? <img src={r.image_url} alt="" style={{height:32,borderRadius:4}} /> : '—' },
      ]}
      fields={[
        { name: 'title',          label: 'Title',          required: true, placeholder: 'Certificate name' },
        { name: 'issuer',         label: 'Issuer',         placeholder: 'Organization name' },
        { name: 'issue_date',     label: 'Issue Date',     type: 'date' },
        { name: 'category',       label: 'Category',       type: 'select', options: [
          {value:'ai',label:'AI'},{value:'language',label:'Language'},
          {value:'internship',label:'Internship'},{value:'training',label:'Training'},
          {value:'workshop',label:'Workshop'},{value:'other',label:'Other'},
        ]},
        { name: 'image_url',      label: 'Image URL',      placeholder: '/uploads/certs/cert.png', hint: 'Upload via admin upload, then paste path here' },
        { name: 'credential_url', label: 'Credential URL', placeholder: 'https://...' },
      ]}
      emptyForm={{ title:'', issuer:'', issue_date:'', category:'other', image_url:'', credential_url:'' }}
    />
  )
}

// ── Skills ────────────────────────────────────────────────────────────────────
export function ManageSkills() {
  const { data, loading, refetch } = useFetch('/admin/skills')
  // Flatten categories → skills for table
  const flatSkills = (data || []).flatMap(cat =>
    (cat.skills || []).map(s => ({ ...s, category_name: cat.name }))
  )
  const catOptions = (data || []).map(c => ({ value: c.id, label: c.name }))

  return (
    <CrudPage
      title="Skills"
      endpoint="/admin/skills"
      data={flatSkills} loading={loading} refetch={refetch}
      columns={[
        { label: 'Name',       render: r => <span className="td-title">{r.name}</span> },
        { label: 'Category',   render: r => r.category_name || '—' },
        { label: 'Proficiency',render: r => (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:80, height:6, background:'rgba(255,255,255,0.05)', borderRadius:3 }}>
              <div style={{ width:`${r.proficiency}%`, height:'100%', background:'linear-gradient(90deg,var(--accent),var(--accent-2))', borderRadius:3 }} />
            </div>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--text-muted)' }}>{r.proficiency}%</span>
          </div>
        )},
      ]}
      fields={[
        { name: 'name',        label: 'Skill Name',   required: true, placeholder: 'Python' },
        { name: 'icon',        label: 'Icon Class',   placeholder: 'devicon-python-plain colored' },
        { name: 'category_id', label: 'Category',     type: 'select', options: catOptions },
        { name: 'proficiency', label: 'Proficiency %',type: 'number', placeholder: '85' },
        { name: 'order_index', label: 'Order',        type: 'number', placeholder: '0' },
      ]}
      emptyForm={{ name:'', icon:'', category_id:'', proficiency:70, order_index:0 }}
    />
  )
}

// ── Platforms ─────────────────────────────────────────────────────────────────
export function ManagePlatforms() {
  const { data, loading, refetch } = useFetch('/admin/platforms')
  return (
    <CrudPage
      title="Platforms"
      endpoint="/admin/platforms"
      data={data} loading={loading} refetch={refetch}
      columns={[
        { label: 'Name',           render: r => <span className="td-title">{r.name}</span> },
        { label: 'Problems Solved',render: r => r.problems_solved || '—' },
        { label: 'Rating',         render: r => r.current_rating || '—' },
        { label: 'Profile',        render: r => r.profile_url ? <a href={r.profile_url} target="_blank" rel="noreferrer" style={{color:'var(--accent-2)',fontSize:'0.8rem'}}>Link</a> : '—' },
      ]}
      fields={[
        { name: 'name',            label: 'Platform Name',  required: true, placeholder: 'LeetCode' },
        { name: 'description',     label: 'Description',    type:'textarea', placeholder: 'Platform description' },
        { name: 'logo_url',        label: 'Logo URL',       placeholder: '/uploads/leetcode.png' },
        { name: 'profile_url',     label: 'Profile URL',    placeholder: 'https://leetcode.com/u/...' },
        { name: 'problems_solved', label: 'Problems Solved',placeholder: '130+' },
        { name: 'current_rating',  label: 'Current Rating', placeholder: '1540 or ---' },
        { name: 'order_index',     label: 'Order',          type: 'number', placeholder: '0' },
      ]}
      emptyForm={{ name:'', description:'', logo_url:'', profile_url:'', problems_solved:'', current_rating:'', order_index:0 }}
    />
  )
}

// ── Internships ───────────────────────────────────────────────────────────────
export function ManageInternships() {
  const { data, loading, refetch } = useFetch('/admin/internships')
  return (
    <CrudPage
      title="Internships"
      endpoint="/admin/internships"
      data={data} loading={loading} refetch={refetch}
      columns={[
        { label: 'Company', render: r => <span className="td-title">{r.company_name}</span> },
        { label: 'Role',    render: r => r.role },
        { label: 'Period',  render: r => {
          const s = r.start_date ? new Date(r.start_date).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : ''
          const e = r.is_current ? 'Present' : (r.end_date ? new Date(r.end_date).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '')
          return `${s} — ${e}`
        }},
        { label: 'Current', render: r => r.is_current ? <span className="badge-status unread">Current</span> : <span className="badge-status read">Completed</span> },
      ]}
      fields={[
        { name: 'company_name',    label: 'Company Name',  required: true, placeholder: 'Cohart' },
        { name: 'role',            label: 'Role',          required: true, placeholder: 'AI-ML Intern' },
        { name: 'start_date',      label: 'Start Date',    type: 'date' },
        { name: 'end_date',        label: 'End Date',      type: 'date', hint: 'Leave blank if current' },
        { name: 'is_current',      label: 'Currently Here',type: 'checkbox', checkLabel: 'Yes, this is my current role' },
        { name: 'description',     label: 'Description',   type: 'textarea', placeholder: 'What you did...' },
        { name: 'tech_used',       label: 'Tech Used',     type: 'tags', placeholder: 'Python, AI, Flask', hint: 'Comma-separated' },
        { name: 'location',        label: 'Location',      placeholder: 'Remote / Mumbai' },
        { name: 'order_index',     label: 'Order',         type: 'number', placeholder: '0' },
      ]}
      emptyForm={{ company_name:'', role:'', start_date:'', end_date:'', is_current:false, description:'', tech_used:'', location:'', order_index:0 }}
    />
  )
}

// ── Achievements ──────────────────────────────────────────────────────────────
export function ManageAchievements() {
  const { data, loading, refetch } = useFetch('/admin/achievements')
  return (
    <CrudPage
      title="Achievements"
      endpoint="/admin/achievements"
      data={data} loading={loading} refetch={refetch}
      columns={[
        { label: 'Title',  render: r => <span className="td-title">{r.title}</span> },
        { label: 'Value',  render: r => <span style={{ color:'var(--accent-2)', fontFamily:'var(--font-mono)', fontWeight:700 }}>{r.metric_value}</span> },
        { label: 'Label',  render: r => r.metric_label || '—' },
        { label: 'Icon',   render: r => r.icon ? <i className={r.icon} style={{ color:'var(--accent)' }} /> : '—' },
      ]}
      fields={[
        { name: 'title',        label: 'Title',        required: true, placeholder: 'LeetCode Problems Solved' },
        { name: 'description',  label: 'Description',  type: 'textarea', placeholder: 'Short description...' },
        { name: 'icon',         label: 'Icon Class',   placeholder: 'fa-solid fa-code' },
        { name: 'metric_value', label: 'Metric Value', placeholder: '130+' },
        { name: 'metric_label', label: 'Metric Label', placeholder: 'Problems Solved' },
        { name: 'order_index',  label: 'Order',        type: 'number', placeholder: '0' },
      ]}
      emptyForm={{ title:'', description:'', icon:'', metric_value:'', metric_label:'', order_index:0 }}
    />
  )
}
