import { useState, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import API_BASE from '../api'

gsap.registerPlugin(ScrollTrigger)

function parseDate(dateStr) {
  // Try to extract day/month/year for big display
  const parts = dateStr.split(' ')
  if (parts.length >= 2) {
    const day = parts[0]
    const rest = parts.slice(1).join(' ')
    return { day, rest }
  }
  return { day: dateStr, rest: '' }
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton-block" style={{ width: 60, height: 60 }} />
        <div className="skeleton-block" style={{ width: 100, height: 14 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton-block" style={{ width: '30%', height: 12 }} />
        <div className="skeleton-block" style={{ width: '100%', height: 16 }} />
        <div className="skeleton-block" style={{ width: '85%', height: 16 }} />
        <div className="skeleton-block" style={{ width: '70%', height: 16 }} />
      </div>
    </div>
  )
}

export default function Journal() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/blogs`)
      .then(r => r.json())
      .then(data => { setBlogs(data); setLoading(false) })
      .catch(() => { setError('Could not load posts.'); setLoading(false) })
  }, [])

  // Scroll reveal
  useEffect(() => {
    if (loading) return
    const els = document.querySelectorAll('.animate-up')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [loading, blogs])

  // Parallax for journal images
  useLayoutEffect(() => {
    if (loading || blogs.length === 0) return
    const ctx = gsap.context(() => {
      document.querySelectorAll('.report-image').forEach(container => {
        const parallax = container.querySelector('.report-image-parallax')
        if (parallax) {
          gsap.to(parallax, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          })
        }
      })
      setTimeout(() => ScrollTrigger.refresh(), 500)
    })
    return () => ctx.revert()
  }, [loading, blogs])

  return (
    <main>
      {/* HERO */}
      <section className="journal-hero">
        <div className="container">
          <div className="label">Daily Report</div>
          <h1 className="animate-up">Field Notes</h1>
          <p className="animate-up" style={{ transitionDelay: '0.1s' }}>
            Raw thoughts, project updates, and daily reflections — unfiltered.
          </p>
        </div>
      </section>

      {/* FEED */}
      <section className="journal-feed">
        <div className="container">
          {loading && (
            <div className="journal-grid">
              {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
            </div>
          )}

          {error && (
            <div className="journal-empty">
              <h3>Can't connect to server</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div className="journal-empty">
              <h3>No entries yet.</h3>
              <p>Check back soon — the first report is incoming.</p>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <div className="journal-grid">
              {blogs.map((blog, i) => {
                const { day, rest } = parseDate(blog.date)
                return (
                  <div key={blog._id} className="report-card animate-up" style={{ transitionDelay: `${i * 0.06}s` }}>
                    <div className="report-card-inner">
                      {/* Date Column */}
                      <div className="report-date-col">
                        <div className="report-day">{day}</div>
                        <div className="report-month-year">{rest}</div>
                      </div>

                      <div className="report-body">
                        <div className="report-label">Entry #{blogs.length - i}</div>
                        {blog.text && <p className="report-text">{blog.text}</p>}
                        {blog.imageUrl && (
                          <div className="report-image">
                            <div className="report-image-parallax">
                              <img src={blog.imageUrl} alt="Blog" loading="lazy" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
