'use client'

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { useTextScramble } from '@/lib/use-text-scramble'
import { gsap } from '@/lib/gsap'
import MagneticButton from '@/components/ui/MagneticButton'
import AuroraBackground from '@/components/ui/AuroraBackground'

interface FormState {
  name: string
  contact: string
  transmission: string
}

type SubmitPhase = 'idle' | 'transmitting' | 'encrypting' | 'sent'

function isValidEmail(s: string): boolean {
  const t = s.trim()
  return t.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/** Web3Forms error payloads use `message` or `body.message`. */
function web3formsUserMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const d = data as Record<string, unknown>
  if (typeof d.message === 'string' && d.message.length > 0) return d.message
  const body = d.body
  if (body && typeof body === 'object') {
    const m = (body as Record<string, unknown>).message
    if (typeof m === 'string' && m.length > 0) return m
  }
  return undefined
}

function CodecInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
  multiline?: boolean
  error?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const [focused, setFocused] = useState(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useLayoutEffect(() => {
    if (!lineRef.current || !indicatorRef.current) return

    const ctx = gsap.context(() => {
      if (focused) {
        gsap.to(lineRef.current, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
        tweenRef.current = gsap.to(indicatorRef.current, {
          opacity: 0.4,
          yoyo: true,
          repeat: -1,
          duration: 0.6,
        })
      } else {
        gsap.to(lineRef.current, {
          scaleX: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
        if (tweenRef.current) {
          tweenRef.current.kill()
          tweenRef.current = null
        }
        gsap.set(indicatorRef.current, { opacity: 0 })
      }
    }, wrapperRef)

    return () => ctx.revert()
  }, [focused])

  const borderBottomColor = error
    ? 'rgba(232,165,152,0.55)'
    : focused
      ? '#C9A84C'
      : 'rgba(201,168,76,0.2)'

  const sharedInputStyles: React.CSSProperties = {
    background: 'transparent',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderTopStyle: 'none',
    borderLeftStyle: 'none',
    borderRightStyle: 'none',
    borderBottomStyle: 'solid',
    borderBottomColor,
    color: '#F5F3EE',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    padding: '12px 0',
    width: '100%',
    outline: 'none',
    transition: 'border-bottom-color 0.3s',
  }

  const errId = error ? `${id}-error` : undefined

  return (
    <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: error ? '#E8A598' : focused ? '#C9A84C' : '#A39E94',
            textTransform: 'uppercase',
            transition: 'color 0.3s',
            cursor: 'pointer',
          }}
        >
          {label}
        </label>
        <span
          ref={indicatorRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: '#C9A84C',
            opacity: 0,
          }}
        >
          RECEIVING INPUT...
        </span>
      </div>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={errId}
          autoComplete="off"
          style={{
            ...sharedInputStyles,
            resize: 'none',
            lineHeight: '1.6',
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={errId}
          autoComplete={type === 'email' ? 'email' : 'name'}
          style={{
            ...sharedInputStyles,
          }}
        />
      )}

      {error ? (
        <p
          id={errId}
          role="alert"
          style={{
            marginTop: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: '#E8A598',
          }}
        >
          {error}
        </p>
      ) : null}

      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: '#C9A84C',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<FormState>({ name: '', contact: '', transmission: '' })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle')

  useTextScramble(labelRef, 'CONTACT')

  const handleCopy = useCallback(async () => {
    const email = 'anshulraibole2003@gmail.com'
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.querySelectorAll('.contact-slide-left, .contact-slide-right').forEach(el => {
            el.classList.add('visible')
          })
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const clearFieldError = useCallback((key: keyof FormState) => {
    setFormErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const runSentAnimation = useCallback(() => {
    setSubmitPhase('transmitting')
    setTimeout(() => setSubmitPhase('encrypting'), 450)
    setTimeout(() => setSubmitPhase('sent'), 900)
    setTimeout(() => {
      setSubmitPhase('idle')
      setForm({ name: '', contact: '', transmission: '' })
    }, 2800)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (submitPhase !== 'idle') return

      const errs: Partial<Record<keyof FormState, string>> = {}
      const name = form.name.trim()
      const contact = form.contact.trim()
      const msg = form.transmission.trim()

      if (name.length < 2) errs.name = 'Please enter your name.'
      if (!isValidEmail(contact)) errs.contact = 'Please enter a valid email address.'
      if (msg.length < 8) errs.transmission = 'Please write at least a few words (8+ characters).'

      if (Object.keys(errs).length > 0) {
        setFormErrors(errs)
        return
      }

      setFormErrors({})
      setSubmitError(null)

      const subject = encodeURIComponent(`Portfolio contact from ${name}`)
      const body = encodeURIComponent(`${msg}\n\n— ${name}\n${contact}`)
      const mailto = `mailto:anshulraibole2003@gmail.com?subject=${subject}&body=${body}`

      setSubmitPhase('transmitting')

      try {
        /* Web3Forms free tier blocks server-side POSTs (Next API / Vercel IP). Submit from the browser instead. */
        const web3PublicKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim()

        if (web3PublicKey) {
          const wfRes = await fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: web3PublicKey,
              subject: `Portfolio contact from ${name}`,
              name,
              email: contact,
              message: msg,
              from_name: name,
              replyto: contact,
            }),
          })

          const wfData = await wfRes.json().catch(() => ({}))
          const wfOk = wfData && typeof wfData === 'object' && (wfData as { success?: boolean }).success === true

          if (wfOk) {
            runSentAnimation()
            return
          }

          setSubmitPhase('idle')
          setSubmitError(
            web3formsUserMessage(wfData) ??
              'Could not deliver message. Check your Web3Forms key or try the email on the right.'
          )
          return
        }

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, contact, transmission: msg }),
        })

        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          fallback?: string
          message?: string
        }

        if (res.status === 501 && data.fallback === 'mailto') {
          runSentAnimation()
          window.location.href = mailto
          return
        }

        if (!res.ok || data.ok !== true) {
          setSubmitPhase('idle')
          setSubmitError(
            typeof data.message === 'string' && data.message.length > 0
              ? data.message
              : 'Could not send. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to .env.local (same key as Web3Forms) and restart the dev server, or use the email on the right.'
          )
          return
        }

        runSentAnimation()
      } catch {
        setSubmitPhase('idle')
        setSubmitError('Network error. Try again or use the email on the right.')
      }
    },
    [form, submitPhase, runSentAnimation]
  )

  const submitLabel = (): string => {
    switch (submitPhase) {
      case 'transmitting': return 'TRANSMITTING...'
      case 'encrypting': return 'ENCRYPTING...'
      case 'sent': return 'SENT ✓'
      default: return 'TRANSMIT →'
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-scanline relative overflow-hidden bg-[var(--surface)]"
    >
      <AuroraBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(200,169,110,0.12),transparent_26%)]" />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(100vw, 800px)',
          height: 'min(70vh, 600px)',
          maxWidth: '100%',
          background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div className="contact-content-inner">
          <p
            ref={labelRef}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.4em',
              color: '#C9A84C',
              marginBottom: '24px',
              paddingTop: 'clamp(72px, 18vw, 120px)',
            }}
          >
            CONTACT
          </p>

          <h2
            className="mx-auto max-w-[980px] text-[clamp(44px,6vw,98px)] font-[800] leading-[0.95] tracking-[-0.05em] text-[var(--white)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="contact-slide-left" style={{ display: 'block' }}>GOT A PROBLEM</span>
            <span className="contact-slide-right text-[var(--gold)]" style={{ display: 'block' }}>WORTH SOLVING?</span>
          </h2>

          {/* Two-column layout — centered as one block */}
          <div className="contact-grid" style={{ paddingTop: '72px', paddingBottom: '48px' }}>
            {/* LEFT — Codec form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}
            >
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#C9A84C',
              marginBottom: '48px',
            }}>
              OPEN CHANNEL
            </p>

            <CodecInput
              id="contact-name"
              label="NAME"
              value={form.name}
              error={formErrors.name}
              onChange={(name) => {
                setForm((f) => ({ ...f, name }))
                clearFieldError('name')
                setSubmitError(null)
              }}
            />
            <CodecInput
              id="contact-email"
              label="CONTACT"
              type="email"
              value={form.contact}
              error={formErrors.contact}
              onChange={(contact) => {
                setForm((f) => ({ ...f, contact }))
                clearFieldError('contact')
                setSubmitError(null)
              }}
            />
            <CodecInput
              id="contact-transmission"
              label="TRANSMISSION"
              value={form.transmission}
              error={formErrors.transmission}
              onChange={(transmission) => {
                setForm((f) => ({ ...f, transmission }))
                clearFieldError('transmission')
                setSubmitError(null)
              }}
              multiline
            />

            {submitError ? (
              <p
                role="alert"
                aria-live="polite"
                style={{
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  lineHeight: 1.5,
                  color: '#E8A598',
                }}
              >
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              data-cursor="link"
              disabled={submitPhase !== 'idle'}
              style={{
                display: 'inline-block',
                border: '1px solid #C9A84C',
                color: submitPhase === 'sent' ? '#000' : '#C9A84C',
                background: submitPhase === 'sent' ? '#C9A84C' : 'transparent',
                padding: '14px 36px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.15em',
                textDecoration: 'none',
                transition: 'all 0.3s',
                borderRadius: '2px',
                cursor: submitPhase !== 'idle' ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (submitPhase !== 'idle') return
                const after = e.currentTarget.querySelector('.btn-sweep') as HTMLElement
                if (after) after.style.transform = 'scaleX(1)'
              }}
              onMouseLeave={(e) => {
                const after = e.currentTarget.querySelector('.btn-sweep') as HTMLElement
                if (after) after.style.transform = 'scaleX(0)'
              }}
            >
              <span
                className="btn-sweep"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(201,168,76,0.1)',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease',
                  zIndex: 0,
                }}
              />
              <span style={{ position: 'relative', zIndex: 1 }}>
                {submitLabel()}
              </span>
            </button>
            </form>

            {/* RIGHT — links */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px', textAlign: 'left' }}>
            <div
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCopy() }}
              data-cursor="link"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                color: copied ? '#C9A84C' : '#E8E6E0',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#E8E6E0' }}
            >
              {copied ? 'COPIED ✓' : 'anshulraibole2003@gmail.com'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'GITHUB', href: 'https://github.com/Anshul2405' },
                { label: 'LINKEDIN', href: 'https://linkedin.com/in/anshulraibole' },
                { label: 'EMAIL', href: 'mailto:anshulraibole2003@gmail.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  data-cursor="link"
                  className="link-hover"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: '#6B6860',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6B6860' }}
                >
                  {link.label} →
                </a>
              ))}
            </div>

            <div>
              <MagneticButton href="mailto:anshulraibole2003@gmail.com" style={{ padding: '14px 36px' }}>
                START A PROJECT →
              </MagneticButton>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="contact-footer border-t border-[rgba(201,168,76,0.1)]"
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#6B6860',
        }}>
          © 2026 ANSHUL RAIBOLE
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#6B6860',
        }}>
          PUNE · INDIA
        </span>
        <button
          type="button"
          data-cursor="link"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#C9A84C'
            const arrow = e.currentTarget.querySelector('.scroll-arrow') as HTMLElement
            if (arrow) arrow.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#6B6860'
            const arrow = e.currentTarget.querySelector('.scroll-arrow') as HTMLElement
            if (arrow) arrow.style.transform = 'translateY(0)'
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#6B6860',
            letterSpacing: '0.2em',
            background: 'none',
            border: 'none',
            transition: 'color 0.2s',
            cursor: 'none',
          }}
        >
          BACK TO TOP{' '}
          <span className="scroll-arrow" style={{ display: 'inline-block', transition: 'transform 0.2s ease' }}>↑</span>
        </button>
      </footer>

    </section>
  )
}
