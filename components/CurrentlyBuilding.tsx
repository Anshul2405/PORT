'use client'

const STATUS_ITEMS = [
  { label: 'STATUS', value: 'In Development' },
  { label: 'STACK', value: 'Next.js · FastAPI · PyTorch' },
  { label: 'TARGET', value: 'Q2 2026' },
]

export default function CurrentlyBuilding() {
  return (
    <section
      className="reveal"
      style={{
        background: 'rgba(201,168,76,0.03)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '88px 0',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 80px',
        }}
      >
        <div
          style={{
            position: 'relative',
            border: '1px solid rgba(201,168,76,0.2)',
            background:
              'linear-gradient(145deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 35%, rgba(0,0,0,0.45) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.1), 0 18px 60px rgba(0,0,0,0.42)',
            overflow: 'hidden',
            transition: 'transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle at 14% 24%, rgba(201,168,76,0.16), transparent 42%), radial-gradient(circle at 85% 72%, rgba(201,168,76,0.08), transparent 38%)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              alignItems: 'stretch',
            }}
          >
            {/* Left feature card */}
            <div style={{ padding: '42px 44px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#4ade80',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px #4ade80',
                    animation: 'live-blink 1.5s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#C9A84C',
                    letterSpacing: '0.3em',
                  }}
                >
                  CURRENTLY BUILDING
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                  color: 'var(--white)',
                  marginBottom: '12px',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                Next Platform Release
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  marginBottom: '26px',
                  maxWidth: '620px',
                }}
              >
                AI-powered product and workflow platform with production-ready automation and agentic workflows.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {['AI Workflows', 'Automation', 'Platform Engineering'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'rgba(238,238,232,0.82)',
                      letterSpacing: '0.14em',
                      border: '1px solid rgba(201,168,76,0.2)',
                      background: 'rgba(201,168,76,0.06)',
                      padding: '7px 12px',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  color: '#C9A84C',
                }}
              >
                BUILD LOG ACTIVE <span style={{ color: 'rgba(238,238,232,0.45)' }}>→</span>
              </span>
            </div>

            {/* Right telemetry panel */}
            <div
              style={{
                borderLeft: '1px solid rgba(201,168,76,0.16)',
                background: 'rgba(8,8,8,0.55)',
                padding: '42px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(201,168,76,0.8)',
                  letterSpacing: '0.26em',
                  marginBottom: '20px',
                }}
              >
                RELEASE TELEMETRY
              </p>
              {STATUS_ITEMS.map((item, i) => (
                <div key={item.label}>
                  {i > 0 && (
                    <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '14px 0' }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: 'var(--white)',
                        textAlign: 'right',
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
