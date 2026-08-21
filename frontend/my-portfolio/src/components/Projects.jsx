import { useState, useEffect, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getMediaUrl } from '../utils/media'

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'AI Medical Imaging Classifier',
    description: 'Deep learning framework for accurate medical anomaly detection and diagnostic support using CNN architectures.',
    tech_tags: ['Python', 'PyTorch', 'Flask', 'React.js'],
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    github_url: 'https://github.com',
    live_url: 'https://example.com'
  },
  {
    id: 2,
    title: 'Autonomous Drone Navigation',
    description: 'Computer vision and spatial SLAM algorithms for real-time indoor obstacle avoidance.',
    tech_tags: ['Python', 'OpenCV', 'ROS', 'C++'],
    thumbnail_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop',
    github_url: 'https://github.com',
    live_url: 'https://example.com'
  },
  {
    id: 3,
    title: 'Smart Portfolio Dashboard',
    description: 'Fullstack web application built with modern reactive state management and custom telemetry analytics.',
    tech_tags: ['React.js', 'Vite', 'Node.js', 'PostgreSQL'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    github_url: 'https://github.com',
    live_url: 'https://example.com'
  },
  {
    id: 4,
    title: 'NLP Sentiment Intelligence',
    description: 'Transformer based model for multi-lingual text classification and market trend forecasting.',
    tech_tags: ['Python', 'HuggingFace', 'FastAPI', 'Docker'],
    thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    github_url: 'https://github.com',
    live_url: 'https://example.com'
  }
]

export default function Projects() {
  const { data: rawProjects } = useFetch('/public/projects')
  const projects = Array.isArray(rawProjects) && rawProjects.length > 0 ? rawProjects : DEFAULT_PROJECTS
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)
  const [showAllModal, setShowAllModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleNextHero = (e) => {
    e.stopPropagation()
    setActiveHeroIndex((prev) => (prev + 1) % projects.length)
  }

  const handlePrevHero = (e) => {
    e.stopPropagation()
    setActiveHeroIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const heroProject = projects[activeHeroIndex] || projects[0]
  const secondaryProjects = projects.filter((_, idx) => idx !== activeHeroIndex)

  return (
    <>
      <section className={`section ${isVisible ? 'reveal-in' : ''}`} id="projects" ref={sectionRef}>
        <div className="container">
          <div className="section-eyebrow">projects</div>
          <h2 className="section-title">Projects</h2>
          <p className="section-sub">
            Showcase of my featured projects and key technical work.
          </p>

          {/* Wireframe 2 Layout: Left Hero Card + Right Top Stacked Cards + Bottom Row Cards */}
          <div className="projects-wireframe-grid">
            {/* Left Hero Card */}
            {heroProject && (
              <div className="projects-hero-card card" onClick={() => setSelectedProject(heroProject)}>
                <div className="project-95-img-container">
                  {heroProject.thumbnail_url ? (
                    <img src={getMediaUrl(heroProject.thumbnail_url)} alt={heroProject.title} className="project-95-img" />
                  ) : (
                    <div className="wireframe-cross-placeholder">
                      <div className="cross-line-1" />
                      <div className="cross-line-2" />
                      <i className="fa-solid fa-laptop-code placeholder-icon" />
                    </div>
                  )}

                  {/* Blur Hover Overlay */}
                  <div className="project-blur-hover-overlay">
                    <h3 className="hover-title">{heroProject.title}</h3>
                    <p className="hover-desc">{heroProject.description}</p>
                    <div className="hover-tags">
                      {heroProject.tech_tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="skill-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="projects-hero-footer" onClick={e => e.stopPropagation()}>
                  <button className="slider-arrow-btn" onClick={handlePrevHero} title="Previous project">
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <span className="hero-label">{heroProject.title}</span>
                  <button className="slider-arrow-btn" onClick={handleNextHero} title="Next project">
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </div>
              </div>
            )}

            {/* Right Top Column: Stacked Cards */}
            <div className="projects-stacked-col">
              <div className="stacked-cards-top-row">
                {secondaryProjects.slice(0, 2).map((p) => (
                  <div
                    key={p.id}
                    className="project-stacked-card card"
                    onClick={() => setSelectedProject(p)}
                  >
                    <div className="project-95-img-container">
                      {p.thumbnail_url ? (
                        <img src={getMediaUrl(p.thumbnail_url)} alt={p.title} className="project-95-img" />
                      ) : (
                        <div className="wireframe-cross-placeholder">
                          <div className="cross-line-1" />
                          <div className="cross-line-2" />
                        </div>
                      )}

                      <div className="project-blur-hover-overlay">
                        <h4 className="hover-title">{p.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Smaller Cards + "+more" Box */}
          <div className="projects-bottom-row">
            {secondaryProjects.slice(2, 4).map(p => (
              <div key={p.id} className="project-bottom-card card" onClick={() => setSelectedProject(p)}>
                <div className="project-95-img-container">
                  {p.thumbnail_url ? (
                    <img src={getMediaUrl(p.thumbnail_url)} alt={p.title} className="project-95-img" />
                  ) : (
                    <div className="wireframe-cross-placeholder">
                      <div className="cross-line-1" />
                      <div className="cross-line-2" />
                    </div>
                  )}

                  <div className="project-blur-hover-overlay">
                    <h4 className="hover-title">{p.title}</h4>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="project-more-box card"
              onClick={() => setShowAllModal(true)}
            >
              <span className="plus-more-text">+more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wireframe Detail Modal Window (`portfolio/projects`) */}
      {(selectedProject || showAllModal) && (
        <div className="modal-overlay" onClick={() => { setSelectedProject(null); setShowAllModal(false); }}>
          <div className="wireframe-modal-window" onClick={e => e.stopPropagation()}>
            <div className="window-header">
              <span className="window-title">portfolio/projects</span>
              <div className="window-controls">
                <span className="win-btn win-min" onClick={() => { setSelectedProject(null); setShowAllModal(false); }}>—</span>
                <span className="win-btn win-max">□</span>
                <span className="win-btn win-close" onClick={() => { setSelectedProject(null); setShowAllModal(false); }}>✕</span>
              </div>
            </div>

            <div className="wireframe-modal-body">
              {selectedProject ? (
                <div className="wireframe-project-detail-card">
                  <div className="detail-img-col">
                    {selectedProject.thumbnail_url ? (
                      <img src={getMediaUrl(selectedProject.thumbnail_url)} alt={selectedProject.title} />
                    ) : (
                      <div className="wireframe-cross-placeholder modal-placeholder">
                        <div className="cross-line-1" />
                        <div className="cross-line-2" />
                        <i className="fa-solid fa-code" />
                      </div>
                    )}
                  </div>

                  <div className="detail-info-col">
                    <h3 className="detail-title">{selectedProject.title}</h3>
                    <p className="detail-desc">{selectedProject.description}</p>

                    <div className="detail-skills-row">
                      {selectedProject.tech_tags?.map((tag, i) => (
                        <span key={i} className="skill-pill">{tag}</span>
                      ))}
                    </div>

                    <div className="detail-btn-row">
                      {selectedProject.live_url && (
                        <button
                          type="button"
                          onClick={() => window.open(selectedProject.live_url, '_blank', 'noopener,noreferrer')}
                          className="btn-wireframe"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 6 }} /> Demo
                        </button>
                      )}
                      {selectedProject.github_url && (
                        <button
                          type="button"
                          onClick={() => window.open(selectedProject.github_url, '_blank', 'noopener,noreferrer')}
                          className="btn-wireframe"
                        >
                          <i className="fab fa-github" style={{ marginRight: 6 }} /> GitHub
                        </button>
                      )}
                      <button type="button" className="btn-wireframe btn-wireframe-outline" onClick={() => setSelectedProject(null)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="wireframe-projects-list">
                  {projects.map((p, idx) => (
                    <div key={p.id || idx} className="wireframe-project-detail-card">
                      <div className="detail-img-col">
                        {p.thumbnail_url ? (
                          <img src={getMediaUrl(p.thumbnail_url)} alt={p.title} />
                        ) : (
                          <div className="wireframe-cross-placeholder modal-placeholder">
                            <div className="cross-line-1" />
                            <div className="cross-line-2" />
                          </div>
                        )}
                      </div>

                      <div className="detail-info-col">
                        <h3 className="detail-title">project {idx + 1}: {p.title}</h3>
                        <p className="detail-desc">{p.description}</p>

                        <div className="detail-skills-row">
                          {p.tech_tags?.map((tag, i) => (
                            <span key={i} className="skill-pill">{tag}</span>
                          ))}
                        </div>

                        <div className="detail-btn-row">
                          {p.live_url && (
                            <button
                              type="button"
                              onClick={() => window.open(p.live_url, '_blank', 'noopener,noreferrer')}
                              className="btn-wireframe"
                            >
                              <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 6 }} /> Demo
                            </button>
                          )}
                          {p.github_url && (
                            <button
                              type="button"
                              onClick={() => window.open(p.github_url, '_blank', 'noopener,noreferrer')}
                              className="btn-wireframe"
                            >
                              <i className="fab fa-github" style={{ marginRight: 6 }} /> GitHub
                            </button>
                          )}
                          <button type="button" className="btn-wireframe btn-wireframe-outline" onClick={() => setSelectedProject(p)}>
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}