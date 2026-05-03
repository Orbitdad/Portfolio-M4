import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const mouseX = useRef(window.innerWidth / 2)
  const mouseY = useRef(window.innerHeight / 2)
  const curX = useRef(mouseX.current)
  const curY = useRef(mouseY.current)

  useEffect(() => {
    const cursor = cursorRef.current
    const onMove = (e) => { mouseX.current = e.clientX; mouseY.current = e.clientY }
    document.addEventListener('mousemove', onMove)

    let raf
    const render = () => {
      curX.current += (mouseX.current - curX.current) * 0.15
      curY.current += (mouseY.current - curY.current) * 0.15
      cursor.style.transform = `translate(${curX.current}px, ${curY.current}px)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const addHover = (e) => {
      if (e.target.closest('a, button, input, textarea, [data-hover]')) {
        cursor.classList.add('hovered')
      }
    }
    const removeHover = (e) => {
      if (e.target.closest('a, button, input, textarea, [data-hover]')) {
        cursor.classList.remove('hovered')
      }
    }
    document.addEventListener('mouseover', addHover)
    document.addEventListener('mouseout', removeHover)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', addHover)
      document.removeEventListener('mouseout', removeHover)
    }
  }, [])

  return <div className="custom-cursor" ref={cursorRef} />
}
