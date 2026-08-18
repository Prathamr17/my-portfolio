import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useFetch } from '../hooks/useFetch'

export default function Contact() {
  const { data: about } = useFetch('/public/about')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSending(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! Pratham will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-eyebrow">~connect</div>
        <h2 className="section-title">Lets Connect!</h2>
        <p className="section-sub">
          Open to collaborations, internships, and project inquiries. Let's discuss building something great.
        </p>

        <div className="contact-wireframe-grid">
          {/* Left Column: 4 Stacked Info Cards */}
          <div className="contact-info-cards-col">
            <a href={about?.email ? `mailto:${about.email}` : '#'} className="contact-info-card card">
              <div className="contact-card-icon"><i className="fa-solid fa-envelope" /></div>
              <div className="contact-card-text">
                <span className="contact-card-label">EMAIL</span>
                <span className="contact-card-value">{about?.email || 'pratham@example.com'}</span>
              </div>
            </a>

            <div className="contact-info-card card">
              <div className="contact-card-icon"><i className="fa-solid fa-phone" /></div>
              <div className="contact-card-text">
                <span className="contact-card-label">PHONE</span>
                <span className="contact-card-value">{about?.phone || '+91 9876543210'}</span>
              </div>
            </div>

            <a href={about?.linkedin_url || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="contact-info-card card">
              <div className="contact-card-icon"><i className="fab fa-linkedin-in" /></div>
              <div className="contact-card-text">
                <span className="contact-card-label">LINKEDIN</span>
                <span className="contact-card-value">linkedin.com/in/pratham</span>
              </div>
            </a>

            <a href={about?.github_url || 'https://github.com'} target="_blank" rel="noreferrer" className="contact-info-card card">
              <div className="contact-card-icon"><i className="fab fa-github" /></div>
              <div className="contact-card-text">
                <span className="contact-card-label">GITHUB</span>
                <span className="contact-card-value">github.com/Prathamr17</span>
              </div>
            </a>
          </div>

          {/* Right Column: Contact Form Box */}
          <div className="contact-form-container card">
            <form onSubmit={handleSubmit} className="contact-form-wireframe">
              <div className="form-row-wireframe">
                <div className="form-group-wireframe">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name *"
                    required
                  />
                </div>
                <div className="form-group-wireframe">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email *"
                    required
                  />
                </div>
              </div>

              <div className="form-group-wireframe">
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
              </div>

              <div className="form-group-wireframe">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn-wireframe btn-submit-wireframe" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
