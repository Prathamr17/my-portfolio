import Navbar from '../components/Navbar'
import FloatingNavbar from '../components/FloatingNavbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Internship from '../components/Internship'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Internship />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
      <FloatingNavbar />
    </>
  )
}
