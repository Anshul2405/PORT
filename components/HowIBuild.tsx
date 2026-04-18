'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import StageLeft from './how-i-build/StageLeft'

const MobileMacPreview = dynamic(() => import('./how-i-build/MobileMacPreview'), { ssr: false })
import {
  HOW_I_BUILD_STAGES as STAGES,
  HOW_I_BUILD_STAGE_NAV_SHORT as STAGE_SHORT_NAMES,
} from '@/lib/how-i-build-stages'

export default function HowIBuild({ onStageChange }: { onStageChange?: (stage: number) => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const activeStageRef = useRef(0)
  const onStageChangeRef = useRef(onStageChange)

  useEffect(() => {
    onStageChangeRef.current = onStageChange
  }, [onStageChange])

  useEffect(() => {
    activeStageRef.current = activeStage
  }, [activeStage])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const articles = root.querySelectorAll<HTMLElement>('[data-hib-stage]')
    if (!articles.length) return

    const pickFocusedStage = () => {
      const vh = window.innerHeight
      const focusY = vh * 0.42
      let bestIdx = 0
      let bestDist = Number.POSITIVE_INFINITY

      articles.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -80 || r.top > vh + 80) return
        const idx = Number(el.getAttribute('data-hib-stage'))
        if (Number.isNaN(idx)) return
        const anchor = r.top + Math.min(r.height * 0.38, 200)
        const dist = Math.abs(anchor - focusY)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = idx
        }
      })

      if (bestIdx !== activeStageRef.current) {
        activeStageRef.current = bestIdx
        setActiveStage(bestIdx)
        onStageChangeRef.current?.(bestIdx)
      }
    }

    const obs = new IntersectionObserver(
      () => pickFocusedStage(),
      {
        root: null,
        rootMargin: '-12% 0px -18% 0px',
        threshold: [0, 0.05, 0.12, 0.22, 0.35, 0.5, 0.65, 0.8, 0.95, 1],
      },
    )

    articles.forEach((el) => obs.observe(el))
    window.addEventListener('scroll', pickFocusedStage, { passive: true })
    pickFocusedStage()
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', pickFocusedStage)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-i-build"
      style={{
        position: 'relative',
        background: '#0A0908',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        paddingTop: 'clamp(56px, 9vw, 120px)',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 'clamp(96px, 14vh, 160px)',
      }}
    >
      <div className="hib-section-inner">
        <header
          className="hib-heading"
          style={{
            textAlign: 'left',
            marginBottom: 'clamp(48px, 9vh, 100px)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(10px, 1vw, 11px)',
              color: '#C9A84C',
              letterSpacing: '0.38em',
              marginBottom: '16px',
            }}
          >
            PROCESS · CRAFT · DELIVERY
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
              lineHeight: 0.98,
              color: 'var(--white)',
              letterSpacing: '-0.02em',
            }}
          >
            How I build
          </h2>
          <div
            className="hib-heading-rule"
            style={{
              marginTop: '20px',
              marginLeft: 0,
              maxWidth: '280px',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(201,168,76,0.6), rgba(201,168,76,0.16), transparent)',
            }}
            aria-hidden
          />
        </header>

        <MobileMacPreview />

        <div
          className="hib-stage-row"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 'clamp(28px, 4vw, 56px)',
            alignItems: 'flex-start',
          }}
        >
          <nav
            className="hib-stage-nav"
            aria-label="Build stages"
            style={{
              flexShrink: 0,
              width: 'clamp(88px, 11vw, 140px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 2.2vw, 22px)',
              position: 'sticky',
              top: 'max(28px, 14vh)',
              paddingTop: '12px',
            }}
          >
            {STAGES.map((_, i) => {
              const isActive = activeStage === i
              return (
                <div
                  key={i}
                  className={`hib-nav-step${isActive ? ' hib-nav-step--active' : ''}`}
                  style={{
                    fontFamily: "'JetBrains Mono', var(--font-mono)",
                    fontSize: 'clamp(10px, 1vw, 11px)',
                    letterSpacing: '0.15em',
                    color: isActive ? '#C9A84C' : 'rgba(201,168,76,0.28)',
                    borderLeft: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                    paddingLeft: '12px',
                    textAlign: 'left',
                    transition: 'color 0.35s ease, border-color 0.35s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isActive ? STAGE_SHORT_NAMES[i] : String(i + 1).padStart(2, '0')}
                </div>
              )
            })}
          </nav>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: 'min(860px, 100%)',
            }}
          >
            {STAGES.map((stage, i) => (
              <article
                key={stage.id}
                data-hib-stage={i}
                style={{
                  position: 'relative',
                  minHeight: 'min(88vh, 820px)',
                  paddingBottom: 'clamp(32px, 6vh, 72px)',
                  scrollMarginTop: 'max(80px, 15vh)',
                }}
              >
                <div
                  className="hib-stage-watermark"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: 'clamp(-8vw, -4vw, 0px)',
                    left: 'auto',
                    fontFamily: "'Space Grotesk', var(--font-display)",
                    fontWeight: 700,
                    fontSize: 'clamp(6.5rem, 16vw, 12rem)',
                    color: 'rgba(201, 168, 76, 0.045)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none' as const,
                    zIndex: 0,
                  }}
                >
                  {String(stage.id).padStart(2, '0')}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <StageLeft
                    stageNumber={String(stage.id).padStart(2, '0')}
                    label={stage.label}
                    title={stage.title}
                    description={stage.description}
                    deliverable={stage.deliverable}
                    duration={stage.duration}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
