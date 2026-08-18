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
            {about?.github_url && (<a href={about.github_url} target="_blank" rel="noreferrer"><i className="fab fa-github" /></a>)}
            {about?.linkedin_url && (<a href={about.linkedin_url} target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>)}
            {about?.email && (<a href={`mailto:${about.email}`}><i className="fa-solid fa-envelope" /></a>)}
          </div>
        </div>
      </div>
    </footer>
  )
}
