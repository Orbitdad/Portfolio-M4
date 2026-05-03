import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const mouseX = useRef(window.innerWidth / 2)
  const mouseY = useRef(window.innerHeight / 2)
  const curX = useRef(mouseX.current)
  const curY = useRef(mouseY.current)
  const ringX = useRef(mouseX.current)
  const ringY = useRef(mouseY.current)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const label = labelRef.current
    const onMove = (e) => { mouseX.current = e.clientX; mouseY.current = e.clientY }
    document.addEventListener('mousemove', onMove)

    let raf
    const render = () => {
      curX.current += (mouseX.current - curX.current) * 0.15
      curY.current += (mouseY.current - curY.current) * 0.15
      ringX.current += (mouseX.current - ringX.current) * 0.08
      ringY.current += (mouseY.current - ringY.current) * 0.08
      cursor.style.transform = `translate(${curX.current}px, ${curY.current}px)`
      ring.style.transform = `translate(${ringX.current}px, ${ringY.current}px)`
      label.style.transform = `translate(${ringX.current}px, ${ringY.current - 32}px)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const addHover = (e) => {
      const target = e.target.closest('a, button, input, textarea, [data-hover]')
      if (target) {
        cursor.classList.add('hovered')
        ring.classList.add('hovered')
        if (target.closest('.work-card')) {
          label.classList.add('visible')
          label.textContent = 'View'
        }
      }
    }
    const removeHover = (e) => {
      const target = e.target.closest('a, button, input, textarea, [data-hover]')
      if (target) {
        cursor.classList.remove('hovered')
        ring.classList.remove('hovered')
        label.classList.remove('visible')
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

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-label" ref={labelRef} />
    </>
  )
}
