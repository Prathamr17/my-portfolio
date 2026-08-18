import { useFetch } from '../hooks/useFetch'

const DEFAULT_INTERNSHIPS = [
  {
    id: 1,
    company_name: 'AI Research & Engineering Lab',
    role: 'AI / Machine Learning Intern',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    is_current: false,
    location: 'Goa / Remote',
    description: 'Developed neural network architectures for image classification and optimized pipeline latency using PyTorch and Flask.',
    tech_used: ['Python', 'PyTorch', 'Flask', 'OpenCV', 'Docker']
  },
  {
    id: 2,
    company_name: 'Tech Solutions Inc.',
    role: 'Full Stack Web Developer Intern',
    start_date: '2023-06-01',
    end_date: '2023-12-31',
    is_current: false,
    location: 'India',
    description: 'Built responsive web interfaces and REST API endpoints for data visualization dashboards.',
    tech_used: ['React.js', 'Node.js', 'PostgreSQL', 'JavaScript', 'TailwindCSS']
  }
]

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Internship() {
  const { data: rawInternships, loading } = useFetch('/public/internships')
  const internships = Array.isArray(rawInternships) && rawInternships.length > 0
    ? rawInternships
    : DEFAULT_INTERNSHIPS

  if (loading) return (
    <section className="section section-alt" id="experience">
      <div className="container"><div className="loading-center"><div className="spinner" /></div></div>
    </section>
  )

  return (
    <section className="section section-alt" id="experience">
      <div className="container">
        <div className="section-eyebrow">experience</div>
        <h2 className="section-title">Experience &amp; Internships</h2>
        <p className="section-sub">Professional roles, technical impact, and key contributions.</p>

        <div className="timeline">
          {internships.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-company">{item.company_name}</div>
                <div className="timeline-role">{item.role}</div>
                <div className="timeline-period">
                  <i className="fa-regular fa-calendar" style={{ marginRight: 6 }} />
                  {formatDate(item.start_date)} — {item.is_current ? 'Present' : formatDate(item.end_date)}
                  {item.is_current && <span className="current-badge" style={{ marginLeft: 8 }}>Current</span>}
                  {item.location && (<><i className="fa-solid fa-location-dot" style={{ marginLeft: 12, marginRight: 4 }} />{item.location}</>)}
                </div>
                {item.description && <div className="timeline-desc" style={{ marginTop: 10 }}>{item.description}</div>}
                {item.tech_used?.length > 0 && (
                  <div className="timeline-tech" style={{ marginTop: 12 }}>
                    {item.tech_used.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
