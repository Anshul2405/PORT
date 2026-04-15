'use client'

import { useEffect, useState, useRef } from 'react'

const DEPLOY_STEPS = [
  { label: 'Build completed', time: '0:12' },
  { label: 'Checks passed', time: '0:08' },
  { label: 'Edge Network deployed', time: '0:03' },
  { label: 'Assigning domain...', time: '0:02' },
  { label: 'SSL certificate issued', time: '0:01' },
]

const SCORES = [
  { label: 'Performance', target: 98 },
  { label: 'Accessibility', target: 100 },
  { label: 'SEO', target: 95 },
]

export default function ChromeApp({ isActive }: { isActive: boolean }) {
  const [completedSteps, setCompletedSteps] = useState(0)
  const [scores, setScores] = useState([0, 0, 0])
  const rafRef = useRef(0)

  useEffect(() => {
    if (!isActive) { setCompletedSteps(0); setScores([0, 0, 0]); return }
    const timers: ReturnType<typeof setTimeout>[] = []
    DEPLOY_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setCompletedSteps(i + 1), 250 * (i + 1)))
    })
    timers.push(setTimeout(() => {
      const start = performance.now()
      const animate = (now: number) => {
        const p = Math.min((now - start) / 1000, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setScores(SCORES.map(s => Math.round(s.target * eased)))
        if (p < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, 250 * DEPLOY_STEPS.length + 100))
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(rafRef.current) }
  }, [isActive])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#292a2d' }}>
      {/* Tab bar */}
      <div style={{
        height: 36,
        background: '#292a2d',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 8px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6, padding: '0 6px', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{
          marginLeft: 12,
          padding: '6px 16px',
          background: '#3c4043',
          borderRadius: '8px 8px 0 0',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: '#e8eaed',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: 'white' }}>▲</span>
          Deployments – Vercel
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        height: 40,
        background: '#3c4043',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        flexShrink: 0,
      }}>
        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['←', '→', '↻'].map((c) => (
            <span key={c} style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
            }}>
              {c}
            </span>
          ))}
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1,
          background: '#202124',
          borderRadius: 20,
          padding: '4px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ fontSize: 10, color: '#4ade80' }}>🔒</span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: '#e8eaed',
          }}>
            vercel.com/anshul/portfolio/deployments
          </span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, background: '#000', padding: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 18, color: 'white' }}>▲</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'white' }}>
            Deploying to Production
          </span>
        </div>

        <div style={{
          border: '1px solid #333',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}>
          {DEPLOY_STEPS.map((step, i) => {
            const done = i < completedSteps
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                lineHeight: '28px',
                opacity: done || i <= completedSteps ? 1 : 0.3,
                transition: 'opacity 0.2s ease',
              }}>
                <span style={{ color: done ? '#4ade80' : '#C9A84C', width: 16, textAlign: 'center' }}>
                  {done ? '✓' : '▶'}
                </span>
                <span style={{ color: '#e8eaed', flex: 1 }}>{step.label}</span>
                <span style={{ color: '#666', fontSize: 11 }}>{done ? step.time : ''}</span>
              </div>
            )
          })}
        </div>

        {/* Score cards */}
        <div style={{ display: 'flex', gap: 10 }}>
          {SCORES.map((score, i) => (
            <div key={score.label} style={{
              flex: 1,
              border: '1px solid #333',
              borderRadius: 6,
              padding: '12px 8px',
              textAlign: 'center',
              opacity: completedSteps >= DEPLOY_STEPS.length ? 1 : 0,
              transform: completedSteps >= DEPLOY_STEPS.length ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.3s ease ${i * 0.1}s`,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 22,
                color: scores[i] >= 95 ? '#4ade80' : '#C9A84C',
                display: 'block',
              }}>
                {scores[i]}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#666', letterSpacing: '0.05em' }}>
                {score.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
