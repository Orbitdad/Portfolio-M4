import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import heroPhoto from '../assets/hero.png'
import projMedicart from '../assets/proj-medicart.png'
import projC4 from '../assets/proj-C4.png'
import projShakti from '../assets/proj-shaktiforwarders.png'
import projWip from '../assets/WIP.png'

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-up')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── Scramble Hook ─────────────────────────────────────────────────────────────
function useScramble(elRef) {
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    const states = ['Hold tight', 'Hi there!']
    let idx = 0

    function scramble(target, duration) {
      let start = null
      const step = (ts) => {
        if (!start) start = ts
        const prog = ts - start
        el.innerText = target.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          return prog > (duration / target.length) * i ? ch : chars[Math.floor(Math.random() * chars.length)]
        }).join('')
        if (prog < duration) requestAnimationFrame(step)
        else el.innerText = target
      }
      requestAnimationFrame(step)
    }

    const interval = setInterval(() => { idx = (idx + 1) % states.length; scramble(states[idx], 800) }, 2800)
    setTimeout(() => scramble(states[0], 800), 500)
    return () => clearInterval(interval)
  }, [elRef])
}

// ── Magnetic Hook ─────────────────────────────────────────────────────────────
function useMagnetic(containerRef) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const btns = container.querySelectorAll('.magnetic')
    const handlers = []
    btns.forEach(btn => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect()
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.22}px)`
      }
      const onLeave = () => { btn.style.transform = 'translate(0,0)' }
      btn.addEventListener('mousemove', onMove)
      btn.addEventListener('mouseleave', onLeave)
      handlers.push({ btn, onMove, onLeave })
    })
    return () => handlers.forEach(({ btn, onMove, onLeave }) => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    })
  }, [containerRef])
}

export default function Home() {
  const pageRef = useRef(null)
  const scrambleRef = useRef(null)
  const heroImgRef = useRef(null)

  useScrollReveal()
  useScramble(scrambleRef)
  useMagnetic(pageRef)

  // Hero image wipe
  useEffect(() => {
    const t = setTimeout(() => heroImgRef.current?.classList.add('in-view'), 300)
    return () => clearTimeout(t)
  }, [])

  // Scroll parallax
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-parallax')
    const onScroll = () => {
      const y = window.scrollY
      els.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const skills = ['HTML/CSS', 'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Git/GitHub', 'Figma', 'Canva']
  const projects = [
    { href: 'https://orbitdad.github.io/MEDICART/#/doctor/login', src: projMedicart, alt: 'Medicart', title: 'Medicart - Shree Sai Surgical', tags: ['Industry', 'Service'] },
    { href: 'https://github.com/Orbitdad/C4', src: projC4, alt: 'C4', title: 'C4 - Personal Assistant', tags: ['Personal Assistant', 'AI'], offset: true },
    { href: 'https://shakti-forwarders-main.vercel.app/index.html', src: projShakti, alt: 'Shakti Forwarders', title: 'shakti-forwarders', tags: ['Industry', 'Service'] },
    { href: 'https://work-in-progress-baby.vercel.app/', src: projWip, alt: 'WIP', title: 'Project in Progress', tags: ['secret', 'secret'], offset: true },
  ]

  return (
    <main ref={pageRef}>
      {/* HERO */}
      <section className="hero" id="about" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="scroll-parallax" data-speed="0.35" style={{ position: 'absolute', top: '-15%', left: '-10%', width: '120%', height: '130%', background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.04) 0%, transparent 50%)', zIndex: 0, pointerEvents: 'none', willChange: 'transform' }} />
        <div className="scroll-parallax" data-speed="0.15" style={{ position: 'absolute', top: '25%', right: '15%', zIndex: 1, willChange: 'transform' }}>
          <div className="tag-pill" style={{ border: '1px solid var(--border)' }}>Creative</div>
        </div>
        <div className="scroll-parallax" data-speed="0.25" style={{ position: 'absolute', bottom: '20%', left: '8%', zIndex: 1, willChange: 'transform' }}>
          <div className="tag-pill" style={{ border: '1px solid var(--border)' }}>Digital</div>
        </div>
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <div className="scramble-wrapper" ref={scrambleRef}>Hold tight</div>
            <h1 className="hero-headline animate-up">Adarsh Mandavkar<br />[MERN Stack Developer &amp; PYTHON Friendly]</h1>
            <p className="bio animate-up" style={{ transitionDelay: '0.1s' }}>
              Full-stack developer focused on scalable, user-friendly web applications<br />
              Skilled in JavaScript, Node.js, and modern frontend technologies<br />
              Currently building MediCart to solve real-world business problems
            </p>
            <div className="services-list">
              {['/ Frontend Developer', '/ MERN Stack Developer', '/ Content Writer', '/ Thumbnail Designer'].map((s, i) => (
                <div key={s} className="service-line animate-up" style={{ transitionDelay: `${0.12 * i}s` }}>{s}</div>
              ))}
            </div>
          </div>
          <div className="hero-photo-wrap" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
            <img ref={heroImgRef} src={heroPhoto} alt="Profile Photo" className="hero-photo" loading="lazy" />
          </div>
        </div>
        <div className="scroll-indicator" style={{ zIndex: 2 }} />
      </section>

      {/* SKILLS MARQUEE */}
      <section className="clients">
        <div className="container"><div className="label">what I know</div></div>
        <div className="marquee">
          {[0, 1].map(n => (
            <div className="marquee-content" key={n}>
              {skills.map(s => <span className="client-logo" key={s}>{s}</span>)}
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section className="work" id="work">
        <div className="container">
          <div className="work-header animate-up">
            <h2 className="section-heading">Recent Work</h2>
            <div className="globe-icon">GLBE</div>
          </div>
          <div className="work-grid">
            {projects.map(({ href, src, alt, title, tags, offset }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="work-card animate-up"
                style={offset ? { transitionDelay: '0.15s', marginTop: '60px' } : {}}>
                <img src={src} alt={alt} className="work-img" loading="lazy" />
                <div className="work-overlay">
                  <h3 className="work-title">{title}</h3>
                  <div className="work-tags">
                    {tags.map(t => <span className="tag-pill" key={t}>[{t}]</span>)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="mid-cta animate-up">
        <div className="noise-bg scroll-parallax" data-speed="0.2" style={{ height: '150%', top: '-25%', willChange: 'transform' }} />
        <div className="container">
          <h2>[Empowering forward-thinking brands to reach their maximum potential.]</h2>
          <div className="magnetic-wrap">
            <a href="#contact" className="btn magnetic">Start a Project</a>
          </div>
        </div>
      </section>

      {/* ARCHIVES */}
      <section className="archives">
        <div className="container archives-grid">
          <div className="archives-text animate-up">
            <h2 className="section-heading">Archives &amp; Experiments</h2>
            <p className="bio">A collection of concepts, interactions, and visual explorations that push boundaries.</p>
            <Link to="/journal" className="archives-link">Explore <span>→</span></Link>
          </div>
          <div className="archives-video animate-up" style={{ transitionDelay: '0.2s' }}>
            <video autoPlay loop muted playsInline>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-header animate-up">
            <div className="label" style={{ marginBottom: '16px' }}>Words of Praise</div>
            <h2 className="section-heading">Trusted By Founders</h2>
          </div>
          <div className="testi-grid">
            {[
              { quote: '"Adarsh transformed my vision into a stunning digital reality. The attention to detail and smooth communication made the whole process effortless."', name: 'Shakti Forwarders', role: 'CEO, Shakti Forwarders', img: 'https://picsum.photos/100/100?random=6' },
              { quote: '"A rare combination of incredible design taste and flawless technical execution. Delivered way ahead of schedule with zero compromises."', name: 'Shree Sai Surgical', role: 'CEO, Shree Sai Surgical', img: 'https://picsum.photos/100/100?random=7', delay: '0.1s' },
            ].map(({ quote, name, role, img, delay }) => (
              <div key={name} className="testi-card animate-up" style={delay ? { transitionDelay: delay } : {}}>
                <p className="testi-quote">{quote}</p>
                <div className="testi-author">
                  <img src={img} alt={name} className="author-img" loading="lazy" />
                  <div className="author-info"><h4>{name}</h4><p>{role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
