import { useState, useEffect } from 'react'

export default function FloatingNavbar() {
  const [activeSection, setActiveSection] = useState('home')

  const navItems = [
    {
      id: 'home',
      label: 'HOME',
      href: '#hero',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'about',
      label: 'ABOUT',
      href: '#about',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    },
    {
      id: 'experience',
      label: 'EXPERIENCE',
      href: '#experience',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      href: '#projects',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="8" y1="11" x2="8" y2="17" />
          <line x1="12" y1="13" x2="12" y2="17" />
          <line x1="16" y1="9" x2="16" y2="17" />
        </svg>
      )
    },
    {
      id: 'skills',
      label: 'SKILLS',
      href: '#skills',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    },
    {
      id: 'contact',
      label: 'CONTACT',
      href: '#contact',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = [
        { id: 'home', domId: 'hero' },
        { id: 'about', domId: 'about' },
        { id: 'experience', domId: 'experience' },
        { id: 'projects', domId: 'projects' },
        { id: 'skills', domId: 'skills' },
        { id: 'contact', domId: 'contact' }
      ]

      // Check if user scrolled near bottom of page
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80)
      if (isAtBottom) {
        setActiveSection('contact')
        return
      }

      const centerTarget = window.innerHeight * 0.35

      for (const { id, domId } of sectionIds) {
        const el = document.getElementById(domId)
        if (el) {
          const rect = el.getBoundingClientRect()
          // Section covers the viewport center point
          if (rect.top <= centerTarget && rect.bottom > centerTarget) {
            setActiveSection(id)
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="floating-navbar-container">
      <nav className="floating-navbar">
        {navItems.map(item => {
          const isActive = activeSection === item.id
          return (
            <a
              key={item.id}
              href={item.href}
              className={`floating-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="floating-nav-icon">{item.icon}</span>
              {isActive && <span className="floating-nav-label">{item.label}</span>}
              {isActive && <span className="floating-nav-dot" />}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
