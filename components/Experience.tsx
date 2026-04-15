'use client'

import { memo, useLayoutEffect, useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useTextScramble } from '@/lib/use-text-scramble'

const CHAPTERS = [
  {
    chapter: 'CHAPTER 01',
    company: 'KCC INFRA',
    shortCompany: 'KCC INFRA',
    role: 'Full-Stack Engineer & Lead',
    period: 'OCT 2025 – PRESENT',
    impact: '15% material waste reduced',
    logo: 'KC',
    description:
      'Led end-to-end development of an ERP and Digital Twin system for infrastructure management. Reduced material waste by 15%, deployed on AWS, managed a team of 4.',
    stack: ['React', 'Node', 'AWS', 'Docker', 'Digital Twin'],
  },
  {
    chapter: 'CHAPTER 02',
    company: 'FINANALYZ PVT. LTD',
    shortCompany: 'FINANALYZ',
    role: 'Power BI Intern',
    period: 'JAN 2024 – MAR 2024',
    impact: '30% reporting time cut',
    logo: 'FN',
    description:
      'Built 10+ Power BI dashboards with SQL and DAX automation, cutting manual reporting time by 30%.',
    stack: ['Power BI', 'SQL', 'DAX', 'Excel', 'Python'],
  },
  {
    chapter: 'CHAPTER 03',
    company: 'RADICALX',
    shortCompany: 'RADICALX',
    role: 'AI Engineer Intern',
    period: 'NOV 2023 – DEC 2023',
    impact: '20% engagement increase',
    logo: 'RX',
    description:
      'Developed NLP recommendation models using TensorFlow and PyTorch, improving user engagement by 20%.',
    stack: ['Python', 'TensorFlow', 'PyTorch', 'REST APIs'],
  },
]

function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const ambientRef = useRef<HTMLDivElement>(null)
  const leftRevealRef = useRef<HTMLDivElement>(null)
  const leftStickyRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const timelineProgressRef = useRef<HTMLDivElement>(null)
  const timelineDotRefs = useRef<(HTMLDivElement | null)[]>([])
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])
  const logoRefs = useRef<(HTMLDivElement | null)[]>([])
  const companyRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const impactRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const shimmerRefs = useRef<(HTMLDivElement | null)[]>([])

  useTextScramble(labelRef, '03 / EXPERIENCE')

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const entries = entryRefs.current.filter(Boolean)
      if (!entries.length) return

      const leftSticky = leftStickyRef.current
      const ghost = ghostRef.current
      const timelineProgress = timelineProgressRef.current
      const ambient = ambientRef.current
      const leftReveal = leftRevealRef.current
      const dots = timelineDotRefs.current.filter(Boolean) as HTMLDivElement[]
      const logos = logoRefs.current.filter(Boolean) as HTMLDivElement[]
      const companies = companyRefs.current.filter(Boolean) as HTMLHeadingElement[]
      const impacts = impactRefs.current.filter(Boolean) as HTMLParagraphElement[]

      gsap.fromTo(
        entries,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
          },
        }
      )

      if (leftSticky) {
        gsap.to(leftSticky, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (ghost) {
        gsap.to(ghost, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (timelineProgress) {
        gsap.fromTo(
          timelineProgress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'bottom 35%',
              scrub: true,
            },
          }
        )
      }

      if (ambient) {
        gsap.to(ambient, {
          opacity: 0.82,
          duration: 4.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        gsap.to(ambient, {
          xPercent: 3,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (leftReveal) {
        const revealNodes = Array.from(leftReveal.children)
        gsap.fromTo(
          revealNodes,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
            },
          }
        )
      }

      dots.forEach((dot, index) => {
        if (index !== 0) gsap.set(dot, { backgroundColor: 'var(--bg)', boxShadow: 'none', scale: 1 })
      })
      logos.forEach((logo, index) => {
        if (index !== 0) gsap.set(logo, { borderColor: 'var(--border)', boxShadow: 'none' })
      })
      companies.forEach((company, index) => {
        if (index !== 0) gsap.set(company, { color: 'rgba(255,255,255,0.86)' })
      })
      impacts.forEach((impact, index) => {
        if (index !== 0) gsap.set(impact, { opacity: 0.72, x: 0 })
      })

      entries.forEach((entry, index) => {
        const dot = timelineDotRefs.current[index]
        const logo = logoRefs.current[index]
        const company = companyRefs.current[index]
        const impact = impactRefs.current[index]

        gsap.to(entry, {
          scrollTrigger: {
            trigger: entry,
            start: 'top 62%',
            end: 'bottom 45%',
            onEnter: () => {
              if (dot) {
                gsap.to(dot, {
                  backgroundColor: 'var(--gold)',
                  boxShadow: '0 0 12px rgba(201,168,76,0.4)',
                  scale: 1.06,
                  duration: 0.35,
                  ease: 'power2.out',
                })
              }
              if (logo) {
                gsap.to(logo, {
                  borderColor: 'rgba(201,168,76,0.42)',
                  boxShadow: '0 0 16px rgba(201,168,76,0.15)',
                  duration: 0.35,
                  ease: 'power2.out',
                })
              }
              if (company) {
                gsap.to(company, {
                  color: 'var(--white)',
                  duration: 0.3,
                  ease: 'power2.out',
                })
              }
              if (impact) {
                gsap.fromTo(
                  impact,
                  { opacity: 0.72, x: -8 },
                  { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
                )
              }
            },
            onEnterBack: () => {
              if (dot) {
                gsap.to(dot, {
                  backgroundColor: 'var(--gold)',
                  boxShadow: '0 0 12px rgba(201,168,76,0.4)',
                  scale: 1.06,
                  duration: 0.35,
                  ease: 'power2.out',
                })
              }
              if (logo) {
                gsap.to(logo, {
                  borderColor: 'rgba(201,168,76,0.42)',
                  boxShadow: '0 0 16px rgba(201,168,76,0.15)',
                  duration: 0.35,
                  ease: 'power2.out',
                })
              }
              if (company) {
                gsap.to(company, {
                  color: 'var(--white)',
                  duration: 0.3,
                  ease: 'power2.out',
                })
              }
              if (impact) {
                gsap.fromTo(
                  impact,
                  { opacity: 0.72, x: -8 },
                  { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
                )
              }
            },
            onLeave: () => {
              if (dot) gsap.to(dot, { backgroundColor: 'var(--bg)', boxShadow: 'none', scale: 1, duration: 0.3 })
              if (logo) gsap.to(logo, { borderColor: 'var(--border)', boxShadow: 'none', duration: 0.3 })
              if (company) gsap.to(company, { color: 'rgba(255,255,255,0.86)', duration: 0.3 })
              if (impact) gsap.to(impact, { opacity: 0.72, x: 0, duration: 0.25 })
            },
            onLeaveBack: () => {
              if (dot) gsap.to(dot, { backgroundColor: 'var(--bg)', boxShadow: 'none', scale: 1, duration: 0.3 })
              if (logo) gsap.to(logo, { borderColor: 'var(--border)', boxShadow: 'none', duration: 0.3 })
              if (company) gsap.to(company, { color: 'rgba(255,255,255,0.86)', duration: 0.3 })
              if (impact) gsap.to(impact, { opacity: 0.72, x: 0, duration: 0.25 })
            },
          },
        })
      })
    }, section)

    return () => ctx.kill()
  }, [])

  useEffect(() => {
    const entries = entryRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!entries.length) return
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach(ent => {
          if (ent.isIntersecting) {
            const line = ent.target.querySelector('.exp-line-draw')
            if (line) setTimeout(() => line.classList.add('visible'), 100)
            const entryIndex = Number((ent.target as HTMLDivElement).dataset.entryIndex ?? -1)
            const shimmer = entryIndex >= 0 ? shimmerRefs.current[entryIndex] : null
            if (shimmer) {
              gsap.fromTo(
                shimmer,
                { xPercent: -130, opacity: 0 },
                {
                  xPercent: 140,
                  opacity: 0.5,
                  duration: 0.9,
                  ease: 'power2.out',
                  onComplete: () => {
                    gsap.to(shimmer, { opacity: 0, duration: 0.2 })
                  },
                }
              )
            }
            observer.unobserve(ent.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    entries.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section relative overflow-hidden bg-[var(--black)]"
      style={{ padding: '120px 0 72px' }}
    >
      <div
        ref={ambientRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(200,169,110,0.1),transparent_30%)]"
      />

      <div className="experience-shell" style={{ width: '100%', position: 'relative' }}>
        <div
          className="experience-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            width: '100%',
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div
            className="experience-left-col"
            style={{
              padding: '80px 60px 24px 80px',
              borderRight: '1px solid rgba(201,168,76,0.1)',
              position: 'relative',
            }}
          >
            <div ref={leftStickyRef} style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
              <div
                ref={ghostRef}
                aria-hidden
                style={{
                  position: 'absolute',
                  fontFamily: "'Space Grotesk', var(--font-display)",
                  fontWeight: 700,
                  fontSize: 'clamp(10rem, 18vw, 16rem)',
                  color: 'rgba(201,168,76,0.03)',
                  bottom: '60px',
                  left: '40px',
                  pointerEvents: 'none',
                  zIndex: 0,
                  lineHeight: 1,
                }}
              >
                03
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div ref={leftRevealRef}>
                  <p
                    ref={labelRef}
                    style={{
                      fontFamily: "'JetBrains Mono', var(--font-mono)",
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: 'var(--gold)',
                      marginBottom: '48px',
                      display: 'block',
                    }}
                  >
                    03 / EXPERIENCE
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', var(--font-display)",
                      fontWeight: 700,
                      fontSize: 'clamp(2.8rem, 4vw, 4rem)',
                      lineHeight: 1,
                      color: 'var(--white)',
                      marginBottom: '48px',
                    }}
                  >
                    Building systems
                    <br />
                    chapter by
                    <br />
                    chapter.
                  </h2>
                  <div
                    style={{
                      width: '48px',
                      height: '2px',
                      background: 'var(--gold)',
                      marginBottom: '32px',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Inter', var(--font-body)",
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: 'var(--muted)',
                      marginBottom: '64px',
                      maxWidth: '420px',
                    }}
                  >
                    Production engineering, AI systems, analytics automation, and infrastructure delivery with measurable
                    outcomes.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      position: 'relative',
                    }}
                  >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: '11px',
                      top: 0,
                      width: '1px',
                      height: '100%',
                      background: 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))',
                    }}
                  />
                  <div
                    ref={timelineProgressRef}
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: '11px',
                      top: 0,
                      width: '1px',
                      height: '100%',
                      background: 'linear-gradient(to bottom, rgba(201,168,76,0.95), var(--gold))',
                      transformOrigin: 'top',
                    }}
                  />
                  {CHAPTERS.map((ch, index) => (
                    <div
                      key={`${ch.company}-timeline`}
                      style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'flex-start',
                        marginBottom: index === CHAPTERS.length - 1 ? 0 : '32px',
                      }}
                    >
                      <div
                        ref={(el) => {
                          timelineDotRefs.current[index] = el
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          border: '2px solid var(--gold)',
                          borderRadius: '50%',
                          background: index === 0 ? 'var(--gold)' : 'var(--bg)',
                          boxShadow: index === 0 ? '0 0 12px rgba(201,168,76,0.4)' : 'none',
                          flexShrink: 0,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontFamily: "'Space Grotesk', var(--font-display)",
                            fontWeight: 700,
                            fontSize: '14px',
                            color: 'var(--white)',
                            marginBottom: '6px',
                            lineHeight: 1.2,
                          }}
                        >
                          {ch.shortCompany}
                        </p>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', var(--font-mono)",
                            fontSize: '10px',
                            color: 'var(--muted)',
                            marginBottom: '6px',
                            lineHeight: 1.3,
                          }}
                        >
                          {ch.role}
                        </p>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', var(--font-mono)",
                            fontSize: '9px',
                            color: 'var(--muted)',
                            lineHeight: 1.3,
                          }}
                        >
                          {ch.period}
                        </p>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="experience-right-col" style={{ padding: '80px 80px 24px 60px' }}>
            {CHAPTERS.map((ch, index) => (
              <div
                key={ch.company}
                ref={(el) => {
                  entryRefs.current[index] = el
                }}
                data-entry-index={index}
                style={{ width: '100%' }}
              >
                {/* Chapter + Date row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', var(--font-mono)",
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      color: 'var(--muted)',
                    }}
                  >
                    {ch.chapter}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', var(--font-mono)",
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      color: 'var(--muted)',
                    }}
                  >
                    {ch.period}
                  </span>
                </div>

                {/* Company block */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    ref={(el) => {
                      logoRefs.current[index] = el
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', var(--font-display)",
                        fontSize: '16px',
                        color: 'var(--gold)',
                        fontWeight: 700,
                      }}
                    >
                      {ch.logo}
                    </span>
                  </div>
                  <h3
                    ref={(el) => {
                      companyRefs.current[index] = el
                    }}
                    style={{
                      fontFamily: "'Space Grotesk', var(--font-display)",
                      fontWeight: 700,
                      fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                      lineHeight: 1,
                      color: 'var(--white)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {ch.company}
                  </h3>
                </div>

                {/* Role + Impact */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginLeft: '68px',
                    marginBottom: '16px',
                    gap: '24px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', var(--font-mono)",
                      fontSize: '11px',
                      color: 'var(--gold)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {ch.role}
                  </p>
                  <p
                    ref={(el) => {
                      impactRefs.current[index] = el
                    }}
                    style={{
                      borderLeft: '2px solid var(--gold)',
                      paddingLeft: '12px',
                      fontFamily: "'Space Grotesk', var(--font-display)",
                      fontWeight: 700,
                      fontSize: '13px',
                      color: 'var(--white)',
                      lineHeight: 1.3,
                      textAlign: 'right',
                    }}
                  >
                    {ch.impact}
                  </p>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Inter', var(--font-body)",
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                    width: '100%',
                    marginBottom: '14px',
                    marginLeft: '68px',
                  }}
                >
                  {ch.description}
                </p>

                {/* Tags */}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', var(--font-mono)",
                    fontSize: '11px',
                    color: 'var(--muted)',
                    display: 'block',
                    marginLeft: '68px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {ch.stack.join(' · ')}
                </span>

                {index < CHAPTERS.length - 1 && (
                  <div
                    className="exp-line-draw"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      height: '1px',
                      background: 'var(--border)',
                      margin: '48px 0',
                      transformOrigin: 'left',
                    }}
                  >
                    <div
                      ref={(el) => {
                        shimmerRefs.current[index] = el
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '28%',
                        height: '100%',
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 48%, transparent 100%)',
                        transform: 'translateX(-130%)',
                        opacity: 0,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default memo(Experience)
