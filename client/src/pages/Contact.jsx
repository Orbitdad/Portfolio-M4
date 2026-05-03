import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const data = new FormData(form)
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) { setStatus('success'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div className="contact-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Let's Talk</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>
            Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you.
          </p>
        </div>

        {status === 'success' ? (
          <div className="admin-feedback success">
            Thank you! Your message has been sent. I'll be in touch soon. 🚀
          </div>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="6e1e7cff-5099-4baf-8024-6780cd48e783" />
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" required placeholder="Tell me about your project..." />
            </div>
            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              <Link to="/" className="btn">Go Back</Link>
            </div>
            {status === 'error' && (
              <div className="admin-feedback error">Something went wrong. Please try again.</div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
