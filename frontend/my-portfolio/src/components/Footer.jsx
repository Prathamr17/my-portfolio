import { useFetch } from '../hooks/useFetch'

export default function Footer() {
  const { data: about } = useFetch('/public/about')

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-name">{about?.name || 'Pratham Raikar'}</div>
            <div className="footer-copy" style={{ marginTop: 4 }}>{about?.tagline || 'AI-DS Engineer | Developer'}</div>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} {about?.name || 'Pratham Raikar'}. All rights reserved.
          </div>

          <div className="footer-socials">
            {about?.github_url && (
              <button type="button" onClick={() => window.open(about.github_url, '_blank', 'noopener,noreferrer')} className="footer-social-btn" aria-label="GitHub">
                <i className="fab fa-github" />
              </button>
            )}
            {about?.linkedin_url && (
              <button type="button" onClick={() => window.open(about.linkedin_url, '_blank', 'noopener,noreferrer')} className="footer-social-btn" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" />
              </button>
            )}
            {about?.email && (
              <button type="button" onClick={() => { window.location.href = `mailto:${about.email}` }} className="footer-social-btn" aria-label="Email">
                <i className="fa-solid fa-envelope" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
