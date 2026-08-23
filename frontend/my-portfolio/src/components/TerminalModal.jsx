import { useState, useRef, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'

/**
 * Terminal Link component that renders clickable terminal hyperlinks.
 */
function TerminalLink({ href, text }) {
  if (!href) return <span>{text}</span>
  const targetUrl = href.startsWith('http') || href.startsWith('mailto') ? href : `https://${href}`
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="terminal-hyperlink"
      onClick={(e) => e.stopPropagation()}
    >
      {text || href} ↗
    </a>
  )
}

/**
 * Renders terminal lines with formatted colors, ASCII headers, and clickable links.
 */
function TerminalLine({ log }) {
  if (!log) return null

  if (log.type === 'banner') {
    return (
      <div className="terminal-line terminal-line-banner">
        <pre>{log.content}</pre>
      </div>
    )
  }

  if (log.type === 'user') {
    return (
      <div className="terminal-line terminal-line-user">
        <span>{log.content}</span>
      </div>
    )
  }

  if (log.type === 'system') {
    return (
      <div className="terminal-line terminal-line-system">
        <span>{log.content}</span>
      </div>
    )
  }

  // Structured response block (supports custom JSX components / links)
  if (log.jsx) {
    return <div className="terminal-line terminal-line-response">{log.jsx}</div>
  }

  return (
    <div className="terminal-line terminal-line-response">
      <pre>{log.content}</pre>
    </div>
  )
}

export default function TerminalModal({ isOpen, onClose }) {
  const { data: allData } = useFetch('/public/all')

  const [input, setInput] = useState('')
  const [logs, setLogs] = useState([])
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const inputRef = useRef(null)
  const terminalEndRef = useRef(null)

  // Initialize terminal banner on open
  useEffect(() => {
    if (isOpen) {
      const name = allData?.about?.name || 'PRATHAM RAIKAR'
      const bannerText = `
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │               ${name.toUpperCase()} — INTERACTIVE CLI SHELL v2.0               │
 │           Type 'help' to explore sections or 'all' for full overview.         │
 └───────────────────────────────────────────────────────────────────────────────┘`

      setLogs([
        { type: 'banner', content: bannerText },
        { type: 'system', content: `[SYSTEM OK] Backend sync active. Connected to ${allData?.about?.name || 'Pratham Raikar'}'s live API.` },
        { type: 'system', content: `Type 'help' to view all commands.` }
      ])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, allData])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (!isOpen) return null

  // Helper to extract about, skills, etc.
  const about = allData?.about || {}
  const skills = allData?.skills || []
  const projects = allData?.projects || []
  const certs = allData?.certificates || []
  const platforms = allData?.platforms || []
  const internships = allData?.internships || []
  const achievements = allData?.achievements || []
  const stats = allData?.stats || {}

  // Handle command submissions
  const handleCommandSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    // Record history
    setCmdHistory(prev => [...prev, cmd])
    setHistoryIdx(-1)

    const lower = cmd.toLowerCase()
    const newLogs = [...logs, { type: 'user', content: `pratham@portfolio:~$ ${cmd}` }]

    if (lower === 'clear') {
      setLogs([])
      setInput('')
      return
    }

    if (lower === 'exit' || lower === 'quit') {
      onClose()
      setInput('')
      return
    }

    let responseJsx = null
    let responseText = ''

    switch (lower) {
      case 'help':
        responseText = `
Available Terminal Commands:
──────────────────────────────────────────────────────────────────────────────
  help         : Display this help instruction manual
  whoami       : Quick developer identity profile
  about        : Detailed background, education, and bio
  skills       : Categorized technical skills with proficiency meters
  projects     : Featured projects with descriptions, tags & clickable links
  experience   : Work experience & internship roles
  certs        : Certifications & credential verification links
  platforms    : Coding platform handles, problem metrics & ratings
  achievements : Milestone statistics & awards
  stats        : Portfolio entity counters
  contact      : Direct email, GitHub, LinkedIn & social links
  all          : Complete interactive portfolio system dump
  clear        : Clear terminal output screen
  exit         : Close CLI terminal window
──────────────────────────────────────────────────────────────────────────────`
        break

      case 'whoami':
        responseText = `
👤 DEVELOPER IDENTITY:
────────────────────────────────────────────────────────
Name           : ${about.name || 'Pratham Raikar'}
Role           : ${about.tagline || 'AI & Data Science Engineer'}
Specialization : ${about.specialization || 'AI / Machine Learning & Full Stack Development'}
Education      : ${about.degree || 'B.E. AI & DS'} (${about.year || 'Senior Year'})
Institution    : ${about.college || 'Engineering College'}
Status         : 🟢 Available for Opportunities & Projects
────────────────────────────────────────────────────────`
        break

      case 'about':
        responseJsx = (
          <div className="terminal-response-box">
            <div className="term-heading">📖 ABOUT {about.name?.toUpperCase() || 'PRATHAM RAIKAR'}</div>
            <p className="term-text">{about.bio || 'Building real-world AI and data-driven products — from model to deployed interface.'}</p>
            <div className="term-grid">
              <div><span className="term-label">College:</span> {about.college || 'N/A'}</div>
              <div><span className="term-label">Degree:</span> {about.degree || 'AI-DS'} ({about.year || 'Current'})</div>
              <div><span className="term-label">Email:</span> <TerminalLink href={`mailto:${about.email || 'raikarpratham3@gmail.com'}`} text={about.email || 'raikarpratham3@gmail.com'} /></div>
              <div><span className="term-label">Phone:</span> {about.phone || 'N/A'}</div>
              <div><span className="term-label">GitHub:</span> <TerminalLink href={about.github_url || 'https://github.com/Prathamr17'} text={about.github_url || 'github.com/Prathamr17'} /></div>
              <div><span className="term-label">LinkedIn:</span> <TerminalLink href={about.linkedin_url || 'https://linkedin.com/in/prathamraikar'} text={about.linkedin_url || 'linkedin.com/in/prathamraikar'} /></div>
              {about.resume_url && (
                <div><span className="term-label">Resume Doc:</span> <TerminalLink href={about.resume_url} text="Download Resume PDF" /></div>
              )}
            </div>
          </div>
        )
        break

      case 'skills':
        if (!skills || skills.length === 0) {
          responseText = 'No skills registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">🛠️ TECHNICAL SKILLS & PROFICIENCY</div>
              {skills.map((cat, idx) => (
                <div key={idx} className="term-skill-cat">
                  <div className="term-subheading">▸ {cat.name}</div>
                  <div className="term-skill-list">
                    {(cat.skills || []).map((s, sIdx) => {
                      const prof = s.proficiency || 80
                      const filled = Math.round(prof / 10)
                      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
                      return (
                        <div key={sIdx} className="term-skill-row">
                          <span className="term-skill-name">{s.name}</span>
                          <span className="term-skill-bar">[{bar}]</span>
                          <span className="term-skill-perc">{prof}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        break

      case 'projects':
        if (!projects || projects.length === 0) {
          responseText = 'No projects registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">💻 FEATURED PROJECTS ({projects.length})</div>
              {projects.map((p, idx) => (
                <div key={idx} className="term-item-card">
                  <div className="term-item-title">
                    {idx + 1}. {p.title} {p.is_featured && <span className="term-badge">FEATURED</span>}
                  </div>
                  <p className="term-item-desc">{p.description}</p>
                  {p.tech_tags && (
                    <div className="term-tags">
                      <span className="term-label">Tech:</span>{' '}
                      {(Array.isArray(p.tech_tags) ? p.tech_tags : (p.tech_tags || '').split(',')).map((t, tIdx) => (
                        <span key={tIdx} className="term-tag-pill">[{t.trim()}]</span>
                      ))}
                    </div>
                  )}
                  <div className="term-links-row">
                    {p.github_url && <TerminalLink href={p.github_url} text="[GitHub Code]" />}
                    {p.live_url && <TerminalLink href={p.live_url} text="[Live Demo]" />}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        break

      case 'experience':
      case 'internships':
        if (!internships || internships.length === 0) {
          responseText = 'No work experience registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">💼 WORK EXPERIENCE & INTERNSHIPS ({internships.length})</div>
              {internships.map((item, idx) => {
                const sDate = item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
                const eDate = item.is_current ? 'Present' : (item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')
                return (
                  <div key={idx} className="term-item-card">
                    <div className="term-item-title">
                      ▸ {item.role} <span className="term-accent-color">@ {item.company_name}</span>
                      <span className="term-date">({sDate} - {eDate})</span>
                    </div>
                    {item.location && <div className="term-sub-info">Location: {item.location}</div>}
                    <p className="term-item-desc">{item.description}</p>
                    {item.tech_used && (
                      <div className="term-tags">
                        <span className="term-label">Tech:</span>{' '}
                        {(Array.isArray(item.tech_used) ? item.tech_used : (item.tech_used || '').split(',')).map((t, tIdx) => (
                          <span key={tIdx} className="term-tag-pill">[{t.trim()}]</span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        }
        break

      case 'certs':
      case 'certificates':
        if (!certs || certs.length === 0) {
          responseText = 'No certificates registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">📜 CERTIFICATIONS & ACCREDITATION ({certs.length})</div>
              {certs.map((c, idx) => (
                <div key={idx} className="term-item-card">
                  <div className="term-item-title">
                    {idx + 1}. {c.title} <span className="term-accent-color">— {c.issuer}</span>
                  </div>
                  <div className="term-sub-info">
                    Category: <span className="term-badge">{c.category?.toUpperCase() || 'GENERAL'}</span>
                    {c.issue_date && <span> | Issued: {new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                  </div>
                  {c.credential_url && (
                    <div className="term-links-row">
                      <TerminalLink href={c.credential_url} text="[Verify Credential]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
        break

      case 'platforms':
        if (!platforms || platforms.length === 0) {
          responseText = 'No platforms registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">⚡ CODING PLATFORMS & COMPETITIVE METRICS ({platforms.length})</div>
              {platforms.map((pl, idx) => (
                <div key={idx} className="term-item-card">
                  <div className="term-item-title">
                    ▸ {pl.name}
                  </div>
                  <div className="term-sub-info">
                    {pl.problems_solved && <span>Solved: <strong>{pl.problems_solved}</strong></span>}
                    {pl.current_rating && <span> | Rating: <strong>{pl.current_rating}</strong></span>}
                  </div>
                  {pl.profile_url && (
                    <div className="term-links-row">
                      <TerminalLink href={pl.profile_url} text={`[Visit ${pl.name} Profile]`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
        break

      case 'achievements':
        if (!achievements || achievements.length === 0) {
          responseText = 'No achievements registered in backend database.'
        } else {
          responseJsx = (
            <div className="terminal-response-box">
              <div className="term-heading">🏆 ACHIEVEMENTS & MILESTONES</div>
              <div className="term-grid">
                {achievements.map((a, idx) => (
                  <div key={idx} className="term-stat-card">
                    <div className="term-stat-val">{a.metric_value}</div>
                    <div className="term-stat-lbl">{a.title}</div>
                    {a.metric_label && <div className="term-stat-sub">{a.metric_label}</div>}
                  </div>
                ))}
              </div>
            </div>
          )
        }
        break

      case 'stats':
        responseJsx = (
          <div className="terminal-response-box">
            <div className="term-heading">📊 PORTFOLIO SYSTEM COUNTERS</div>
            <div className="term-grid">
              <div className="term-stat-card">
                <div className="term-stat-val">{stats.projects || projects.length}</div>
                <div className="term-stat-lbl">Projects Built</div>
              </div>
              <div className="term-stat-card">
                <div className="term-stat-val">{stats.internships || internships.length}</div>
                <div className="term-stat-lbl">Experiences</div>
              </div>
              <div className="term-stat-card">
                <div className="term-stat-val">{stats.certificates || certs.length}</div>
                <div className="term-stat-lbl">Certifications</div>
              </div>
              <div className="term-stat-card">
                <div className="term-stat-val">{stats.platforms || platforms.length}</div>
                <div className="term-stat-lbl">Coding Platforms</div>
              </div>
            </div>
          </div>
        )
        break

      case 'contact':
        responseJsx = (
          <div className="terminal-response-box">
            <div className="term-heading">📬 CONTACT & SOCIAL DOCK</div>
            <div className="term-grid">
              <div><span className="term-label">Email:</span> <TerminalLink href={`mailto:${about.email || 'raikarpratham3@gmail.com'}`} text={about.email || 'raikarpratham3@gmail.com'} /></div>
              <div><span className="term-label">Phone:</span> {about.phone || 'N/A'}</div>
              <div><span className="term-label">GitHub:</span> <TerminalLink href={about.github_url || 'https://github.com/Prathamr17'} text="github.com/Prathamr17" /></div>
              <div><span className="term-label">LinkedIn:</span> <TerminalLink href={about.linkedin_url || 'https://linkedin.com/in/prathamraikar'} text="linkedin.com/in/prathamraikar" /></div>
              <div><span className="term-label">Location:</span> Goa / Mumbai, India</div>
            </div>
          </div>
        )
        break

      case 'all':
        responseJsx = (
          <div className="terminal-response-box">
            <div className="term-heading">═════════════════════════════════════════════════════════════════════════════</div>
            <div className="term-heading">🚀 COMPLETE PORTFOLIO SYSTEM DUMP</div>
            <div className="term-heading">═════════════════════════════════════════════════════════════════════════════</div>
            
            {/* Identity */}
            <div className="term-subheading" style={{ marginTop: 12 }}>1. IDENTITY & BIO</div>
            <p className="term-text"><strong>{about.name}</strong> — {about.tagline}</p>
            <p className="term-text">{about.bio}</p>

            {/* Projects */}
            <div className="term-subheading" style={{ marginTop: 16 }}>2. PROJECTS ({projects.length})</div>
            {projects.map((p, idx) => (
              <div key={idx} style={{ marginBottom: 8, paddingLeft: 12 }}>
                ▸ <strong>{p.title}</strong> — {p.description}
                <div style={{ gap: 12, display: 'flex', marginTop: 2 }}>
                  {p.github_url && <TerminalLink href={p.github_url} text="[GitHub]" />}
                  {p.live_url && <TerminalLink href={p.live_url} text="[Live Demo]" />}
                </div>
              </div>
            ))}

            {/* Experience */}
            <div className="term-subheading" style={{ marginTop: 16 }}>3. EXPERIENCE ({internships.length})</div>
            {internships.map((i, idx) => (
              <div key={idx} style={{ marginBottom: 6, paddingLeft: 12 }}>
                ▸ <strong>{i.role}</strong> @ {i.company_name} ({i.is_current ? 'Present' : 'Completed'})
              </div>
            ))}

            {/* Skills */}
            <div className="term-subheading" style={{ marginTop: 16 }}>4. SKILLS & STACK</div>
            <div style={{ paddingLeft: 12 }}>
              {skills.map((c, cIdx) => (
                <div key={cIdx}>
                  <strong>{c.name}:</strong> {(c.skills || []).map(s => s.name).join(', ')}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="term-subheading" style={{ marginTop: 16 }}>5. CONNECT</div>
            <div style={{ paddingLeft: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <TerminalLink href={`mailto:${about.email}`} text={`Email: ${about.email}`} />
              <TerminalLink href={about.github_url} text="GitHub Profile" />
              <TerminalLink href={about.linkedin_url} text="LinkedIn Profile" />
            </div>
          </div>
        )
        break

      default:
        responseText = `Command not recognized: '${cmd}'. Type 'help' for a list of available commands.`
        break
    }

    if (responseJsx) {
      newLogs.push({ type: 'response', jsx: responseJsx })
    } else {
      newLogs.push({ type: 'response', content: responseText })
    }

    setLogs(newLogs)
    setInput('')
  }

  // Command History Navigation (Up / Down Arrow Keys)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx
      setHistoryIdx(nextIdx)
      setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1
        setHistoryIdx(nextIdx)
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || '')
      } else if (historyIdx === 0) {
        setHistoryIdx(-1)
        setInput('')
      }
    }
  }

  return (
    <div className="terminal-fullscreen-overlay">
      <div className="terminal-fullscreen-container">
        {/* Terminal Header Bar */}
        <div className="terminal-header-bar">
          <div className="terminal-header-left">
            <span className="term-dot term-dot-red" onClick={onClose} title="Close" />
            <span className="term-dot term-dot-yellow" title="Minimize" />
            <span className="term-dot term-dot-green" title="Maximize" />
            <span className="terminal-title-text">
              pratham@portfolio-cli: ~ bash (Connected to Live API)
            </span>
          </div>

          <div className="terminal-header-right">
            <button className="term-close-btn" onClick={onClose} title="Exit Fullscreen Terminal">✕ ESC</button>
          </div>
        </div>

        {/* Terminal Body Output Area */}
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          {logs.map((log, index) => (
            <TerminalLine key={index} log={log} />
          ))}

          {/* Prompt Input Line */}
          <form onSubmit={handleCommandSubmit} className="terminal-input-form">
            <span className="terminal-prompt">pratham@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help' for commands..."
              autoFocus
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
