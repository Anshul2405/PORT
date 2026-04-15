'use client'

import { useEffect, useState } from 'react'

interface TerminalAppProps {
  isActive: boolean
  variant: 'dev' | 'test'
}

const DEV_LINES = [
  { text: 'anshul@MacBook-Pro', color: '#4ade80', suffix: ' % ', cmd: 'git checkout -b feat/how-i-build' },
  { text: "Switched to a new branch 'feat/how-i-build'", color: 'rgba(255,255,255,0.5)' },
  { text: '' },
  { text: 'anshul@MacBook-Pro', color: '#4ade80', suffix: ' % ', cmd: 'npm run dev' },
  { text: '' },
  { text: '  ▲ Next.js 15.0.0', color: 'rgba(255,255,255,0.6)' },
  { text: '  - Local: http://localhost:3000', color: 'rgba(255,255,255,0.5)' },
  { text: '  ✓ Ready in 847ms', color: '#4ade80' },
  { text: '' },
  { text: 'anshul@MacBook-Pro', color: '#4ade80', suffix: ' % ', cmd: 'git add . && git commit -m "feat: scroll animations"' },
  { text: '[feat/how-i-build a3f9d2c] feat: scroll animations', color: '#C9A84C' },
]

const TEST_RESULTS = [
  { text: '✓ API Integration Tests (3)', color: '#4ade80', indent: 0 },
  { text: '✓ Contact → Web3Forms (browser) or mailto fallback', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ GET /api/projects returns array', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Auth middleware blocks 401', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '' },
  { text: '✓ Component Tests (8)', color: '#4ade80', indent: 0 },
  { text: '✓ HeroSection renders correctly', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Navigation highlights active', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ ScrollTrigger pins sections', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ ContactForm validates email', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ ProjectCard hover state', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Terminal opens on Ctrl+`', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Magnetic button responds', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ ThemeTokens applied', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '' },
  { text: '✓ E2E Tests (4)', color: '#4ade80', indent: 0 },
  { text: '✓ Full page scroll completes', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Form submission flow', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Mobile viewport layout', color: 'rgba(255,255,255,0.6)', indent: 1 },
  { text: '✓ Dark mode rendering', color: 'rgba(255,255,255,0.6)', indent: 1 },
]

export default function TerminalApp({ isActive, variant }: TerminalAppProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const isTest = variant === 'test'
  const lines = isTest ? TEST_RESULTS : DEV_LINES

  useEffect(() => {
    if (!isActive) { setVisibleLines(0); setShowSummary(false); return }
    const timers: ReturnType<typeof setTimeout>[] = []
    const delay = isTest ? 80 : 200
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), delay * (i + 1)))
    })
    if (isTest) {
      timers.push(setTimeout(() => setShowSummary(true), delay * lines.length + 200))
    }
    return () => timers.forEach(clearTimeout)
  }, [isActive, isTest, lines])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#1a1a1a' }}>
      {/* Title bar */}
      <div style={{
        height: 32,
        background: '#2d2d2d',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #111',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6, padding: '0 12px', alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        {isTest ? (
          <div style={{ display: 'flex', marginLeft: 12, gap: 0 }}>
            <div style={{
              padding: '4px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              cursor: 'default',
            }}>
              zsh
            </div>
            <div style={{
              padding: '4px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px 4px 0 0',
              cursor: 'default',
            }}>
              vitest ●
            </div>
          </div>
        ) : (
          <span style={{
            marginLeft: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
          }}>
            zsh — 80×24
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 14, overflow: 'hidden' }}>
        {lines.map((line, i) => {
          const visible = i < visibleLines
          if (!line.text) {
            return <div key={i} style={{ height: 20, opacity: visible ? 1 : 0 }} />
          }
          const devLine = line as { text: string; color: string; suffix?: string; cmd?: string; indent?: number }
          return (
            <div key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: '20px',
              paddingLeft: (devLine.indent || 0) * 18,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}>
              <span style={{ color: devLine.color }}>{devLine.text}</span>
              {devLine.suffix && <span style={{ color: 'white' }}>{devLine.suffix}</span>}
              {devLine.cmd && <span style={{ color: 'white' }}>{devLine.cmd}</span>}
            </div>
          )
        })}

        {/* Test summary */}
        {isTest && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: 10,
            paddingTop: 10,
            opacity: showSummary ? 1 : 0,
            transform: showSummary ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '22px' }}>
              <span style={{ color: '#C9A84C' }}>Test Suites: </span>
              <span style={{ color: '#4ade80' }}>3 passed</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>, 3 total</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '22px' }}>
              <span style={{ color: '#C9A84C' }}>Tests:       </span>
              <span style={{ color: '#4ade80' }}>15 passed</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>, 15 total</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '22px', color: 'rgba(255,255,255,0.4)' }}>
              Duration:    2.34s
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              color: '#4ade80',
              marginTop: 10,
            }}>
              ALL SYSTEMS GO ✓
            </p>
          </div>
        )}

        {/* Blinking cursor */}
        {!isTest && visibleLines >= lines.length && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 4 }}>
            <span style={{ color: '#4ade80' }}>anshul@MacBook-Pro</span>
            <span style={{ color: 'white' }}> % </span>
            <span className="hib-blink-cursor" style={{ color: 'white', fontSize: 13 }}>█</span>
          </div>
        )}
      </div>
    </div>
  )
}
