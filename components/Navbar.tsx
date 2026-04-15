'use client'

import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { TerminalTrigger } from '@/components/TerminalOverlay'
import MagneticButton from '@/components/ui/MagneticButton'
import { ArMonogram } from '@/components/brand'

const SECTIONS = [
  { id: 'hero', number: '01', label: 'HERO', labelJa: 'ヒーロー' },
  { id: 'about', number: '02', label: 'ABOUT', labelJa: '概要' },
  { id: 'experience', number: '03', label: 'EXPERIENCE', labelJa: '職務経歴' },
  { id: 'projects', number: '04', label: 'PROJECTS', labelJa: 'プロジェクト' },
  { id: 'skills', number: '05', label: 'SKILLS', labelJa: 'スキル' },
  { id: 'contact', number: '06', label: 'CONTACT', labelJa: '連絡先' },
] as const

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [locale, setLocale] = useState<'en' | 'ja'>('en')
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    const nav = navRef.current
    const progress = progressRef.current
    if (!nav || !progress) return

    const updateScrollState = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(progress, { scaleX: self.progress })
        setScrolled(self.scroll() > window.innerHeight * 0.5)
      },
    })

    const triggers = SECTIONS.map((section, index) => {
      const element = document.getElementById(section.id)
      if (!element) return null

      return ScrollTrigger.create({
        trigger: element,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      })
    })

    return () => {
      updateScrollState.kill()
      triggers.forEach((trigger) => trigger?.kill())
    }
  }, [])

  const current = SECTIONS[activeSection]
  const sectionLabel = locale === 'ja' ? current.labelJa : current.label

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-[120] border-b pt-[env(safe-area-inset-top,0px)] transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5, 5, 5, 0.72)' : 'transparent',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)' : 'none',
      }}
      aria-label="Main"
    >
      <div ref={progressRef} className="nav-progress-fill absolute inset-x-0 top-0 h-px bg-[var(--gold)]" />

      <div className="section-container nav-shell flex h-[var(--nav-h)] min-h-[var(--nav-h)] items-center gap-3 py-1 sm:gap-4">
        <div className="nav-left flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <a
            href="#hero"
            data-cursor="link"
            className="shrink-0 p-1 pt-3 text-[var(--gold)] transition-opacity hover:opacity-90 [-webkit-tap-highlight-color:transparent]"
            aria-label="Anshul Raibole — home"
          >
            <div
              className="nav-logo-revolve w-11 sm:w-[3.25rem] md:w-[3.75rem]"
              style={{
                aspectRatio: '407 / 496',
                WebkitBackfaceVisibility: 'visible',
                backfaceVisibility: 'visible',
              }}
            >
              <ArMonogram
                className="block h-full w-full"
                aria-hidden
                imgSizes="(min-width: 768px) 60px, (min-width: 640px) 52px, 44px"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </a>
          <span className="hidden h-6 w-px shrink-0 bg-[var(--border)] sm:block" />
          <span
            className="hidden max-w-[min(48vw,12rem)] truncate text-[11px] tracking-[0.22em] text-[rgba(238,238,232,0.78)] sm:block sm:max-w-none md:text-xs"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ANSHUL RAIBOLE
          </span>
        </div>

        <div className="nav-right ml-auto flex shrink-0 items-center gap-3 sm:gap-4 md:gap-6">
          <div
            className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.01)] px-3 py-1.5 text-[10px] tracking-[0.24em] md:flex"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="text-[var(--gold)]">{current.number}</span>
            <span className="text-[var(--muted)]">/</span>
            <span key={current.id} className="text-[rgba(238,238,232,0.8)]">
              {sectionLabel}
            </span>
          </div>

          <button
            type="button"
            data-cursor="link"
            onClick={() => setLocale((l) => (l === 'en' ? 'ja' : 'en'))}
            className="hidden rounded-full border border-[var(--border)] px-2.5 py-1 text-[9px] tracking-[0.2em] text-[var(--gold)] transition-colors hover:bg-[var(--gold-dim)] md:block"
            style={{ fontFamily: 'var(--font-mono)' }}
            title={locale === 'en' ? '日本語表示（採用向け）' : 'English view'}
            aria-pressed={locale === 'ja'}
            aria-label="Toggle Japanese labels for international recruitment"
          >
            {locale === 'en' ? '日本語' : 'EN'}
          </button>

          <TerminalTrigger />

          <span className="hidden h-4 w-px bg-[var(--border)] md:block" />

          <span
            className="hidden text-[11px] text-[#6B6860] md:block"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            IST {time}
          </span>

          <div className="hidden items-center gap-2 md:flex">
            <span
              className="h-2 w-2 rounded-full bg-[var(--gold)]"
              style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
            />
            <span
              className="text-[10px] tracking-[0.22em] text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {locale === 'ja' ? '採用・協業歓迎' : 'OPEN TO WORK'}
            </span>
          </div>

          <MagneticButton
            href="/resume"
            variant="compact"
            pullRadius={60}
            strength={0.3}
          >
            DOWNLOAD CV
          </MagneticButton>
        </div>
      </div>
    </nav>
  )
}
