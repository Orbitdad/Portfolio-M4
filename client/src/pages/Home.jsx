import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroPhoto from '../assets/hero.png'
import projMedicart from '../assets/proj-medicart.png'
import projC4 from '../assets/proj-C4.png'
import projShakti from '../assets/proj-shaktiforwarders.png'
import projWip from '../assets/WIP.png'

gsap.registerPlugin(ScrollTrigger)

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

// ── Role Cycler Component ─────────────────────────────────────────────────────
function RoleCycler() {
  const roles = ['Frontend Developer', 'MERN Stack Developer', 'Content Writer', 'Thumbnail Designer']
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setCurrent(c => (c + 1) % roles.length), 2400)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="role-cycler">
      <div className="role-cycler-inner" style={{ transform: `translateY(-${current * 36}px)` }}>
        {roles.map(r => <div className="role-item" key={r}>/ {r}</div>)}
      </div>
    </div>
  )
}

export default function Home() {
  const pageRef = useRef(null)
  const scrambleRef = useRef(null)
  const heroImgRef = useRef(null)
  const heroRef = useRef(null)
  const workRef = useRef(null)
  const ctaRef = useRef(null)
  const archivesRef = useRef(null)
  const testiRef = useRef(null)

  useScramble(scrambleRef)
  useMagnetic(pageRef)

  // Hero image wipe
  useEffect(() => {
    const t = setTimeout(() => heroImgRef.current?.classList.add('in-view'), 300)
    return () => clearTimeout(t)
  }, [])

  // ── GSAP Scroll-Driven Animations ─────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content stagger reveal on load
      gsap.from('.hero-content > *', {
        y: 60, opacity: 0, duration: 1, stagger: 0.12,
        ease: 'power3.out', delay: 0.3
      })

      // Hero headline word-by-word
      gsap.from('.hero-headline .name-word', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.08,
        ease: 'power3.out', delay: 0.5
      })

      // Ambient orbs parallax
      gsap.to('.ambient-orb--1', {
        y: -120, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      })
      gsap.to('.ambient-orb--2', {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      })

      // Hero parallax fade out on scroll
      gsap.to('.hero-content', {
        y: -60, opacity: 0.3, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '60% center', end: 'bottom top', scrub: 1 }
      })
      gsap.to('.hero-photo-wrap', {
        y: -40, scale: 0.96, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '60% center', end: 'bottom top', scrub: 1 }
      })
      
      // Hero Image Internal Parallax
      gsap.to('.hero-photo-parallax', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-photo-wrap', start: 'top bottom', end: 'bottom top', scrub: true }
      })

      // Skills marquee section reveal
      gsap.from('.clients', {
        opacity: 0, y: 30, duration: 0.8,
        scrollTrigger: { trigger: '.clients', start: 'top 85%', toggleActions: 'play none none none' }
      })

      // Work section header
      gsap.from('.work-header', {
        y: 50, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: '.work-header', start: 'top 80%', toggleActions: 'play none none none' }
      })

      // Work cards - alternating left/right reveal & Parallax images
      document.querySelectorAll('.work-card').forEach((card, i) => {
        // Card entrance animation
        gsap.from(card, {
          x: i % 2 === 0 ? -60 : 60,
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })

        // Image Parallax Effect
        const parallaxWrap = card.querySelector('.work-img-parallax')
        gsap.to(parallaxWrap, {
          yPercent: -15, // Move up by 15% of its height
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // Mid CTA - scale up reveal
      gsap.from('.mid-cta .container > *', {
        y: 60, opacity: 0, scale: 0.95, duration: 1, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.mid-cta', start: 'top 75%', toggleActions: 'play none none none' }
      })

      // Archives section
      gsap.from('.archives-text > *', {
        x: -40, opacity: 0, duration: 0.8, stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.archives', start: 'top 75%', toggleActions: 'play none none none' }
      })
      gsap.from('.archives-video', {
        x: 60, opacity: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.archives', start: 'top 75%', toggleActions: 'play none none none' }
      })

      // Testimonials header
      gsap.from('.testimonials-header > *', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.testimonials', start: 'top 80%', toggleActions: 'play none none none' }
      })

      // Testimonial cards
      document.querySelectorAll('.testi-card').forEach((card, i) => {
        gsap.from(card, {
          y: 50, opacity: 0, duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
        })
      })

      // Footer reveal
      gsap.from('.footer-top > *', {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.15,
        scrollTrigger: { trigger: 'footer', start: 'top 80%', toggleActions: 'play none none none' }
      })

      // Refresh ScrollTrigger after a short delay to account for images loading
      setTimeout(() => ScrollTrigger.refresh(), 500)
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const skills = ['HTML/CSS', 'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Git/GitHub', 'Figma', 'Canva']
  const projects = [
    { href: 'https://orbitdad.github.io/MEDICART/#/doctor/login', src: projMedicart, alt: 'Medicart', title: 'Medicart - Shree Sai Surgical', tags: ['Industry', 'Service'], progress: 85 },
    { href: 'https://github.com/Orbitdad/C4', src: projC4, alt: 'C4', title: 'C4 - Personal Assistant', tags: ['Personal Assistant', 'AI'], offset: true, progress: 60 },
    { href: 'https://shakti-forwarders-main.vercel.app/index.html', src: projShakti, alt: 'Shakti Forwarders', title: 'shakti-forwarders', tags: ['Industry', 'Service'], progress: 100 },
    { href: 'https://work-in-progress-baby.vercel.app/', src: projWip, alt: 'WIP', title: 'Project in Progress', tags: ['secret', 'secret'], offset: true, progress: 25 },
  ]

  return (
    <main ref={pageRef}>
      {/* HERO */}
      <section className="hero" ref={heroRef} id="about" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <div className="scramble-wrapper" ref={scrambleRef}>Hold tight</div>
            <h1 className="hero-headline">
              {'Adarsh Mandavkar'.split(' ').map((word, i) => (
                <span className="name-word" key={i}>{word}{i === 0 ? ' ' : ''}</span>
              ))}
              <br />[MERN Stack Developer &amp; PYTHON Friendly]
            </h1>
            <p className="bio">
              Full-stack developer focused on scalable, user-friendly web applications<br />
              Skilled in JavaScript, Node.js, and modern frontend technologies<br />
              Currently building MediCart to solve real-world business problems
            </p>
            <RoleCycler />
          </div>
          <div className="hero-photo-wrap" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
            <div className="hero-photo-parallax">
              <img ref={heroImgRef} src={heroPhoto} alt="Profile Photo" className="hero-photo" loading="lazy" />
            </div>
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
              {skills.map((s) => (
                <span key={`${n}-${s}`} style={{ display: 'contents' }}>
                  <span className="client-logo">{s}</span>
                  <span className="marquee-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section className="work" id="work" ref={workRef}>
        <div className="container">
          <div className="work-header">
            <h2 className="section-heading">Recent Work</h2>
            <div className="globe-icon">GLBE</div>
          </div>
          <div className="work-grid">
            {projects.map(({ href, src, alt, title, tags, offset, progress }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="work-card"
                data-hover="true"
                style={offset ? { marginTop: '60px' } : {}}>
                <div className="work-img-parallax">
                  <img src={src} alt={alt} className="work-img" loading="lazy" />
                </div>
                <div className="work-overlay">
                  <h3 className="work-title">{title}</h3>
                  <div className="work-tags">
                    {tags.map(t => <span className="tag-pill" key={t}>[{t}]</span>)}
                  </div>
                  <div className="work-progress">
                    <div className="work-progress-bar" style={{ '--progress': progress / 100 }} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="mid-cta" ref={ctaRef}>
        <div className="noise-bg" style={{ willChange: 'transform' }} />
        <div className="container">
          <h2>[Empowering forward-thinking brands to reach their maximum potential.]</h2>
          <div className="magnetic-wrap">
            <a href="#contact" className="btn magnetic">Start a Project</a>
          </div>
        </div>
      </section>

      {/* ARCHIVES */}
      <section className="archives" ref={archivesRef}>
        <div className="container archives-grid">
          <div className="archives-text">
            <h2 className="section-heading">Archives &amp; Experiments</h2>
            <p className="bio">A collection of concepts, interactions, and visual explorations that push boundaries.</p>
            <Link to="/journal" className="archives-link">Explore <span>→</span></Link>
          </div>
          <div className="archives-video">
            <video autoPlay loop muted playsInline>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" ref={testiRef}>
        <div className="container">
          <div className="testimonials-header">
            <div className="label" style={{ marginBottom: '16px' }}>Words of Praise</div>
            <h2 className="section-heading">Trusted By Founders</h2>
          </div>
          <div className="testi-grid">
            {[
              { quote: '"Adarsh transformed my vision into a stunning digital reality. The attention to detail and smooth communication made the whole process effortless."', name: 'Shakti Forwarders', role: 'CEO, Shakti Forwarders', img: 'https://picsum.photos/100/100?random=6' },
              { quote: '"A rare combination of incredible design taste and flawless technical execution. Delivered way ahead of schedule with zero compromises."', name: 'Shree Sai Surgical', role: 'CEO, Shree Sai Surgical', img: 'https://picsum.photos/100/100?random=7' },
            ].map(({ quote, name, role, img }) => (
              <div key={name} className="testi-card">
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
