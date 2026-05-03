import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    // Entrance animation
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1
      })
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav ref={navRef} className={`sticky-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="logo">Adarsh Mandavkar</Link>
          <div className="nav-links">
            <NavLink to="/" end className="nav-link">Home</NavLink>
            <NavLink to="/journal" className="nav-link">Journal</NavLink>
            <NavLink to="/#work" className="nav-link">Work</NavLink>
            <div className="magnetic-wrap">
              <Link to="/contact" className="btn">Let's Talk</Link>
            </div>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}>
        <ul className="mobile-nav-list">
          {[['/', '01', 'Home'], ['/journal', '02', 'Journal'], ['/#work', '03', 'Work'], ['/contact', '04', 'Contact']].map(([href, num, label]) => (
            <li className="mobile-nav-item" key={href}>
              <Link to={href} className="mobile-nav-link" onClick={closeMenu}>
                <span>{num}</span>{label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-socials">
          <a href="https://www.linkedin.com/in/adarsh-mandavkar-03b55331a/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Orbitdad" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://x.com/mr_mandavkarjr" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </div>
    </>
  )
}
