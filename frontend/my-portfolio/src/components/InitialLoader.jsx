import { useState, useEffect } from 'react'

export default function InitialLoader() {
  const [loading, setLoading] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Trigger fade-out animation at 2.0s
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 2000)

    // Remove from DOM after fade-out transition completes (2.4s total)
    const removeTimer = setTimeout(() => {
      setLoading(false)
    }, 2400)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!loading) return null

  return (
    <div className={`initial-loader-overlay ${fading ? 'fade-out' : ''}`}>
      <div className="initial-loader-content">
        <div className="initial-loader-brand">
          <span className="glow-dot" />
          <span className="loader-title">Pratham's Portfolio</span>
        </div>
        <div className="initial-loader-bar-container">
          <div className="initial-loader-bar-fill" />
        </div>
        <div className="initial-loader-subtext">INITIALIZING...</div>
      </div>
    </div>
  )
}
