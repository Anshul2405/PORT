'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

const TERMINAL_LINES = [
  { delay: 0, text: '> SYSTEM INIT...' },
  { delay: 300, text: '> LOADING: AI_ENGINE ████████████ 100%' },
  { delay: 600, text: '> LOADING: FULLSTACK ████████████ 100%' },
  { delay: 900, text: '> LANGUAGE: 日本語 [N3] ACTIVE' },
  { delay: 1200, text: '> MONOZUKURI PROTOCOL: ENGAGED' },
  { delay: 1500, text: '> WELCOME — ANSHUL RAIBOLE' },
]

type Phase = 'terminal' | 'name' | 'exit' | 'done'

type PreloaderProps = {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('terminal')
  const [visibleLineIndex, setVisibleLineIndex] = useState(-1)
  const [lineContents, setLineContents] = useState<string[]>(TERMINAL_LINES.map(() => ''))

  useEffect(() => {
    const timers: number[] = []

    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms)
      timers.push(id)
    }

    // Progress bar: 0% → 100% over 2000ms (gsap)
    if (progressRef.current) {
      gsap.set(progressRef.current, { width: '0%' })
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 2,
        ease: 'none',
      })
    }

    // Each line: show at delay, then type character by character; opacity 0→1 over 200ms
    const charMs = 28
    TERMINAL_LINES.forEach((line, lineIndex) => {
      const startMs = line.delay
      // Reveal line (opacity) at start
      schedule(startMs, () => setVisibleLineIndex(lineIndex))
      // Type out characters
      for (let c = 0; c <= line.text.length; c++) {
        schedule(startMs + 200 + c * charMs, () => {
          setLineContents((prev) => {
            const next = [...prev]
            next[lineIndex] = line.text.slice(0, c)
            return next
          })
        })
      }
    })

    // At 1800ms: switch to name phase (terminal fades out, name appears)
    schedule(1800, () => {
      setPhase('name')
      setVisibleLineIndex(-1)

      if (!terminalRef.current || !nameRef.current || !subtitleRef.current || !containerRef.current) return

      gsap.to(terminalRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })

      gsap.fromTo(
        nameRef.current,
        {
          opacity: 0,
          scale: 0.9,
          letterSpacing: '0.3em',
        },
        {
          opacity: 1,
          scale: 1,
          letterSpacing: '-0.02em',
          duration: 0.9,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.4,
          ease: 'power2.out',
        }
      )
    })

    // Hold 700ms then exit (clip-path). Name anim 900ms, so 1800+900=2700, hold to 3400, then exit
    schedule(3400, () => {
      setPhase('exit')
      if (!containerRef.current) return
      gsap.to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          setPhase('done')
          onComplete()
        },
      })
    })

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <>
      <style>{`
        @keyframes preloader-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .preloader-cursor-blink {
          animation: preloader-blink 1s step-end infinite;
        }
      `}</style>
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        clipPath: 'inset(0 0 0 0)',
      }}
      aria-hidden="true"
    >
      {/* Terminal block — centered, max-width 600px */}
      <div
        ref={terminalRef}
        style={{
          maxWidth: '600px',
          width: '100%',
          paddingLeft: 'clamp(16px, 4vw, 24px)',
          paddingRight: 'clamp(16px, 4vw, 24px)',
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
          color: '#C8A96E',
          opacity: phase === 'terminal' ? 1 : 0,
        }}
      >
        {TERMINAL_LINES.map((line, index) => {
          const isActive = phase === 'terminal' && visibleLineIndex === index
          const show = visibleLineIndex >= index
          return (
            <div
              key={index}
              style={{
                opacity: show ? 1 : 0,
                transition: 'opacity 200ms ease-out',
                minHeight: '1.5em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{lineContents[index]}</span>
              {isActive && (
                <span className="preloader-cursor-blink" style={{ marginLeft: 1, color: '#C8A96E' }}>
                  _
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Name — center screen, only visible in name phase */}
      <div
        ref={nameRef}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0,
          fontFamily: 'var(--font-display), sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(10vw, 14vw, 180px)',
          lineHeight: 0.9,
          textAlign: 'center',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        ANSHUL <span style={{ color: '#C8A96E' }}>RAIBOLE</span>
      </div>

      <div
        ref={subtitleRef}
        style={{
          position: 'fixed',
          bottom: '28%',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: '1rem',
          color: 'rgba(238,238,232,0.5)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        Full-Stack Engineer × AI & Data Science
      </div>

      {/* Progress bar — bottom, 2px, gold, 0→100% over 2000ms */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '2px',
          background: 'rgba(200,169,110,0.2)',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '0%',
            background: '#C8A96E',
          }}
        />
      </div>
    </div>
    </>
  )
}
