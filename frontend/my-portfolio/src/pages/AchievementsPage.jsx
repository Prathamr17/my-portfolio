import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Platforms from '../components/Platforms'
import Certificates from '../components/Certificates'
import Achievements from '../components/Achievements'
import Footer from '../components/Footer'

export default function AchievementsPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <section className="section section-alt grid-bg" style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>achievements</div>
            <h1 className="section-title">Milestones &amp; Recognition</h1>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Key metrics, coding-platform performance, and verified certifications.
            </p>
          </div>
        </section>

        <Achievements />
        <Platforms />
        <Certificates />
      </div>
      <Footer />
    </>
  )
}
