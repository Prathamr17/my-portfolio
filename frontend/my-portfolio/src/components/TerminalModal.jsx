import { useState, useRef, useEffect } from 'react'

const INITIAL_LOGS = [
  {
    type: 'banner',
    content: `
 ╔═══════════════════════════════════════════════════════════════════════════════╗
 ║          PRATHAM RAIKAR INTERACTIVE CLI TERMINAL                       ║
 ║          Version 1.0.0 — Type 'help' to list available commands.       ║
 ╚═══════════════════════════════════════════════════════════════════════════════╝
`
  },
  {
    type: 'system',
    content: 'System initialized in full-screen mode. Ready for command input.'
  }
]

export default function TerminalModal({ isOpen, onClose }) {
  const [input, setInput] = useState('')
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const inputRef = useRef(null)
  const terminalEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (!isOpen) return null

  const handleCommandSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    const newLogs = [...logs, { type: 'user', content: `pratham@portfolio:~$ ${cmd}` }]
    const lower = cmd.toLowerCase()

    let response = ''
    if (lower === 'clear') {
      setLogs(INITIAL_LOGS)
      setInput('')
      return
    } else if (lower === 'help') {
      response = `Available Commands:
  - help      : Show this help menu
  - whoami    : Display user profile & tagline
  - about     : Brief information about Pratham
  - skills    : List core technical stack
  - projects  : View featured projects
  - contact   : Display contact details & email
  - clear     : Clear terminal screen
  - exit      : Close terminal session`
    } else if (lower === 'whoami') {
      response = 'Pratham Raikar — AI & Data Science Engineer / Developer'
    } else if (lower === 'about') {
      response = 'A dedicated student passionate about technology and innovation, building real-world AI and data-driven solutions.'
    } else if (lower === 'skills') {
      response = 'Core Stack: Python, React.js, Flask, Machine Learning, Node.js, SQL, Docker, Git'
    } else if (lower === 'projects') {
      response = `Featured Projects:
  1. AI Medical Imaging Classifier (PyTorch, Flask, React)
  2. Autonomous Drone Navigation (OpenCV, ROS, C++)
  3. Smart Portfolio Dashboard (Vite, React, Node.js)`
    } else if (lower === 'contact') {
      response = 'Email: pratham@example.com | GitHub: github.com/Prathamr17 | Location: Goa, India'
    } else if (lower === 'exit') {
      onClose()
      return
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for available commands.`
    }

    newLogs.push({ type: 'response', content: response })
    setLogs(newLogs)
    setInput('')
  }

  return (
    <div className="terminal-fullscreen-overlay">
      <div className="terminal-fullscreen-container">
        {/* Terminal Fullscreen Header Bar */}
        <div className="terminal-header-bar">
          <div className="terminal-header-left">
            <span className="term-dot term-dot-red" onClick={onClose} />
            <span className="term-dot term-dot-yellow" />
            <span className="term-dot term-dot-green" />
            <span className="terminal-title-text">pratham-cli ~ bash — FULLSCREEN TERMINAL</span>
          </div>

          <div className="terminal-header-right">
            <button className="term-close-btn" onClick={onClose} title="Exit Fullscreen Terminal">✕ ESC</button>
          </div>
        </div>

        {/* Terminal Body Output Area */}
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          {logs.map((log, index) => (
            <div key={index} className={`terminal-line terminal-line-${log.type}`}>
              <pre>{log.content}</pre>
            </div>
          ))}

          {/* Prompt Form Input Line */}
          <form onSubmit={handleCommandSubmit} className="terminal-input-form">
            <span className="terminal-prompt">pratham@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type command here..."
              autoFocus
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
