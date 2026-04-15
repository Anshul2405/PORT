'use client'

import { useLayoutEffect, useRef } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { useLenis } from '@/lib/lenis-context'
import HeroGoldBackdrop from './HeroGoldBackdrop'
import MagneticButton from '@/components/ui/MagneticButton'
import TextScramble from '@/components/ui/TextScramble'
import Typewriter from '@/components/ui/Typewriter'
import AnimatedBorder from '@/components/ui/AnimatedBorder'
import Dock from '@/components/ui/Dock'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const getLenis = useLenis()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const left = leftRef.current
    const indicator = scrollIndicatorRef.current
    if (!section || !left || !indicator) return

    const mm = gsap.matchMedia()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        left.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.12, delay: 0.3 }
      )

      gsap.to(indicator, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=160', scrub: true },
      })

      mm.add('(min-width: 901px)', () => {
        gsap.to('.hero-left', {
          opacity: 0,
          y: -40,
          scrollTrigger: { trigger: section, start: 'top top', end: '60% top', scrub: 1 },
        })

        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 },
          })
          .to(left, { xPercent: -18, opacity: 0, ease: 'none' }, 0)
      })
    }, section)

    return () => {
      mm.revert()
      ctx.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section relative flex items-center overflow-visible bg-[var(--black)]"
    >
      <HeroGoldBackdrop />

      {/* Perspective grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '200%',
          top: '-50%',
          transformOrigin: 'center bottom',
          animation: 'grid-drift 8s linear infinite',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent 100%)',
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h${i}`} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${(i + 1) * 10}%`, height: '1px',
              background: 'rgba(201,168,76,0.06)',
            }} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={`v${i}`} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(i + 1) * (100 / 15)}%`, width: '1px',
              background: 'rgba(201,168,76,0.06)',
            }} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="grid-background absolute inset-0 opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      {/* Left — text content */}
      <div
        ref={leftRef}
        className="hero-left flex min-w-0 flex-col"
        style={{
          position: 'absolute',
          left: 'clamp(2rem, 5vw, 6rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
        }}
      >
        <AnimatedBorder
          className="hero-badge"
          style={{ marginBottom: '2.5rem', alignSelf: 'flex-start' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#C9A84C',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#C9A84C',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            AVAILABLE FOR WORK
          </div>
        </AnimatedBorder>

        <div className="hero-name-block" style={{ lineHeight: 0.88, margin: '0.25rem 0 0.5rem' }}>
          <TextScramble
            text="ANSHUL"
            speed={40}
            maxFrames={8}
            triggerOnHover
            as="div"
            className="hero-name-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 7vw, 7rem)',
              fontWeight: 800,
              color: '#EEEEE8',
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
            }}
          />
          <TextScramble
            text="RAIBOLE"
            speed={40}
            maxFrames={10}
            triggerOnHover
            as="div"
            className="hero-name-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 7vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              marginTop: '0.06em',
              color: '#C8A96E',
            }}
          />
        </div>

        <div className="hero-subtitle" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '1.5rem',
        }}>
          <div style={{ width: '30px', height: '1px', background: '#C9A84C', flexShrink: 0 }} />
          <Typewriter
            phrases={[
              'Full-Stack Engineer',
              'AI & Data Science',
              'JLPT N3 日本語',
              'Open to Freelance',
              'Building things that ship',
            ]}
            typeSpeed={60}
            deleteSpeed={30}
            pauseTime={2000}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: '#6B6860',
              textTransform: 'uppercase',
            }}
          />
        </div>

        <p className="hero-bio max-w-[440px]" style={{
          fontFamily: 'var(--font-body, var(--font-mono))',
          fontSize: '0.9rem',
          lineHeight: 1.75,
          color: 'rgba(238,238,232,0.55)',
          fontWeight: 400,
          marginBottom: '1.5rem',
        }}>
          Engineering intelligence. Building systems that matter.
          Currently leading development at KCC Infra, Pune.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem' }}>
          <MagneticButton onClick={() => getLenis?.()?.scrollTo('#projects')}>
            VIEW WORK →
          </MagneticButton>
          <MagneticButton href="/resume">
            DOWNLOAD CV ↓
          </MagneticButton>
        </div>

        <div className="hero-social">
          <Dock
            items={[
              { icon: <Github size={20} />, label: 'GITHUB', href: 'https://github.com/Anshul2405' },
              { icon: <Linkedin size={20} />, label: 'LINKEDIN', href: 'https://linkedin.com/in/anshulraibole' },
              { icon: <Mail size={20} />, label: 'EMAIL', href: 'mailto:anshulraibole2003@gmail.com' },
            ]}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ bottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="h-10 w-px bg-[rgba(238,238,232,0.12)]" />
        <span className="text-[9px] tracking-[0.4em] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          SCROLL
        </span>
      </div>
    </section>
  )
}

