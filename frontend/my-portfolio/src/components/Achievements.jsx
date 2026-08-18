import { useFetch } from '../hooks/useFetch'

export default function Achievements() {
  const { data: rawAchievements, loading } = useFetch('/public/achievements')
  const achievements = Array.isArray(rawAchievements) ? rawAchievements : []

  if (loading) return (
    <section className="section"><div className="container"><div className="loading-center"><div className="spinner" /></div></div></section>
  )
  if (!achievements.length) return (
    <section className="section" id="achievements">
      <div className="container">
        <div className="section-eyebrow">achievements</div>
        <h2 className="section-title">Key Metrics</h2>
        <p className="section-sub" style={{ color: 'var(--text-muted)' }}>No achievements data yet — connect the backend to populate this section.</p>
      </div>
    </section>
  )

  return (
    <section className="section" id="achievements">
      <div className="container">
        <div className="section-eyebrow">highlights</div>
        <h2 className="section-title">Key Metrics</h2>
        <p className="section-sub">Quantified impact and milestones.</p>

        <div className="achievements-grid">
          {achievements.map(a => (
            <div key={a.id} className="achievement-card">
              <div className="achievement-icon"><i className={a.icon || 'fa-solid fa-star'} /></div>
              {a.metric_value && <span className="achievement-value">{a.metric_value}</span>}
              {a.metric_label && <div className="achievement-label">{a.metric_label}</div>}
              <div className="achievement-title">{a.title}</div>
              {a.description && <div className="achievement-desc">{a.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
