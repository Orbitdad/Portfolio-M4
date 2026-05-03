import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-top animate-up">
          <h2>Let's create something Better, Together</h2>
          <div className="magnetic-wrap">
            <Link to="/contact" className="btn" style={{ fontSize: '16px', padding: '18px 36px' }}>Book a call</Link>
          </div>
        </div>
        <div className="footer-bottom animate-up" style={{ transitionDelay: '0.2s' }}>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Adarsh Suresh Mandavkar. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/adarsh-mandavkar-03b55331a/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/Orbitdad" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://x.com/mr_mandavkarjr" target="_blank" rel="noreferrer">Twitter</a>
          </div>
          <div className="location-contact">
            [Mumbai, India] &nbsp;·&nbsp;
            <a href="mailto:mandavkaradarsh2005@gmail.com">[mandavkaradarsh2005@gmail.com]</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
