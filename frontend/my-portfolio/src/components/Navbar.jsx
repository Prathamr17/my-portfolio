import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TerminalModal from './TerminalModal'

export default function Navbar({ navVisible = true }) {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <div className={`floating-top-navbar-container ${!navVisible ? 'nav-hidden' : ''}`}>
        <nav className="floating-top-navbar-dock">
          {/* Left: Name always visible */}
          <button
            type="button"
            className="top-dock-logo-always"
            onClick={() => navigate('/')}
            aria-label="Home"
          >
            <span className="glow-dot" />
            <span className="top-logo-name">PRATHAM RAIKAR</span>
          </button>

          {/* Right: Symbol buttons */}
          <div className="top-dock-symbol-actions">
            {/* Achievements Symbol Button */}
            <button
              type="button"
              className="top-symbol-only-btn achievements-btn"
              onClick={() => navigate('/achievements')}
              aria-label="Achievements"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
              <span className="nav-tooltip top-tooltip">Achievements</span>
            </button>

            {/* Terminal Symbol Button */}
            <button
              type="button"
              className="top-symbol-only-btn terminal-btn"
              onClick={() => setTerminalOpen(true)}
              aria-label="Terminal CLI"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span className="nav-tooltip top-tooltip">Terminal CLI</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Full-Screen Interactive Terminal Interface */}
      <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  )
}
