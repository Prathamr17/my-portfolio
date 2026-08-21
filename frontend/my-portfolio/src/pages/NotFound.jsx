import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '404 | Page Not Found - Pratham Raikar'
  }, [])

  return (
    <div className="not-found-container">
      {/* Ambient background glow */}
      <div className="not-found-glow glow-1" />
      <div className="not-found-glow glow-2" />

      <div className="not-found-card">
        {/* Header */}
        <div className="not-found-header">
          <div className="window-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="window-title">status://404</span>
        </div>

        {/* Card Content */}
        <div className="not-found-body">
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-desc">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn-primary not-found-home-btn">
              <i className="fa-solid fa-house" /> Return Home
            </Link>
            <button onClick={() => navigate(-1)} className="btn-outline">
              <i className="fa-solid fa-arrow-left" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
