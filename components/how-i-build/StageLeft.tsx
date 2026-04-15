'use client'

interface StageLeftProps {
  stageNumber: string
  label: string
  title: string
  description: string
  deliverable: string
  duration: string
}

export default function StageLeft({
  stageNumber,
  label,
  title,
  description,
  deliverable,
  duration,
}: StageLeftProps) {
  return (
    <div style={{
      width: '100%',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(10px, 1.1vw, 12px)',
        color: '#C9A84C',
        letterSpacing: '0.32em',
        marginBottom: 'clamp(18px, 2.5vw, 28px)',
      }}>
        {label}
      </p>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(1.85rem, 3.4vw, 3.35rem)',
        color: 'var(--white)',
        lineHeight: 1.08,
        marginBottom: 'clamp(18px, 2.2vw, 28px)',
      }}>
        {title}
      </h3>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(15px, 1.35vw, 19px)',
        color: 'rgba(180, 176, 168, 0.92)',
        lineHeight: 1.75,
        maxWidth: 'min(100%, 520px)',
        marginBottom: 'clamp(28px, 3vw, 40px)',
      }}>
        {description}
      </p>

      <div style={{
        display: 'inline-flex',
        width: 'fit-content',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(10px, 1vw, 11px)',
        border: '1px solid rgba(201,168,76,0.32)',
        padding: '10px 18px',
        borderRadius: '3px',
        color: '#C9A84C',
        letterSpacing: '0.12em',
      }}>
        DELIVERABLE: {deliverable}
      </div>

      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(10px, 1vw, 11px)',
        color: '#6B6860',
        marginTop: '14px',
      }}>
        ~{duration}
      </span>
    </div>
  )
}
