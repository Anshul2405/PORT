'use client'

import { useEffect, useState } from 'react'

const CHANNELS = [
  { name: '# general', active: false },
  { name: '# dev-updates', active: true },
  { name: '# feedback', active: false },
  { name: '🔒 client-private', active: false },
]

const MESSAGES = [
  { from: 'CR', name: 'Client Raj', time: '12:34 PM', text: 'The dashboard loads really fast now 🔥', isMe: false },
  { from: 'AR', name: 'Anshul Raibole', time: '12:35 PM', text: 'Optimized the DB queries — 40% faster response.', isMe: true },
  { from: 'CR', name: 'Client Raj', time: '12:36 PM', text: 'Can we add export to CSV?', isMe: false },
  { from: 'AR', name: 'Anshul Raibole', time: '12:38 PM', text: 'Already on it — PR up in 2hrs.', isMe: true },
  { from: 'CR', name: 'Client Raj', time: '12:40 PM', text: 'You\'re the best 🚀', isMe: false },
]

export default function SlackApp({ isActive }: { isActive: boolean }) {
  const [visibleMsgs, setVisibleMsgs] = useState(0)

  useEffect(() => {
    if (!isActive) { setVisibleMsgs(0); return }
    const timers = MESSAGES.map((_, i) =>
      setTimeout(() => setVisibleMsgs(i + 1), 400 + 350 * (i + 1))
    )
    return () => timers.forEach(clearTimeout)
  }, [isActive])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1a1d21' }}>
      {/* Sidebar */}
      <div style={{
        width: 190,
        background: '#19171d',
        padding: '12px 0',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '0 14px 14px',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 14,
          color: 'white',
        }}>
          Client Project
        </div>
        {CHANNELS.map((ch) => (
          <div key={ch.name} style={{
            padding: '3px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: ch.active ? 'white' : 'rgba(255,255,255,0.5)',
            background: ch.active ? 'rgba(255,255,255,0.08)' : 'transparent',
            cursor: 'default',
          }}>
            {ch.name}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Channel header */}
        <div style={{
          height: 44,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 14,
            color: 'white',
          }}>
            # dev-updates
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '12px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MESSAGES.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 10,
              opacity: i < visibleMsgs ? 1 : 0,
              transform: i < visibleMsgs ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}>
              {/* Avatar */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: msg.isMe ? '#C9A84C' : '#4A154B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}>
                {msg.from}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'white',
                  }}>
                    {msg.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {msg.time}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: '#e8e8e8',
                  lineHeight: 1.5,
                  marginTop: 2,
                }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
          <div style={{
            background: '#222529',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
              flex: 1,
            }}>
              Message #dev-updates
            </span>
            <span className="hib-blink-cursor" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>|</span>
          </div>
        </div>
      </div>
    </div>
  )
}
