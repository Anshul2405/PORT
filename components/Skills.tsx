'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTextScramble } from '@/lib/use-text-scramble'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { simulatePortfolioKeyPress } from '@/lib/keyboard-sim-bridge'
import { usePerformanceLiteMode } from '@/lib/use-performance-mode'

const InteractiveKeyboard = dynamic(() => import('@/components/InteractiveKeyboard'), {
  ssr: false,
})

const PROFICIENCY: Record<string, number> = {
  'C++': 3, 'Python': 3, 'React.js': 3, 'Node.js': 3, 'TensorFlow': 3, 'Docker': 3,
  'JavaScript': 2, 'SQL': 2, 'PyTorch': 2, 'AWS': 2, 'Django': 2, 'Kubernetes': 2,
  'Scikit-learn': 2, 'Generative AI': 2, 'Digital Twin': 3, 'SDLC': 2, 'Zero-Defect Systems': 2, 'DOP': 2,
  'Java': 1, 'Pandas': 1, 'NLP': 1, 'DSA': 1,
}

const SKILL_GROUPS = [
  { label: 'LANGUAGES', items: ['C++', 'Python', 'JavaScript', 'SQL', 'Java'] },
  { label: 'AI & DATA', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NLP', 'Generative AI'] },
  { label: 'WEB & CLOUD', items: ['React.js', 'Node.js', 'Django', 'AWS', 'Docker', 'Kubernetes'] },
  { label: 'CONCEPTS', items: ['Digital Twin', 'SDLC', 'DSA', 'Zero-Defect Systems', 'DOP'] },
]

const CATEGORIES = ['LANGUAGES', 'AI & DATA', 'WEB & CLOUD', 'CONCEPTS'] as const
type Category = (typeof CATEGORIES)[number]

type SkillSequenceItem = {
  name: string
  category: Category
}

/** One word at a time on the 3D keyboard, then fly into its column (order is the story). */
const SKILLS: SkillSequenceItem[] = [
  { name: 'React.js', category: 'WEB & CLOUD' },
  { name: 'Python', category: 'LANGUAGES' },
  { name: 'TensorFlow', category: 'AI & DATA' },
  { name: 'Node.js', category: 'WEB & CLOUD' },
  { name: 'PyTorch', category: 'AI & DATA' },
  { name: 'C++', category: 'LANGUAGES' },
  { name: 'AWS', category: 'WEB & CLOUD' },
  { name: 'JavaScript', category: 'LANGUAGES' },
  { name: 'Scikit-learn', category: 'AI & DATA' },
  { name: 'Docker', category: 'WEB & CLOUD' },
  { name: 'NLP', category: 'AI & DATA' },
  { name: 'SQL', category: 'LANGUAGES' },
  { name: 'Generative AI', category: 'AI & DATA' },
  { name: 'Django', category: 'WEB & CLOUD' },
  { name: 'Digital Twin', category: 'CONCEPTS' },
  { name: 'Kubernetes', category: 'WEB & CLOUD' },
  { name: 'Java', category: 'LANGUAGES' },
  { name: 'Pandas', category: 'AI & DATA' },
  { name: 'SDLC', category: 'CONCEPTS' },
  { name: 'Zero-Defect Systems', category: 'CONCEPTS' },
  { name: 'DSA', category: 'CONCEPTS' },
  { name: 'DOP', category: 'CONCEPTS' },
]

const SKILL_CHAR_MS = 105
const SKILL_AFTER_TYPE_MS = 420
const SKILL_AFTER_LAND_MS = 200

export default function Skills() {
  const performanceLite = usePerformanceLiteMode()
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const theatreRef = useRef<HTMLDivElement>(null)
  const keyboardMountRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'flying' | 'done'>('idle')
  const [visibleTags, setVisibleTags] = useState<string[]>([])
  const [typingIndex, setTypingIndex] = useState(-1)
  const [typingText, setTypingText] = useState('')
  const [landedSkills, setLandedSkills] = useState<string[]>([])
  const [flashingColumn, setFlashingColumn] = useState<string | null>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [keyboardIntroTick, setKeyboardIntroTick] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [keyboardRect, setKeyboardRect] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const tagRefs = useRef<Map<string, HTMLElement>>(new Map())
  const columnRefs = useRef<Map<string, HTMLElement>>(new Map())
  const hasPlayed = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const landedRowRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevLandedCount = useRef(0)

  useTextScramble(labelRef, 'SKILLS')

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timersRef.current.push(t)
    return t
  }, [])

  const triggerKeyboardGlow = useCallback(() => {
    const pulseKeys = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';']
    pulseKeys.forEach((k, i) => {
      scheduleTimeout(() => simulatePortfolioKeyPress(`Key${k}`, { silent: false }), i * 90)
    })
  }, [scheduleTimeout])

  const flySkillToColumn = useCallback(
    (skill: SkillSequenceItem, onLanded?: () => void) => {
    const tagEl = tagRefs.current.get(skill.name)
    const columnEl = columnRefs.current.get(skill.category)

    if (!tagEl || !columnEl) {
      setLandedSkills(prev => (prev.includes(skill.name) ? prev : [...prev, skill.name]))
      onLanded?.()
      return
    }

    const tagRect = tagEl.getBoundingClientRect()
    const colRect = columnEl.getBoundingClientRect()
    const clone = tagEl.cloneNode(true) as HTMLElement
    clone.style.position = 'fixed'
    clone.style.left = `${tagRect.left}px`
    clone.style.top = `${tagRect.top}px`
    clone.style.width = `${tagRect.width}px`
    clone.style.height = `${tagRect.height}px`
    clone.style.margin = '0'
    clone.style.zIndex = '118'
    clone.style.pointerEvents = 'none'
    clone.style.transition = 'none'
    clone.style.background = 'var(--gold)'
    clone.style.color = 'var(--bg)'
    clone.style.border = '1px solid var(--gold)'
    clone.style.borderRadius = '4px'
    clone.style.display = 'inline-flex'
    clone.style.alignItems = 'center'
    clone.style.justifyContent = 'center'
    clone.style.fontFamily = "'JetBrains Mono', monospace"
    clone.style.fontSize = '11px'
    clone.style.padding = '4px 10px'
    clone.style.willChange = 'transform, opacity, left, top'
    document.body.appendChild(clone)

    tagEl.style.opacity = '0'
    tagEl.style.transform = 'scale(0.8)'

    const targetX = colRect.left + 8
    const targetY = colRect.top + 8

    setPhase('flying')

    gsap.to(clone, {
      left: targetX,
      top: targetY,
      scale: 0.85,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        clone.remove()
        setLandedSkills(prev => (prev.includes(skill.name) ? prev : [...prev, skill.name]))
        setFlashingColumn(skill.category)
        // Only nudge scroll if the user is still viewing this section (avoid pulling them back from another area).
        const shell = sectionRef.current
        if (shell) {
          const r = shell.getBoundingClientRect()
          const vh = window.innerHeight
          const inView = r.top < vh * 0.88 && r.bottom > vh * 0.12
          if (inView) {
            columnEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
          }
        }
        scheduleTimeout(() => setFlashingColumn(null), 600)
        gsap.to(columnEl, {
          y: -3,
          duration: 0.08,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
        onLanded?.()
      },
    })
  },
  [scheduleTimeout]
)

  const startAnimation = useCallback(() => {
    setPhase('typing')
    setVisibleTags([])
    setTypingIndex(-1)
    setTypingText('')
    setLandedSkills([])
    setFlashingColumn(null)

    const runSkillAtIndex = (index: number) => {
      if (index >= SKILLS.length) {
        setPhase('done')
        triggerKeyboardGlow()
        return
      }

      const skill = SKILLS[index]
      setPhase('typing')
      setTypingIndex(index)
      setTypingText('')

      let charIndex = 0
      const typeInterval = setInterval(() => {
        charIndex += 1
        const nextSlice = skill.name.slice(0, charIndex)
        setTypingText(nextSlice)
        const newChar = skill.name.charAt(charIndex - 1)
        window.dispatchEvent(
          new CustomEvent('simulateKeyPress', {
            detail: { character: newChar },
          })
        )

        if (charIndex === skill.name.length) {
          clearInterval(typeInterval)
          intervalsRef.current = intervalsRef.current.filter(i => i !== typeInterval)

          scheduleTimeout(() => {
            setVisibleTags(prev => [...prev, skill.name])
            setTypingIndex(-1)
            setTypingText('')
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                flySkillToColumn(skill, () => {
                  scheduleTimeout(() => runSkillAtIndex(index + 1), SKILL_AFTER_LAND_MS)
                })
              })
            })
          }, SKILL_AFTER_TYPE_MS)
        }
      }, SKILL_CHAR_MS)
      intervalsRef.current.push(typeInterval)
    }

    scheduleTimeout(() => runSkillAtIndex(0), 120)
  }, [flySkillToColumn, scheduleTimeout, triggerKeyboardGlow])

  useEffect(() => {
    if (typingIndex < 0) return
    const blink = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 350)
    return () => clearInterval(blink)
  }, [typingIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true
          setKeyboardIntroTick(t => t + 1)
          scheduleTimeout(startAnimation, 100)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [scheduleTimeout, startAnimation])

  useEffect(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    if (rect.top < window.innerHeight && !hasPlayed.current) {
      hasPlayed.current = true
      setKeyboardIntroTick(t => t + 1)
      scheduleTimeout(startAnimation, 500)
    }
  }, [scheduleTimeout, startAnimation])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || performanceLite) return
    const updateRect = () => {
      const el = keyboardMountRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setKeyboardRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, { passive: true })
    const interval = window.setInterval(updateRect, 250)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
      window.clearInterval(interval)
    }
  }, [mounted, performanceLite])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  useEffect(() => {
    if (landedSkills.length <= prevLandedCount.current) return
    const latestName = landedSkills[landedSkills.length - 1]
    const rowEl = landedRowRefs.current.get(latestName)
    if (rowEl) {
      gsap.fromTo(
        rowEl,
        { opacity: 0, y: -8, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2.2)',
        }
      )
    }
    prevLandedCount.current = landedSkills.length
  }, [landedSkills])

  const keyboardPortalStyle: React.CSSProperties | null =
    !performanceLite && mounted && keyboardRect
      ? (() => {
          const scaleW = 1.68
          const scaleH = 1.5
          const kW = keyboardRect.width * scaleW
          const kH = keyboardRect.height * scaleH
          const lift = Math.min(110, keyboardRect.height * 0.18)
          return {
            position: 'absolute',
            left: keyboardRect.left + (keyboardRect.width - kW) / 2,
            top: keyboardRect.top + (keyboardRect.height - kH) / 2 - lift,
            width: kW,
            height: kH,
            pointerEvents: 'auto',
          }
        })()
      : null

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative bg-[var(--black)]"
      style={{
        paddingTop: 'max(7rem, calc(var(--nav-h) + env(safe-area-inset-top, 0px) + clamp(2.5rem, 5vw, 4rem)))',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        overflowX: 'hidden',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,169,110,0.1),transparent_28%)]" />

      <div style={{ width: '100%', padding: '0 clamp(16px, 5vw, 88px) 56px' }}>
        {/* Four category columns; quote spans full width below, centered */}
        <div
          className="skills-head-grid"
          style={{
            marginBottom: 'clamp(40px, 6vw, 72px)',
            position: 'relative',
            /* Below fixed navbar (z-120); was 10060 and drew on top of the bar */
            zIndex: 12,
            pointerEvents: 'none',
          }}
        >
          {CATEGORIES.map(category => (
            <div
              key={category}
              style={{
                position: 'relative',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(9px, 0.75vw, 10px)',
                  letterSpacing: '0.18em',
                  color: flashingColumn === category ? '#C9A84C' : 'var(--muted)',
                  borderTop: `1px solid ${flashingColumn === category ? 'var(--gold)' : 'var(--border)'}`,
                  paddingTop: '10px',
                  marginBottom: '14px',
                  transition: 'color 0.3s, border-color 0.3s',
                  textShadow: flashingColumn === category ? '0 0 20px rgba(201,168,76,0.6)' : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {category}
              </div>

              <div
                ref={el => {
                  if (el) columnRefs.current.set(category, el)
                }}
                style={{
                  minHeight: '100px',
                }}
              >
                {SKILLS.filter(s => s.category === category && landedSkills.includes(s.name)).map(skill => (
                  <div
                    key={skill.name}
                    ref={el => {
                      if (el) landedRowRefs.current.set(skill.name, el)
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                      gap: '6px',
                      opacity: 0,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', var(--font-body)",
                        fontSize: 'clamp(12px, 1.05vw, 14px)',
                        color: 'var(--white)',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {skill.name}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        gap: '2px',
                        flexShrink: 0,
                        marginLeft: '4px',
                      }}
                    >
                      {[0, 1, 2].map(sq => (
                        <span
                          key={`${skill.name}-${sq}`}
                          style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '1px',
                            background:
                              sq < (PROFICIENCY[skill.name] ?? 2)
                                ? '#C9A84C'
                                : 'rgba(201,168,76,0.2)',
                          }}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="skills-head-quote">
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
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '4px',
                  height: '4px',
                  background: '#C9A84C',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              SKILLS
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.9rem, 3.2vw, 3rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.05em',
                color: 'var(--white)',
                margin: '0 auto',
                maxWidth: '22ch',
              }}
            >
              The toolkit behind the systems.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                lineHeight: 1.9,
                color: 'rgba(238,238,232,0.68)',
                marginTop: '22px',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '36rem',
              }}
            >
              A blend of full-stack engineering, AI execution, cloud deployment, and disciplined software
              fundamentals.
            </p>
          </div>
        </div>

        {/* Interactive keyboard — full-width strip, 3D view centered over mount */}
        <div
          ref={theatreRef}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 'min(420px, 52vw)',
            paddingTop: 'clamp(8px, 2vw, 24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 'min(1320px, 100%)',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                minHeight: 'clamp(72px, 10vw, 100px)',
                marginBottom: 'clamp(18px, 3vw, 32px)',
                pointerEvents: 'none',
                width: '100%',
              }}
            >
              {typingIndex >= 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '44px',
                    padding: '8px 18px',
                    border: '1px solid rgba(201,168,76,0.55)',
                    borderRadius: '6px',
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 'clamp(14px, 1.35vw, 18px)',
                    fontWeight: 500,
                    color: 'var(--gold)',
                    background: 'rgba(12,11,10,0.92)',
                    letterSpacing: '0.04em',
                    boxShadow: '0 0 0 1px rgba(201,168,76,0.12), 0 18px 40px rgba(0,0,0,0.45)',
                  }}
                >
                  {typingText}
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1.1em',
                      background: 'var(--gold)',
                      marginLeft: '4px',
                      opacity: cursorVisible ? 1 : 0,
                    }}
                  />
                </span>
              )}

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  maxWidth: 'min(920px, 100%)',
                }}
              >
                {visibleTags
                  .filter(name => !landedSkills.includes(name))
                  .map(name => (
                    <span
                      key={name}
                      ref={el => {
                        if (el) tagRefs.current.set(name, el)
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        border: '1px solid rgba(201,168,76,0.4)',
                        borderRadius: '4px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: 'var(--white)',
                        letterSpacing: '0.05em',
                        transition: 'opacity 0.2s, transform 0.2s',
                      }}
                    >
                      {name}
                    </span>
                  ))}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                height: 'min(480px, 40vw)',
                minHeight: 'min(320px, 55vw)',
                overflow: 'visible',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'auto',
                zIndex: 30,
              }}
            >
              <div
                ref={keyboardMountRef}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%)',
                  width: 'min(980px, 96vw)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 0',
                  zIndex: 40,
                  pointerEvents: 'auto',
                  borderRadius: '10px',
                }}
              >
                {/* Portal-mounted to body for guaranteed pointer interaction */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {keyboardPortalStyle
        ? createPortal(
            <div
              style={{
                position: 'fixed',
                inset: 0,
                /* Just under navbar (z-120) so the bar stays readable over this section */
                zIndex: 119,
                pointerEvents: 'none',
                overflow: 'visible',
                background: 'transparent',
              }}
            >
              <InteractiveKeyboard introTick={keyboardIntroTick} style={keyboardPortalStyle} />
            </div>,
            document.body
          )
        : null}
    </section>
  )
}
