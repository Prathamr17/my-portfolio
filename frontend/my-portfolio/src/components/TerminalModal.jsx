import { useState, useRef, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'

const THEMES = [
  { id: 'tokyo-night', key: '1', name: 'tokyo-night', desc: 'Deep Japanese Tokyo Night (Default)' },
  { id: 'matrix',      key: '2', name: 'matrix',      desc: 'Hacker Matrix Neon Green' },
  { id: 'cyberpunk',   key: '3', name: 'cyberpunk',   desc: 'Neon Pink & Cyber Cyan' },
  { id: 'dracula',     key: '4', name: 'dracula',     desc: 'Dark Purple & Magenta' },
  { id: 'monokai',     key: '5', name: 'monokai',     desc: 'Classic Monokai Pro' },
  { id: 'nord',        key: '6', name: 'nord',        desc: 'Arctic Frost Slate Blue' },
  { id: 'amber',       key: '7', name: 'amber',       desc: 'Retro 1980s Amber CRT' },
]

/**
 * Clickable Terminal Link Component
 */
function TerminalLink({ href, text }) {
  if (!href) return null
  const targetUrl = href.startsWith('http') || href.startsWith('mailto') ? href : `https://${href}`
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="terminal-link"
      onClick={(e) => e.stopPropagation()}
    >
      {text || href} ↗
    </a>
  )
}

/**
 * Terminal Line Output Renderer
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

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('terminal_theme') || 'tokyo-night'
  })

  const [input, setInput] = useState('')
  const [logs, setLogs] = useState([])
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const inputRef = useRef(null)
  const terminalEndRef = useRef(null)

  // Initialize banner on modal open
  useEffect(() => {
    if (isOpen) {
      const name = allData?.about?.name || 'PRATHAM RAIKAR'
      const bannerText = `
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │               ${name.toUpperCase()} — INTERACTIVE CLI SHELL v2.0               │
 │           Type 'help' for commands, or 'themes' to change colors (7 themes).  │
 └───────────────────────────────────────────────────────────────────────────────┘`

      setLogs([
        { type: 'banner', content: bannerText },
        { type: 'system', content: `[SYSTEM] Active Theme: '${currentTheme}'. Type 'themes' to switch color palette.` },
        { type: 'system', content: `[SYSTEM] Connected to live portfolio API database. Type 'help' to get started.` }
      ])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, allData])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (!isOpen) return null

  // Extract public backend data
  const about = allData?.about || {}
  const skills = allData?.skills || []
  const projects = allData?.projects || []
  const certs = allData?.certificates || []
  const platforms = allData?.platforms || []
  const internships = allData?.internships || []
  const achievements = allData?.achievements || []
  const stats = allData?.stats || {}

  // Change Theme Handler
  const applyTheme = (themeId) => {
    const found = THEMES.find(t => t.id === themeId.toLowerCase() || t.key === themeId)
    if (!found) return null
    setCurrentTheme(found.id)
    localStorage.setItem('terminal_theme', found.id)
    return found
  }

  // Handle Command Submission
  const handleCommandSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    setCmdHistory(prev => [...prev, cmd])
    setHistoryIdx(-1)

    const lower = cmd.toLowerCase()
    const parts = lower.split(' ').filter(Boolean)
    const primaryCmd = parts[0]
    const arg = parts[1]

    const newLogs = [...logs, { type: 'user', content: `pratham@portfolio:~$ ${cmd}` }]

    if (primaryCmd === 'clear') {
      setLogs([])
      setInput('')
      return
    }

    if (primaryCmd === 'exit' || primaryCmd === 'quit') {
      onClose()
      setInput('')
      return
    }

    let responseJsx = null
    let responseText = ''

    // Theme command handler
    if (primaryCmd === 'themes' || primaryCmd === 'theme') {
      if (!arg) {
        responseJsx = (
          <div className="term-block">
            <div className="term-title">🎨 TERMINAL COLOR THEMES (7 Available)</div>
            <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
            {THEMES.map(t => (
              <div key={t.id} className="term-row">
                <span className="term-lbl">[{t.key}] {t.name.padEnd(14)}</span>
                <span className="term-val">: {t.desc} {t.id === currentTheme ? ' 🟢 (ACTIVE)' : ''}</span>
              </div>
            ))}
            <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
            <div className="term-text">Usage: Type <strong>theme &lt;name&gt;</strong> or <strong>theme &lt;number&gt;</strong> to switch theme.</div>
            <div className="term-text">Example: <code>theme matrix</code> or <code>theme 2</code></div>
          </div>
        )
      } else {
        const switched = applyTheme(arg)
        if (switched) {
          responseText = `🟢 Terminal theme updated to '${switched.name}' (${switched.desc}). Saved to local settings.`
        } else {
          responseText = `❌ Theme '${arg}' not found. Type 'themes' to list all 7 available color schemes.`
        }
      }
    } else {
      switch (primaryCmd) {
        case 'help':
          responseText = `
AVAILABLE CLI COMMANDS:
──────────────────────────────────────────────────────────────────────────
  help         : Display command instruction manual
  themes       : List all 7 color themes (matrix, dracula, cyberpunk, etc.)
  theme <name> : Change terminal theme (e.g. 'theme matrix' or 'theme 3')
  whoami       : Quick identity summary & status
  about        : Full bio, education, degree & download resume
  skills       : Categorized technical skills & progress bars
  projects     : Portfolio projects with descriptions & clickable links
  experience   : Work experience & internship history
  certs        : Certifications & verification links
  platforms    : Coding platforms, problem counts & ratings
  achievements : Milestone statistics & awards
  stats        : Portfolio entity counters
  contact      : Email, GitHub, LinkedIn & direct links
  all          : Complete interactive portfolio system dump
  clear        : Clear terminal output screen
  exit         : Close terminal CLI window
──────────────────────────────────────────────────────────────────────────`
          break

        case 'whoami':
          responseText = `
👤 DEVELOPER IDENTITY:
──────────────────────────────────────────────────────────────────────────
  Name           : ${about.name || 'Pratham Raikar'}
  Role           : ${about.tagline || 'AI & Data Science Engineer'}
  Specialization : ${about.specialization || 'AI / Machine Learning & Full Stack Development'}
  Education      : ${about.degree || 'B.E. AI & DS'} (${about.year || 'Senior Year'})
  Institution    : ${about.college || 'Engineering College'}
  Status         : 🟢 Available for Opportunities & Projects
──────────────────────────────────────────────────────────────────────────`
          break

        case 'about':
          responseJsx = (
            <div className="term-block">
              <div className="term-title">📖 ABOUT {about.name?.toUpperCase() || 'PRATHAM RAIKAR'}</div>
              <div className="term-text">{about.bio || 'Building real-world AI and data-driven products — from model to deployed interface.'}</div>
              <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
              <div className="term-row"><span className="term-lbl">College    :</span> <span className="term-val">{about.college || 'N/A'}</span></div>
              <div className="term-row"><span className="term-lbl">Degree     :</span> <span className="term-val">{about.degree || 'AI-DS'} ({about.year || 'Current'})</span></div>
              <div className="term-row"><span className="term-lbl">Email      :</span> <TerminalLink href={`mailto:${about.email || 'raikarpratham3@gmail.com'}`} text={about.email || 'raikarpratham3@gmail.com'} /></div>
              <div className="term-row"><span className="term-lbl">Phone      :</span> <span className="term-val">{about.phone || 'N/A'}</span></div>
              <div className="term-row"><span className="term-lbl">GitHub     :</span> <TerminalLink href={about.github_url || 'https://github.com/Prathamr17'} text={about.github_url || 'https://github.com/Prathamr17'} /></div>
              <div className="term-row"><span className="term-lbl">LinkedIn   :</span> <TerminalLink href={about.linkedin_url || 'https://linkedin.com/in/prathamraikar'} text={about.linkedin_url || 'https://linkedin.com/in/prathamraikar'} /></div>
              {about.resume_url && (
                <div className="term-row"><span className="term-lbl">Resume Doc :</span> <TerminalLink href={about.resume_url} text="Download Resume Document" /></div>
              )}
            </div>
          )
          break

        case 'skills':
          if (!skills || skills.length === 0) {
            responseText = 'No skills registered in backend database.'
          } else {
            responseJsx = (
              <div className="term-block">
                <div className="term-title">🛠️ TECHNICAL SKILLS & PROFICIENCY METERS</div>
                {skills.map((cat, idx) => (
                  <div key={idx} className="term-section-sub">
                    <div className="term-subtitle">▸ {cat.name.toUpperCase()}</div>
                    {(cat.skills || []).map((s, sIdx) => {
                      const prof = s.proficiency || 80
                      const filled = Math.round(prof / 10)
                      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
                      return (
                        <div key={sIdx} className="term-row">
                          <span className="term-lbl">{s.name.padEnd(16)}</span>
                          <span className="term-bar">[{bar}]</span>
                          <span className="term-val">{prof}%</span>
                        </div>
                      )
                    })}
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
              <div className="term-block">
                <div className="term-title">💻 FEATURED PROJECTS ({projects.length})</div>
                {projects.map((p, idx) => {
                  const tagsArr = Array.isArray(p.tech_tags) ? p.tech_tags : (p.tech_tags || '').split(',')
                  const formattedTags = tagsArr.map(t => `[${t.trim()}]`).join(' ')
                  return (
                    <div key={idx} className="term-box-card">
                      <div className="term-box-header">
                        ┌── [{idx + 1}] {p.title.toUpperCase()} {p.is_featured ? '⭐ FEATURED' : ''} ──────────────┐
                      </div>
                      <div className="term-box-line">│  Desc  : {p.description}</div>
                      {formattedTags && <div className="term-box-line">│  Tech  : {formattedTags}</div>}
                      <div className="term-box-line">
                        │  Links : {p.github_url && <TerminalLink href={p.github_url} text="[GitHub Code]" />} {p.live_url && <TerminalLink href={p.live_url} text="[Live Demo]" />}
                      </div>
                      <div className="term-box-footer">└───────────────────────────────────────────────────────────────────────┘</div>
                    </div>
                  )
                })}
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
              <div className="term-block">
                <div className="term-title">💼 WORK EXPERIENCE & INTERNSHIPS ({internships.length})</div>
                {internships.map((item, idx) => {
                  const sDate = item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
                  const eDate = item.is_current ? 'Present' : (item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')
                  const tagsArr = Array.isArray(item.tech_used) ? item.tech_used : (item.tech_used || '').split(',')
                  const formattedTags = tagsArr.map(t => `[${t.trim()}]`).join(' ')
                  return (
                    <div key={idx} className="term-box-card">
                      <div className="term-box-header">
                        ┌── ▸ {item.role.toUpperCase()} @ {item.company_name.toUpperCase()} ({sDate} - {eDate}) ──────────────┐
                      </div>
                      {item.location && <div className="term-box-line">│  Loc   : {item.location}</div>}
                      <div className="term-box-line">│  Desc  : {item.description}</div>
                      {formattedTags && <div className="term-box-line">│  Tech  : {formattedTags}</div>}
                      <div className="term-box-footer">└───────────────────────────────────────────────────────────────────────┘</div>
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
              <div className="term-block">
                <div className="term-title">📜 CERTIFICATIONS & ACCREDITATION ({certs.length})</div>
                {certs.map((c, idx) => {
                  const issueStr = c.issue_date ? new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'
                  return (
                    <div key={idx} className="term-box-card">
                      <div className="term-box-header">
                        ┌── [{idx + 1}] {c.title.toUpperCase()} ───────────────────────────────┐
                      </div>
                      <div className="term-box-line">│  Issuer   : {c.issuer || 'N/A'}</div>
                      <div className="term-box-line">│  Category : [{c.category?.toUpperCase() || 'GENERAL'}] | Issued: {issueStr}</div>
                      {c.credential_url && (
                        <div className="term-box-line">│  Verify   : <TerminalLink href={c.credential_url} text="[Verify Credential Link]" /></div>
                      )}
                      <div className="term-box-footer">└───────────────────────────────────────────────────────────────────────┘</div>
                    </div>
                  )
                })}
              </div>
            )
          }
          break

        case 'platforms':
          if (!platforms || platforms.length === 0) {
            responseText = 'No platforms registered in backend database.'
          } else {
            responseJsx = (
              <div className="term-block">
                <div className="term-title">⚡ CODING PLATFORMS & COMPETITIVE METRICS ({platforms.length})</div>
                {platforms.map((pl, idx) => (
                  <div key={idx} className="term-box-card">
                    <div className="term-box-header">
                      ┌── ▸ {pl.name.toUpperCase()} ──────────────────────────────────────────────┐
                    </div>
                    {pl.problems_solved && <div className="term-box-line">│  Problems Solved : {pl.problems_solved}</div>}
                    {pl.current_rating && <div className="term-box-line">│  Current Rating  : {pl.current_rating}</div>}
                    {pl.profile_url && (
                      <div className="term-box-line">│  Profile Link    : <TerminalLink href={pl.profile_url} text={`[${pl.name} Profile Link]`} /></div>
                    )}
                    <div className="term-box-footer">└───────────────────────────────────────────────────────────────────────┘</div>
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
              <div className="term-block">
                <div className="term-title">🏆 ACHIEVEMENTS & MILESTONES</div>
                {achievements.map((a, idx) => (
                  <div key={idx} className="term-row">
                    <span className="term-lbl">▸ {a.title.padEnd(24)}</span>
                    <span className="term-val">: <strong>{a.metric_value}</strong> {a.metric_label || ''}</span>
                  </div>
                ))}
              </div>
            )
          }
          break

        case 'stats':
          responseJsx = (
            <div className="term-block">
              <div className="term-title">📊 PORTFOLIO ENTITY STATISTICS</div>
              <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
              <div className="term-row"><span className="term-lbl">Featured Projects  :</span> <span className="term-val">{stats.projects || projects.length}</span></div>
              <div className="term-row"><span className="term-lbl">Work Experience    :</span> <span className="term-val">{stats.internships || internships.length}</span></div>
              <div className="term-row"><span className="term-lbl">Certifications     :</span> <span className="term-val">{stats.certificates || certs.length}</span></div>
              <div className="term-row"><span className="term-lbl">Coding Platforms   :</span> <span className="term-val">{stats.platforms || platforms.length}</span></div>
              <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
            </div>
          )
          break

        case 'contact':
          responseJsx = (
            <div className="term-block">
              <div className="term-title">📬 CONTACT & SOCIAL DOCK</div>
              <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
              <div className="term-row"><span className="term-lbl">Email    :</span> <TerminalLink href={`mailto:${about.email || 'raikarpratham3@gmail.com'}`} text={about.email || 'raikarpratham3@gmail.com'} /></div>
              <div className="term-row"><span className="term-lbl">Phone    :</span> <span className="term-val">{about.phone || 'N/A'}</span></div>
              <div className="term-row"><span className="term-lbl">GitHub   :</span> <TerminalLink href={about.github_url || 'https://github.com/Prathamr17'} text="https://github.com/Prathamr17" /></div>
              <div className="term-row"><span className="term-lbl">LinkedIn :</span> <TerminalLink href={about.linkedin_url || 'https://linkedin.com/in/prathamraikar'} text="https://linkedin.com/in/prathamraikar" /></div>
              <div className="term-row"><span className="term-lbl">Location :</span> <span className="term-val">Goa / Mumbai, India</span></div>
              <div className="term-divider">──────────────────────────────────────────────────────────────────────────</div>
            </div>
          )
          break

        case 'all':
          responseJsx = (
            <div className="term-block">
              <div className="term-title">══════════════════════════════════════════════════════════════════════════</div>
              <div className="term-title">🚀 COMPLETE PORTFOLIO SYSTEM DUMP</div>
              <div className="term-title">══════════════════════════════════════════════════════════════════════════</div>
              
              <div className="term-subtitle" style={{ marginTop: 10 }}>[1] IDENTITY</div>
              <div className="term-text"><strong>{about.name}</strong> — {about.tagline}</div>
              <div className="term-text">{about.bio}</div>

              <div className="term-subtitle" style={{ marginTop: 10 }}>[2] PROJECTS ({projects.length})</div>
              {projects.map((p, idx) => (
                <div key={idx} className="term-row-indented">
                  ▸ <strong>{p.title}</strong> — {p.description}
                  <div>
                    {p.github_url && <TerminalLink href={p.github_url} text="[GitHub]" />}{' '}
                    {p.live_url && <TerminalLink href={p.live_url} text="[Live Demo]" />}
                  </div>
                </div>
              ))}

              <div className="term-subtitle" style={{ marginTop: 10 }}>[3] EXPERIENCE ({internships.length})</div>
              {internships.map((i, idx) => (
                <div key={idx} className="term-row-indented">
                  ▸ <strong>{i.role}</strong> @ {i.company_name} ({i.is_current ? 'Present' : 'Completed'})
                </div>
              ))}

              <div className="term-subtitle" style={{ marginTop: 10 }}>[4] CONNECT</div>
              <div className="term-row-indented">
                <TerminalLink href={`mailto:${about.email}`} text={`Email: ${about.email}`} /> |{' '}
                <TerminalLink href={about.github_url} text="GitHub Profile" /> |{' '}
                <TerminalLink href={about.linkedin_url} text="LinkedIn Profile" />
              </div>
            </div>
          )
          break

        default:
          responseText = `Command not recognized: '${cmd}'. Type 'help' for available commands or 'themes' to change colors.`
          break
      }
    }

    if (responseJsx) {
      newLogs.push({ type: 'response', jsx: responseJsx })
    } else {
      newLogs.push({ type: 'response', content: responseText })
    }

    setLogs(newLogs)
    setInput('')
  }

  // Arrow Key Command History Navigation
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
    <div className={`terminal-fullscreen-overlay term-theme-${currentTheme}`}>
      <div className="terminal-fullscreen-container">
        {/* Terminal Header Bar */}
        <div className="terminal-header-bar">
          <div className="terminal-header-left">
            <span className="term-dot term-dot-red" onClick={onClose} title="Close" />
            <span className="term-dot term-dot-yellow" title="Minimize" />
            <span className="term-dot term-dot-green" title="Maximize" />
            <span className="terminal-title-text">
              pratham@portfolio-cli: ~ bash (Theme: {currentTheme})
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

          {/* Prompt Input Form */}
          <form onSubmit={handleCommandSubmit} className="terminal-input-form">
            <span className="terminal-prompt">pratham@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help' or 'themes'..."
              autoFocus
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
