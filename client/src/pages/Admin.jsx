import { useState } from 'react'
import API_BASE from '../api'

function todayFormatted() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Admin() {
  const [form, setForm] = useState({ text: '', imageUrl: '', date: todayFormatted(), password: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [message, setMessage] = useState('')

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.text && !form.imageUrl) {
      setStatus('error'); setMessage('Add some text or an image URL.'); return
    }
    setStatus('submitting')
    try {
      const res = await fetch(`${API_BASE}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': form.password },
        body: JSON.stringify({ text: form.text, imageUrl: form.imageUrl, date: form.date }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('Report published successfully! ✅')
        setForm({ text: '', imageUrl: '', date: todayFormatted(), password: form.password })
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not reach the server. Is it running?')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="label">Admin — Private</div>
          <h1>Write a Report</h1>
          <p>This page is not linked anywhere. Only you know it exists.</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="form-group">
            <label>Date (editable)</label>
            <input
              type="text"
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g. 03 May 2026"
            />
          </div>

          {/* Text */}
          <div className="form-group">
            <label>What happened today?</label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder="Write your daily report here..."
              style={{ minHeight: 240 }}
            />
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* Image Preview */}
          {form.imageUrl && (
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={form.imageUrl} alt="Preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your secret password"
              required
            />
          </div>

          <div className="admin-actions">
            <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Publishing...' : 'Publish Report'}
            </button>
          </div>

          {(status === 'success' || status === 'error') && (
            <div className={`admin-feedback ${status === 'success' ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
