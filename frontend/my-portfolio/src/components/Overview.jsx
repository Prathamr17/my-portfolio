import { useFetch } from '../hooks/useFetch'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const ICONS = {
  projects: 'fa-solid fa-diagram-project',
  certificates: 'fa-solid fa-certificate',
  platforms: 'fa-solid fa-layer-group',
  internships: 'fa-solid fa-briefcase',
}
const COLORS = ['#7c5cff', '#22d3ee', '#34d399', '#f59e0b']

export default function Overview() {
  const { data: stats, loading } = useFetch('/public/stats')
  if (loading || !stats) return null

  const chartData = [
    { name: 'Projects', value: stats.projects },
    { name: 'Certs', value: stats.certificates },
    { name: 'Platforms', value: stats.platforms },
    { name: 'Internships', value: stats.internships },
  ]

  return (
    <section className="overview-section">
      <div className="container">
        <div className="kpi-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon"><i className={ICONS[key] || 'fa-solid fa-chart-simple'} /></div>
                <span className="kpi-trend">live</span>
              </div>
              <div className="kpi-value">{value}</div>
              <div className="kpi-label">{key}</div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ marginTop: 20 }}>
          <div className="panel-title">portfolio_overview.chart</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9a9ba8', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#12141c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#f5f5f7' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
