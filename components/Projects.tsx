'use client'

import { memo, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useTextScramble } from '@/lib/use-text-scramble'
import SpotlightCard from '@/components/ui/SpotlightCard'
import MagneticButton from '@/components/ui/MagneticButton'

const PROJECTS = [
  {
    id: '01',
    title: 'Vasudhar',
    subtitle: 'Climate Sustainability App',
    period: 'Jun 2024 – Mar 2025',
    impact: '40% increase in daily active users',
    description:
      'Climate sustainability app using fine-tuned LLMs to analyze carbon habits, built with React Native + Django.',
    stack: ['Generative AI', 'Python', 'React Native', 'Django', 'Docker', 'LLMs'],
    links: [
      { label: 'VIEW CODE', href: 'https://github.com/Anshul2405/Vasudhar' },
      { label: 'LIVE DEMO', href: 'https://github.com/Anshul2405/Vasudhar' },
    ],
  },
  {
    id: '02',
    title: 'KCC Infra ERP',
    subtitle: 'Digital Twin & ERP System',
    period: 'Oct 2025 – Present',
    impact: '15% material wastage reduction',
    description:
      'Full-stack ERP with Digital Twin architecture for real-time construction site resource tracking on AWS.',
    stack: ['React', 'Node.js', 'AWS', 'Docker', 'Digital Twin', 'Kubernetes'],
    links: [{ label: 'PRIVATE BUILD', href: '' }],
  },
  {
    id: '03',
    title: 'SitePulse',
    subtitle: 'Industrial Monitoring System',
    period: 'Pinned on GitHub',
    impact: 'Real-time industrial machine monitoring system',
    description:
      'Industrial monitoring system with Python telemetry console for real-time machine workflow visibility.',
    stack: ['Python', 'Rich', 'Monitoring', 'Industrial Systems', 'Realtime'],
    links: [{ label: 'VIEW CODE', href: 'https://github.com/Anshul2405/SitePulse' }],
  },
]

function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useTextScramble(labelRef, 'PROJECTS')

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return

        gsap.fromTo(
          card,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.35, y: 50 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
            },
          }
        )
      })
    }, section)

    return () => ctx.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-[var(--black)]"
      style={{ padding: '120px 0' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(200,169,110,0.12),transparent_28%)]" />

      <div style={{ width: '100%', position: 'relative', padding: '0 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <p
            ref={labelRef}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.4em',
              color: '#C9A84C',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{
              width: '4px',
              height: '4px',
              background: '#C9A84C',
              display: 'inline-block',
              flexShrink: 0,
            }} />
            PROJECTS
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
            color: 'var(--white)',
            maxWidth: '600px',
          }}>
            Projects engineered for impact, not just aesthetics.
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            lineHeight: 1.9,
            color: 'rgba(238,238,232,0.68)',
            maxWidth: '660px',
            marginTop: '24px',
          }}>
            A portfolio of AI products, industrial platforms, and business software built around adoption,
            efficiency, and production reliability.
          </p>
        </div>

        {/* Project rows */}
        <div>
          {PROJECTS.map((project, index) => (
            <SpotlightCard key={project.id}>
              <article
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gold separator */}
                <div style={{
                  width: '100%',
                  height: '1px',
                  background: 'rgba(201,168,76,0.2)',
                }} />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.4fr',
                  padding: '48px 0',
                  gap: '0',
                }}>
                  {/* Left */}
                  <div style={{ position: 'relative' }}>
                    {(() => {
                      const years = project.period.match(/20\d{2}/g)
                      if (!years) return null
                      return (
                        <span style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'rgba(201,168,76,0.3)',
                        }}>
                          &apos;{years[years.length - 1].slice(2)}
                        </span>
                      )
                    })()}
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                    }}>
                      {project.id}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '2.8rem',
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: hoveredIndex === index ? '#C9A84C' : 'var(--white)',
                      marginBottom: '12px',
                      transition: 'color 0.3s ease',
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: '#C9A84C',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                    }}>
                      {project.subtitle}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--muted)',
                      marginBottom: '20px',
                    }}>
                      {project.period}
                    </p>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#6B6860',
                      display: 'block',
                    }}>
                      {project.stack.join(' · ')}
                    </span>
                  </div>

                  {/* Right */}
                  <div style={{
                    paddingLeft: '96px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    {/* Impact stat */}
                    <div style={{ position: 'relative', paddingLeft: '14px', marginBottom: '20px' }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '2px',
                        background: '#C9A84C',
                        height: hoveredIndex === index ? '100%' : '0%',
                        transition: 'height 0.3s ease',
                      }} />
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: '#E8E6E0',
                        lineHeight: 1.5,
                      }}>
                        {project.impact}
                      </p>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      maxWidth: '480px',
                      marginBottom: '24px',
                    }}>
                      {project.description}
                    </p>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {project.links.map((link) =>
                        link.href ? (
                          <MagneticButton
                            key={link.label}
                            href={link.href}
                            style={{ padding: '8px 20px', fontSize: '11px' }}
                          >
                            {link.label} →
                          </MagneticButton>
                        ) : (
                          <span
                            key={link.label}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              letterSpacing: '0.15em',
                              color: 'var(--muted)',
                            }}
                          >
                            {link.label}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          ))}
          {/* Final gold line */}
          <div style={{
            width: '100%',
            height: '1px',
            background: 'rgba(201,168,76,0.2)',
          }} />
        </div>
      </div>
    </section>
  )
}
export default memo(Projects)
