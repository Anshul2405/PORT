'use client'

import { useEffect, useState } from 'react'

const PAGES = [
  { emoji: '📋', name: 'Project Brief' },
  { emoji: '✅', name: 'Requirements', selected: true },
  { emoji: '🗺️', name: 'User Flows' },
  { emoji: '💰', name: 'Budget & Timeline' },
]

const CHECKLIST = [
  { text: 'Client goals & success metrics defined', done: true },
  { text: 'User persona mapped', done: true },
  { text: 'Technical stack decided', done: true },
  { text: 'Timeline & milestones agreed', done: true },
  { text: 'Scope locked', done: false },
  { text: 'Budget confirmed', done: false },
]

const TECH_TABLE = [
  { req: 'Real-time data', sol: 'WebSocket + Redis' },
  { req: 'AI features', sol: 'FastAPI + PyTorch' },
  { req: 'Mobile support', sol: 'React Native' },
]

export default function NotionApp({ isActive }: { isActive: boolean }) {
  const [visibleItems, setVisibleItems] = useState(0)
  const [tableVisible, setTableVisible] = useState(0)
  const [scopeChecked, setScopeChecked] = useState(false)

  useEffect(() => {
    if (!isActive) { setVisibleItems(0); setTableVisible(0); setScopeChecked(false); return }
    const timers: ReturnType<typeof setTimeout>[] = []
    CHECKLIST.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleItems(i + 1), 120 * (i + 1)))
    })
    timers.push(setTimeout(() => setScopeChecked(true), 900))
    TECH_TABLE.forEach((_, i) => {
      timers.push(setTimeout(() => setTableVisible(i + 1), 1000 + 80 * (i + 1)))
    })
    return () => timers.forEach(clearTimeout)
  }, [isActive])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#191919' }}>
      {/* Sidebar */}
      <div style={{
        width: 200,
        background: '#111111',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 0',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '0 12px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: 'white',
        }}>
          Anshul&apos;s Workspace
        </div>
        {PAGES.map((page) => (
          <div key={page.name} style={{
            padding: '4px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: page.selected ? 'white' : 'rgba(255,255,255,0.6)',
            background: page.selected ? 'rgba(255,255,255,0.06)' : 'transparent',
            cursor: 'default',
            display: 'flex',
            gap: 8,
          }}>
            <span>{page.emoji}</span>
            {page.name}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px 48px', overflow: 'hidden' }}>
        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 26,
          color: 'white',
          marginBottom: 6,
        }}>
          Requirements Document
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 28,
        }}>
          Last edited just now · Anshul Raibole
        </p>

        {/* Checklist */}
        <div style={{ marginBottom: 24 }}>
          {CHECKLIST.map((item, i) => {
            const visible = i < visibleItems
            const checked = item.done || (i === 4 && scopeChecked)
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: '#e8e8e8',
                lineHeight: '32px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  border: checked ? 'none' : '2px solid rgba(255,255,255,0.3)',
                  background: checked ? '#C9A84C' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: '#0a0a0a',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}>
                  {checked && '✓'}
                </div>
                <span style={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>
                  {item.text}
                </span>
              </div>
            )
          })}
        </div>

        {/* Tech table */}
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255,255,255,0.4)',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            letterSpacing: '0.1em',
          }}>
            <span>REQUIREMENT</span>
            <span>SOLUTION</span>
          </div>
          {TECH_TABLE.map((row, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              color: '#e8e8e8',
              padding: '8px 12px',
              borderBottom: i < TECH_TABLE.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              opacity: i < tableVisible ? 1 : 0,
              transform: i < tableVisible ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.req}</span>
              <span>{row.sol}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
