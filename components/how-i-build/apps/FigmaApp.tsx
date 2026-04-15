'use client'

import { useEffect, useState } from 'react'

const LAYERS = [
  { label: 'CLIENT LAYER', items: ['React / Next.js', 'React Native'] },
  { label: 'API LAYER', items: ['FastAPI / Node', 'GraphQL', 'WebSocket'] },
  { label: 'DATA LAYER', items: ['PostgreSQL', 'Redis Cache', 'S3 Storage'] },
]

const LAYER_LIST = [
  { name: 'Architecture', indent: 0, open: true },
  { name: 'Client Layer', indent: 1, open: true },
  { name: 'Background', indent: 2, open: false },
  { name: 'Title', indent: 2, open: false },
  { name: 'Items', indent: 2, open: false },
  { name: 'API Layer', indent: 1, open: false },
  { name: 'Data Layer', indent: 1, open: false },
]

export default function FigmaApp({ isActive }: { isActive: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isActive) { setVisible(false); return }
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [isActive])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', background: '#2C2C2C' }}>
      {/* Figma toolbar */}
      <div style={{
        height: 40,
        background: '#1E1E1E',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            padding: '4px 12px',
            borderRadius: 6,
            background: '#0D99FF',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'white',
            fontWeight: 500,
          }}>
            Share
          </div>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#0a0a0a',
          }}>
            AR
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Layers panel */}
        <div style={{
          width: 180,
          background: '#1E1E1E',
          borderRight: '1px solid #333',
          padding: '8px 0',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '4px 12px 8px',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.08em',
          }}>
            Layers
          </div>
          {LAYER_LIST.map((layer, i) => (
            <div key={i} style={{
              padding: '3px 12px',
              paddingLeft: 12 + layer.indent * 14,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'default',
            }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>
                {layer.open ? '▼' : '▶'}
              </span>
              {layer.name}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={{
          flex: 1,
          background: '#2C2C2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
          }}>
            {LAYERS.map((layer, i) => (
              <div key={layer.label} style={{ display: 'contents' }}>
                <div style={{
                  position: 'relative',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`,
                }}>
                  {/* Frame label (Figma style) */}
                  <div style={{
                    position: 'absolute',
                    top: -18,
                    left: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    color: '#0D99FF',
                  }}>
                    {layer.label}
                  </div>
                  {/* Frame with selection border */}
                  <div style={{
                    border: '2px solid #0D99FF',
                    borderRadius: 4,
                    padding: 14,
                    background: 'rgba(255,255,255,0.03)',
                    minWidth: 120,
                    position: 'relative',
                  }}>
                    {/* Corner handles */}
                    {[
                      { top: -3, left: -3 }, { top: -3, right: -3 },
                      { bottom: -3, left: -3 }, { bottom: -3, right: -3 },
                    ].map((pos, hi) => (
                      <div key={hi} style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        background: '#0D99FF',
                        borderRadius: 1,
                        ...pos,
                      }} />
                    ))}
                    {layer.items.map((item) => (
                      <p key={item} style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 2,
                        whiteSpace: 'nowrap',
                      }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Figma connector arrow */}
                {i < LAYERS.length - 1 && (
                  <div style={{
                    width: 32,
                    position: 'relative',
                    height: 2,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.4s ease ${(i + 1) * 0.15}s`,
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderTop: '2px dashed #0D99FF',
                      opacity: 0.5,
                    }} />
                    <div style={{
                      position: 'absolute',
                      right: -2,
                      top: -4,
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid #0D99FF',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      opacity: 0.6,
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Complexity bar */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease 0.5s',
          }}>
            COMPLEXITY: <span style={{ color: '#F24E1E' }}>████████░░</span> HIGH
          </div>
        </div>
      </div>
    </div>
  )
}
