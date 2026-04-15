'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { useTextScramble } from '@/lib/use-text-scramble'

function identityLineStyle(color: string): CSSProperties {
  return {
    margin: 0,
    color,
    fontFamily: "'Space Grotesk', var(--font-display)",
    fontWeight: 700,
    fontSize: 'clamp(3.25rem, 6.8vw, 7rem)',
    lineHeight: 0.92,
  }
}

const columnHeaderStyle: CSSProperties = {
  fontFamily: "'JetBrains Mono', var(--font-mono)",
  fontSize: 10,
  letterSpacing: '0.2em',
  color: 'var(--gold)',
  paddingBottom: 16,
  borderBottom: '1px solid var(--border)',
  marginBottom: 32,
}

const philosophyTitleStyle: CSSProperties = {
  fontFamily: "'Space Grotesk', var(--font-display)",
  fontWeight: 700,
  fontSize: 18,
  color: 'var(--white)',
  marginBottom: 8,
}

const philosophyBodyStyle: CSSProperties = {
  fontFamily: "'Inter', var(--font-body)",
  fontSize: 14,
  color: 'var(--muted)',
  lineHeight: 1.6,
}

const headerWithAccentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)

  useTextScramble(labelRef, 'ABOUT')

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg, #0D0C0B)',
        padding: '160px 0',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 80,
          right: -20,
          fontFamily: "'Space Grotesk', var(--font-display)",
          fontWeight: 700,
          fontSize: 'clamp(12rem, 22vw, 20rem)',
          color: 'rgba(201,168,76,0.03)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          lineHeight: 1,
        }}
      >
        02
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          padding: '0 clamp(28px, 5vw, 96px)',
        }}
        className="max-[1200px]:px-[clamp(24px,6vw,64px)]"
      >
        <style>{`@keyframes about-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>
        <div
          aria-hidden
          style={{
            height: 1,
            width: '100%',
            marginBottom: 44,
            background:
              'linear-gradient(90deg, rgba(201,168,76,0.42), rgba(201,168,76,0.16), transparent 72%)',
          }}
        />
        <IdentityBlock labelRef={labelRef} />
        <StatsRow />
        <SplitColumns />
      </div>
    </section>
  )
}

function IdentityBlock({ labelRef }: { labelRef: RefObject<HTMLParagraphElement | null> }) {
  const blockRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const [paragraphRevealed, setParagraphRevealed] = useState(false)

  useEffect(() => {
    const headlineEl = headlineRef.current
    if (!headlineEl) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const words = Array.from(headlineEl.querySelectorAll<HTMLElement>('.word-inner'))
          words.forEach((word, index) => {
            word.style.transition =
              `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms, ` +
              `opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms`
            word.style.transform = 'translateY(0%)'
            word.style.opacity = '1'
          })
          const paragraphDelay = (Math.max(words.length - 1, 0) * 60) + 900 + 500
          window.setTimeout(() => setParagraphRevealed(true), paragraphDelay)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(headlineEl)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={blockRef}>
      <p
        ref={labelRef}
        style={{
          fontFamily: "'JetBrains Mono', var(--font-mono)",
          fontSize: 11,
          letterSpacing: '0.2em',
          color: 'var(--gold)',
          marginBottom: 48,
        }}
      >
        02 / ABOUT
      </p>

      <div ref={headlineRef}>
        <h2
          className="about-identity-line about-identity-line-1"
          style={{
            ...identityLineStyle('var(--white)'),
            display: 'block',
            marginLeft: 0,
          }}
        >
          <WordLine text="I don't just write code." />
        </h2>

        <h2
          className="about-identity-line about-identity-line-2"
          style={{
            ...identityLineStyle('var(--gold)'),
            display: 'block',
            marginLeft: 'clamp(40px, 5vw, 80px)',
          }}
        >
          <WordLine text="I engineer systems" />
        </h2>

        <h2
          className="about-identity-line about-identity-line-3"
          style={{
            ...identityLineStyle('var(--white)'),
            display: 'block',
            marginLeft: 'clamp(80px, 10vw, 160px)',
          }}
        >
          <WordLine text="that outlast deadlines" />
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              marginLeft: '0.04em',
            }}
          >
            <span className="word-inner" style={wordInnerInitialStyle}>.</span>
          </span>
        </h2>
      </div>

      <p
        style={{
          marginTop: 48,
          maxWidth: 700,
          fontFamily: "'Inter', var(--font-body)",
          fontSize: 17,
          lineHeight: 1.78,
          color: 'var(--muted)',
          opacity: paragraphRevealed ? 1 : 0,
          transform: paragraphRevealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 700ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        Full-stack developer and AI engineer. I build systems from scratch - fast, scalable, and built to outlast the
        deadline. Remote-first. Globally available.
      </p>
    </div>
  )
}

function StatsRow() {
  const rowRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rowRef}
      className="about-impact-grid max-[900px]:flex-wrap"
      style={{
        marginTop: 100,
        display: 'flex',
        gap: 28,
        justifyContent: 'space-between',
      }}
    >
      {[
        { number: '10+', label: 'PROJECTS SHIPPED' },
        { number: '3+', label: 'YEARS BUILDING' },
        { number: '∞', label: 'PROBLEMS SOLVED' },
        { number: '1', label: 'FOCUS: SHIP IT' },
      ].map((stat, idx) => (
        <RevealItem
          key={stat.label}
          revealed={revealed}
          delayMs={idx * 100}
          fromX={0}
          fromY={20}
          durationMs={700}
        >
          <div style={{ flex: 1, minWidth: 140 }}>
            <p
              style={{
                fontFamily: "'Space Grotesk', var(--font-display)",
                fontWeight: 700,
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                lineHeight: 1,
                color: 'var(--gold)',
              }}
            >
              {stat.number}
            </p>
            <p
              style={{
                marginTop: 8,
                fontFamily: "'JetBrains Mono', var(--font-mono)",
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {stat.label}
            </p>
          </div>
        </RevealItem>
      ))}
    </div>
  )
}

function SplitColumns() {
  const splitRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = splitRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={splitRef}
      className="about-main-split max-[980px]:grid-cols-1 max-[980px]:gap-12"
      style={{
        marginTop: 100,
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1.1fr) minmax(320px, 0.9fr)',
        gap: 96,
      }}
    >
      <div>
        <div style={headerWithAccentStyle}>
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '999px',
              background: 'var(--gold)',
              opacity: 0.75,
              marginTop: -2,
            }}
          />
          <p style={{ ...columnHeaderStyle, flex: 1 }}>HOW I THINK</p>
        </div>

        {[
          ['THINK', "I don't touch the keyboard until the problem is fully understood."],
          ['BUILD', "Clean architecture. Scalable systems. Code that future-me won't hate."],
          ['SHIP', "If it's not in production, it doesn't exist. Real impact only."],
        ].map(([title, desc], idx) => (
          <RevealItem
            key={title}
            revealed={revealed}
            delayMs={idx * 120}
            fromX={-16}
            fromY={0}
            durationMs={600}
          >
            <div style={{ marginBottom: idx < 2 ? 28 : 0 }}>
              <p style={philosophyTitleStyle}>{title}</p>
              <p style={philosophyBodyStyle}>{desc}</p>
            </div>
          </RevealItem>
        ))}
      </div>

      <div>
        <div style={headerWithAccentStyle}>
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '999px',
              background: 'var(--gold)',
              opacity: 0.75,
              marginTop: -2,
            }}
          />
          <p style={{ ...columnHeaderStyle, flex: 1 }}>RIGHT NOW</p>
        </div>

        {[
          ['ROLE', 'Full-Stack + AI Engineer'],
          ['BASED', 'Pune, India · Remote'],
          ['BUILDING', 'ERP systems + AI platforms'],
          ['LEARNING', 'JLPT N3 日本語'],
          ['OPEN TO', 'Freelance & Contracts'],
          ['STATUS', 'Available Now'],
        ].map(([key, value], idx) => (
          <RevealItem
            key={key}
            revealed={revealed}
            delayMs={idx * 80}
            fromX={16}
            fromY={0}
            durationMs={500}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                padding: '14px 0',
                borderBottom: '1px solid rgba(201,168,76,0.06)',
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {key}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', var(--font-body)",
                  fontSize: 14,
                  color: 'var(--white)',
                  textAlign: 'right',
                }}
              >
                {key === 'STATUS' ? (
                  <>
                    {value}{' '}
                    <span
                      style={{
                        color: '#28c940',
                        display: 'inline-block',
                        animation: 'about-pulse 2s infinite',
                      }}
                    >
                      ●
                    </span>
                  </>
                ) : value}
              </p>
            </div>
          </RevealItem>
        ))}
      </div>
    </div>
  )
}

function RevealItem({
  revealed,
  delayMs,
  fromX,
  fromY,
  durationMs = 700,
  children,
}: {
  revealed: boolean
  delayMs: number
  fromX: number
  fromY: number
  durationMs?: number
  children: ReactNode
}) {
  return (
    <div
      style={{
        transform: revealed ? 'translate(0, 0)' : `translate(${fromX}px, ${fromY}px)`,
        opacity: revealed ? 1 : 0,
        transition: `transform ${durationMs}ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, opacity ${durationMs}ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  )
}

function WordLine({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, idx, arr) => (
        <span
          key={`${word}-${idx}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: idx < arr.length - 1 ? '0.24em' : 0,
          }}
        >
          <span className="word-inner" style={wordInnerInitialStyle}>
            {word}
          </span>
        </span>
      ))}
    </>
  )
}

const wordInnerInitialStyle: CSSProperties = {
  display: 'inline-block',
  transform: 'translateY(110%)',
  opacity: 0,
}
