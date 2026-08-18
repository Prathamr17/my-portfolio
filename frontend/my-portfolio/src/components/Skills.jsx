import { useEffect, useRef, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

// Default skills dataset fallback based on user's actual profile domains
const DEFAULT_USER_CATEGORIES = [
  {
    id: 1,
    name: 'FRONTEND',
    skills: [
      { id: 101, name: 'REACT', proficiency: 92, icon: 'fa-brands fa-react', color: '#61dafb' },
      { id: 102, name: 'JAVASCRIPT', proficiency: 88, icon: 'fa-brands fa-js', color: '#f7df1e' },
      { id: 103, name: 'HTML/CSS', proficiency: 90, icon: 'fa-brands fa-html5', color: '#e34f26' },
      { id: 104, name: 'VITE', proficiency: 85, icon: 'fa-solid fa-bolt', color: '#bd34fe' }
    ]
  },
  {
    id: 2,
    name: 'BACKEND',
    skills: [
      { id: 201, name: 'PYTHON', proficiency: 94, icon: 'fa-brands fa-python', color: '#3776ab' },
      { id: 202, name: 'FLASK', proficiency: 88, icon: 'fa-solid fa-server', color: '#22d3ee' },
      { id: 203, name: 'NODE.JS', proficiency: 85, icon: 'fa-brands fa-node-js', color: '#68a063' },
      { id: 204, name: 'SQL', proficiency: 86, icon: 'fa-solid fa-database', color: '#336791' }
    ]
  },
  {
    id: 3,
    name: 'AI & DATA',
    skills: [
      { id: 301, name: 'MACHINE LEARNING', proficiency: 90, icon: 'fa-solid fa-brain', color: '#7c5cff' },
      { id: 302, name: 'PANDAS', proficiency: 88, icon: 'fa-solid fa-chart-line', color: '#22d3ee' },
      { id: 303, name: 'NUMPY', proficiency: 86, icon: 'fa-solid fa-square-root-variable', color: '#34d399' },
      { id: 304, name: 'SCIKIT-LEARN', proficiency: 84, icon: 'fa-solid fa-microchip', color: '#f59e0b' }
    ]
  },
  {
    id: 4,
    name: 'TOOLS',
    skills: [
      { id: 401, name: 'GIT', proficiency: 90, icon: 'fa-brands fa-git-alt', color: '#f05032' },
      { id: 402, name: 'DOCKER', proficiency: 78, icon: 'fa-brands fa-docker', color: '#2496ed' },
      { id: 403, name: 'AWS', proficiency: 75, icon: 'fa-brands fa-aws', color: '#ff9900' },
      { id: 404, name: 'VSCODE', proficiency: 95, icon: 'fa-solid fa-code', color: '#007acc' }
    ]
  }
]

// Dynamic helper to map icon classes and colors if data comes from API without explicit icons
function resolveSkillIcon(skillName, customIcon) {
  if (customIcon) return { iconClass: customIcon, color: '#22d3ee' }
  const name = (skillName || '').toUpperCase()
  if (name.includes('REACT')) return { iconClass: 'fa-brands fa-react', color: '#61dafb' }
  if (name.includes('PYTHON')) return { iconClass: 'fa-brands fa-python', color: '#3776ab' }
  if (name.includes('JAVA')) return { iconClass: 'fa-brands fa-java', color: '#5382a1' }
  if (name.includes('NODE')) return { iconClass: 'fa-brands fa-node-js', color: '#68a063' }
  if (name.includes('JS') || name.includes('JAVASCRIPT')) return { iconClass: 'fa-brands fa-js', color: '#f7df1e' }
  if (name.includes('HTML') || name.includes('CSS')) return { iconClass: 'fa-brands fa-html5', color: '#e34f26' }
  if (name.includes('FLASK') || name.includes('FASTAPI')) return { iconClass: 'fa-solid fa-server', color: '#22d3ee' }
  if (name.includes('SQL') || name.includes('POSTGRES') || name.includes('MONGO')) return { iconClass: 'fa-solid fa-database', color: '#336791' }
  if (name.includes('GIT')) return { iconClass: 'fa-brands fa-git-alt', color: '#f05032' }
  if (name.includes('DOCKER')) return { iconClass: 'fa-brands fa-docker', color: '#2496ed' }
  if (name.includes('AWS')) return { iconClass: 'fa-brands fa-aws', color: '#ff9900' }
  if (name.includes('LEARNING') || name.includes('AI') || name.includes('ML')) return { iconClass: 'fa-solid fa-brain', color: '#7c5cff' }
  return { iconClass: 'fa-solid fa-code', color: '#22d3ee' }
}

export default function Skills() {
  const { data: rawCategories, loading } = useFetch('/public/skills')
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const categories = Array.isArray(rawCategories) && rawCategories.length > 0
    ? rawCategories
    : DEFAULT_USER_CATEGORIES

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Overall radar data
  const overallRadarData = categories.map(cat => {
    const skillsArr = cat.skills || []
    const avgScore = skillsArr.length > 0
      ? Math.round(skillsArr.reduce((acc, s) => acc + (s.proficiency || 80), 0) / skillsArr.length)
      : 80
    return {
      subject: (cat.name || 'Skill').toUpperCase(),
      score: avgScore,
      fullMark: 100
    }
  })

  // Hovered category radar data
  const hoveredRadarData = hoveredCategory?.skills
    ? hoveredCategory.skills.map(s => ({
        subject: (s.name || 'Skill').toUpperCase(),
        score: s.proficiency || 80,
        fullMark: 100
      }))
    : []

  const activeRadarData = hoveredCategory ? hoveredRadarData : overallRadarData

  if (loading) return (
    <section className="section section-alt" id="skills" ref={sectionRef}>
      <div className="container">
        <div className="loading-center"><div className="spinner" /></div>
      </div>
    </section>
  )

  return (
    <section className={`section section-alt grid-bg ${isVisible ? 'reveal-in' : ''}`} id="skills" ref={sectionRef}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-eyebrow">skills</div>
        <h2 className="section-title">Skills &amp; Expertise</h2>
        <p className="section-sub">Technical proficiency and domain stack blueprint.</p>

        <div className="skills-wireframe-layout">
          {/* Radar Chart Column */}
          <div className="skills-radar-col">
            <div className="skills-radar-card">
              <h3 className="skills-radar-title">
                {hoveredCategory ? `Skill Matrix (${(hoveredCategory.name || '').toUpperCase()})` : 'Skill Matrix (Overall)'}
              </h3>
              <div className="skills-radar-chart-wrapper" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeRadarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#22d3ee', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                      axisLine={false}
                    />
                    <Radar
                      name="Proficiency"
                      dataKey="score"
                      stroke={hoveredCategory ? '#22d3ee' : '#7c5cff'}
                      fill={hoveredCategory ? '#22d3ee' : '#7c5cff'}
                      fillOpacity={0.5}
                      isAnimationActive={true}
                      animationDuration={400}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Categorized Skills Grid using User's Parameters with Compact Tile Cards */}
          <div className="skills-mockup-grid">
            {categories.map((cat, catIdx) => (
              <div
                key={cat.id || catIdx}
                className={`skill-domain-card ${hoveredCategory?.id === cat.id ? 'active-hover' : ''}`}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="skill-domain-header">
                  <span className="blue-bar">|</span>
                  <span className="domain-title">{(cat.name || '').toUpperCase()}</span>
                </div>

                <div className="skill-badges-flex">
                  {cat.skills?.map((skill, skillIdx) => {
                    const resolved = resolveSkillIcon(skill.name, skill.icon)
                    return (
                      <div key={skill.id || skillIdx} className="skill-tile-card compact-tile">
                        <div className="skill-tile-icon" style={{ color: skill.color || resolved.color }}>
                          <i className={skill.icon || resolved.iconClass} />
                        </div>
                        <span className="skill-tile-name">{(skill.name || '').toUpperCase()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}