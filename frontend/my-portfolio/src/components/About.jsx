import { useFetch } from '../hooks/useFetch'

const PLACEHOLDER = {
  name: 'Pratham Raikar',
  tagline: 'AI-DS Engineer | Developer',
  bio: 'A dedicated student passionate about technology and innovation, building real-world AI and data-driven solutions.',
  location: 'Goa / India',
  college: 'Engineering College', degree: 'B.E. AI & Data Science', year: '2022-2026', specialization: 'Artificial Intelligence',
}

const DEFAULT_SKILLS = ['Python', 'React.js', 'Machine Learning', 'Flask', 'Data Science', 'SQL', 'Git']

export default function About() {
  const { data: about, loading } = useFetch('/public/about')
  const info = about || PLACEHOLDER
  const skillsList = info.skills || DEFAULT_SKILLS

  if (loading) return (
    <section className="section" id="about">
      <div className="container"><div className="loading-center"><div className="spinner" /></div></div>
    </section>
  )

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-eyebrow">about</div>
        <h2 className="section-title">Who Am I</h2>
        <p className="section-sub">
          {info.tagline || 'A quick look at my background, focus areas, and what drives my work.'}
        </p>

        {/* About Grid with reduced photo size & 20% distance */}
        <div className="about-partition-grid">
          {/* Left Column: Compact Profile Photo + Location Tag */}
          <div className="about-col-left">
            <div className="about-photo-wrap compact-photo">
              <div className="about-photo-frame" />
              {info.profile_photo_url ? (
                <img src={info.profile_photo_url} alt={info.name} className="about-photo" />
              ) : (
                <div className="about-photo" style={{
                  background: 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', color: 'var(--accent)',
                }}>
                  <i className="fa-solid fa-user-astronaut" />
                </div>
              )}
            </div>

            <div className="about-location-box">
              <i className="fa-solid fa-location-dot" />
              <span>{info.location || 'India'}</span>
            </div>
          </div>

          {/* Right Column: Bio Text + Metadata + Skill Pills */}
          <div className="about-col-right">
            <div className="about-bio-text">
              {info.bio?.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="about-meta-inline">
              {info.college && (
                <div className="about-meta-tag"><span className="label">College:</span> {info.college}</div>
              )}
              {info.degree && (
                <div className="about-meta-tag"><span className="label">Degree:</span> {info.degree}</div>
              )}
            </div>

            <div className="about-skills-pills">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="skill-pill">
                  {typeof skill === 'string' ? skill : skill.name || `skill ${idx + 1}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
