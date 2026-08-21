import { useFetch } from '../hooks/useFetch'
import { getMediaUrl } from '../utils/media'

function Stars({ count }) {
  return <span className="stars">{'★'.repeat(count)}{'☆'.repeat(Math.max(0, 5 - count))}</span>
}

export default function Platforms() {
  const { data: rawPlatforms, loading } = useFetch('/public/platforms')
  const platforms = Array.isArray(rawPlatforms) ? rawPlatforms : []

  if (loading) return (
    <section className="section" id="platforms">
      <div className="container"><div className="loading-center"><div className="spinner" /></div></div>
    </section>
  )
  if (!platforms.length) return (
    <section className="section" id="platforms">
      <div className="container">
        <div className="section-eyebrow">coding profiles</div>
        <h2 className="section-title">Tech Platforms</h2>
        <p className="section-sub" style={{ color: 'var(--text-muted)' }}>No platforms data yet — connect the backend to populate this section.</p>
      </div>
    </section>
  )

  return (
    <section className="section" id="platforms">
      <div className="container">
        <div className="section-eyebrow">competitive programming</div>
        <h2 className="section-title">Tech Platforms</h2>
        <p className="section-sub">Performance metrics across coding platforms.</p>

        <div className="platforms-grid">
          {platforms.map(p => (
            <div key={p.id} className="platform-card">
              {p.logo_url ? <img src={getMediaUrl(p.logo_url)} alt={p.name} className="platform-logo" onError={(e) => { e.target.style.display = 'none' }} /> : <div style={{ fontSize: '1.8rem', marginBottom: 14 }}>💻</div>}
              <div className="platform-name">{p.name}</div>
              <div className="platform-desc">{p.description}</div>

              <div className="platform-stats">
                {p.problems_solved && p.problems_solved !== '---' && (
                  <div className="platform-stat"><span className="key">Problems Solved</span><span className="val">{p.problems_solved}</span></div>
                )}
                {p.current_rating && p.current_rating !== '---' && (
                  <div className="platform-stat"><span className="key">Rating</span><span className="val">{p.current_rating}</span></div>
                )}
              </div>

              {p.badges?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Badges</div>
                  <div className="badge-row">
                    {p.badges.map((b, i) => (
                      b.img ? <img key={i} src={getMediaUrl(b.img)} alt={b.label} className="badge-img" title={b.label} onError={(e) => { e.target.style.display = 'none' }} /> : <span key={i} className="tag">{b.label}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.stars && Object.keys(p.stars).length > 0 && (
                <div className="stars-row" style={{ marginBottom: 16 }}>
                  {Object.entries(p.stars).map(([skill, count]) => (
                    <div key={skill} className="star-line"><span>{skill}:</span><Stars count={count} /></div>
                  ))}
                </div>
              )}

              {p.profile_url && (
                <a href={p.profile_url} target="_blank" rel="noreferrer" className="platform-btn">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> View Profile
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
