import { useState } from 'react'
import Navbar from '../components/Navbar'
import FloatingNavbar from '../components/FloatingNavbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Internship from '../components/Internship'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useFetch } from '../hooks/useFetch'

export default function Home() {
  // Prefetch all public data in 1 single unified HTTP request
  useFetch('/public/all')

  const [navVisible, setNavVisible] = useState(() => {
    return localStorage.getItem('nav_visible') !== 'false'
  })

  useScrollReveal('.reveal-on-scroll, .section')

  const toggleNav = () => {
    setNavVisible(prev => {
      const next = !prev
      localStorage.setItem('nav_visible', String(next))
      return next
    })
  }

  return (
    <>
      <Navbar navVisible={navVisible} />
      <div className="reveal-on-scroll"><Hero /></div>
      <div className="reveal-on-scroll"><About /></div>
      <div className="reveal-on-scroll"><Internship /></div>
      <div className="reveal-on-scroll"><Projects /></div>
      <div className="reveal-on-scroll"><Skills /></div>
      <div className="reveal-on-scroll"><Contact /></div>
      <Footer />
      <FloatingNavbar navVisible={navVisible} onToggleNav={toggleNav} />
    </>
  )
}
