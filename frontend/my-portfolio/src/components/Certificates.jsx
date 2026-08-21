import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getMediaUrl } from '../utils/media'

const FILTERS = ['all', 'ai', 'language', 'internship', 'training', 'workshop', 'other']

export default function Certificates() {
  const { data: rawCerts, loading } = useFetch('/public/certificates')
  const certs = Array.isArray(rawCerts) ? rawCerts : []
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  if (loading) return (
    <section className="section" id="certificates"><div className="container"><div className="loading-center"><div className="spinner" /></div></div></section>
  )
  if (!certs.length) return (
    <section className="section" id="certificates">
      <div className="container">
        <div className="section-eyebrow">certifications</div>
        <h2 className="section-title">Certificates</h2>
        <p className="section-sub" style={{ color: 'var(--text-muted)' }}>No certificates data yet — connect the backend to populate this section.</p>
      </div>
    </section>
  )

  const filtered = filter === 'all' ? certs : certs.filter(c => c.category === filter)

  return (
    <section className="section" id="certificates">
      <div className="container">
        <div className="section-eyebrow">certifications</div>
        <h2 className="section-title">Certificates</h2>
        <p className="section-sub">Verified achievements and completed courses.</p>

        <div className="filter-row">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="certs-grid">
          {filtered.map(cert => (
            <div key={cert.id} className="cert-card" onClick={() => setLightbox(cert)}>
              {cert.image_url ? (
                <img src={getMediaUrl(cert.image_url)} alt={cert.title} className="cert-img" onError={(e) => { e.target.style.display = 'none' }} />
              ) : (
                <div className="cert-img" style={{ background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '2.2rem' }}>
                  <i className="fa-solid fa-certificate" />
                </div>
              )}
              <div className="cert-body">
                <div className="cert-title">{cert.title}</div>
                {cert.issuer && <div className="cert-issuer">{cert.issuer}</div>}
                {cert.issue_date && (
                  <div className="cert-date">{new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                )}
                <span className="tag" style={{ marginTop: 8, display: 'inline-block' }}>{cert.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><i className="fa-solid fa-xmark" /></button>
          <div onClick={e => e.stopPropagation()}>
            <img src={getMediaUrl(lightbox.image_url)} alt={lightbox.title} className="lightbox-img" />
            <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>
              {lightbox.title}
              {lightbox.issuer && <span style={{ color: 'var(--accent-2)', fontSize: '0.8rem', display: 'block', marginTop: 4 }}>{lightbox.issuer}</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
