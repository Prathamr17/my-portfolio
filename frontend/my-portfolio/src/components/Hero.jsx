import { useState, useEffect, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getMediaUrl } from '../utils/media'

const ROLES = ['Web Developer', 'AI-DS Engineer', 'ML Enthusiast', 'Full Stack Dev']

export default function Hero() {
  const { data: about } = useFetch('/public/about')
  const { data: stats } = useFetch('/public/stats')

  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [charIdx, setCharIdx] = useState(0)
  const heroRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true) // Hero is always visible

  useEffect(() => {
    const current = ROLES[roleIdx]
    let timeout
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }, 75)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1600)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }, 35)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setRoleIdx(i => (i + 1) % ROLES.length)
    }
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, roleIdx])

  return (
    <section className={`hero ${isVisible ? 'reveal-in' : ''}`} id="hero" ref={heroRef}>
      <div className="container hero-inner">
        {/* Left — intro */}
        <div className="hero-left">
          <div className="hero-kicker"><span className="dot" />available for opportunities</div>

          <h1 className="hero-name">
            Hi, I'm <span className="accent">{about?.name || 'Pratham Raikar'}</span>
          </h1>

          <div className="hero-role-row">
            <span className="bracket">&gt;</span>
            <span>{displayed}</span>
            <span className="hero-cursor" />
          </div>

          <p className="hero-desc">
            {about?.tagline || 'Building real-world AI and data-driven products — from model to deployed interface.'}
          </p>

          <div className="hero-btns">
            <a
              href={getMediaUrl(about?.resume_url) || '#'}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <span><i className="fa-solid fa-file-arrow-down" style={{ marginRight: 8 }} />Resume</span>
            </a>

            <a
              href={about?.github_url || 'https://github.com/Prathamr17'}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              <i className="fab fa-github" /> GitHub
            </a>
          </div>
        </div>

        {/* Right — live status panel */}
        <div className="hero-panel">
          <div className="hero-panel-bar">
            <span className="btn-dot r" /><span className="btn-dot y" /><span className="btn-dot g" />
            <span className="path">~/portfolio/status</span>
          </div>
          <div className="hero-panel-body">
            <div className="hero-metric-grid">
              <div className="hero-metric">
                <div className="val">{stats ? stats.projects : '—'}</div>
                <div className="lbl"><span className="up">↑</span>Projects</div>
              </div>
              <div className="hero-metric">
                <div className="val">{stats ? stats.certificates : '—'}</div>
                <div className="lbl"><span className="up">↑</span>Certificates</div>
              </div>
              <div className="hero-metric">
                <div className="val">{stats ? stats.platforms : '—'}</div>
                <div className="lbl"><span className="up">↑</span>Platforms</div>
              </div>
              <div className="hero-metric">
                <div className="val">{stats ? stats.internships : '—'}</div>
                <div className="lbl"><span className="up">↑</span>Internships</div>
              </div>
            </div>
          </div>
          <div className="hero-panel-footer">
            <span>status: online</span>
            <span>build: stable</span>
          </div>
        </div>
      </div>
    </section>
  )
}