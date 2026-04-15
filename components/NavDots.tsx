'use client'

import { useEffect, useState } from 'react'

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'skills', 'contact']

export default function NavDots() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="hidden flex-col gap-3 md:flex"
      style={{
        position: 'fixed',
        right: 'max(12px, env(safe-area-inset-right, 0px))',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
      aria-label="Section navigation"
    >
      {SECTIONS.map((id) => (
        <button
          key={id}
          type="button"
          className={`nav-dot${active === id ? ' active' : ''}`}
          data-section={id}
          data-cursor="link"
          onClick={() => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-label={`Go to ${id}`}
          style={{ border: 'none', padding: 0, height: '6px' }}
        />
      ))}
    </div>
  )
}
