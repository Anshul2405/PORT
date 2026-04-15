'use client'

const STAGE_TIMES = ['9:00', '9:45', '11:30', '14:00', '16:30', '17:15', '18:00']
const STAGE_APP_NAMES = ['Notion', 'Figma', 'Code', 'Code', 'Terminal', 'Chrome', 'Slack']

export default function MacOSMenuBar({ activeStage }: { activeStage: number }) {
  const time = STAGE_TIMES[activeStage] ?? '9:00'
  const appName = STAGE_APP_NAMES[activeStage] ?? 'Finder'

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 28,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      justifyContent: 'space-between',
      zIndex: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>●</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 600,
        }}>
          {appName}
        </span>
        {['File', 'Edit', 'View'].map((item) => (
          <span key={item} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 400,
          }}>
            {item}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ opacity: 0.7 }}>
          <path d="M7 9.5a1 1 0 100-2 1 1 0 000 2z" fill="white"/>
          <path d="M4.17 6.83a4 4 0 015.66 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M1.76 4.41a7 7 0 0110.49 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" style={{ opacity: 0.7 }}>
          <rect x="0.5" y="0.5" width="16" height="9" rx="2" stroke="white" strokeWidth="1"/>
          <rect x="17" y="3" width="2" height="4" rx="0.5" fill="white" fillOpacity="0.4"/>
          <rect x="2" y="2" width="10" height="6" rx="1" fill="white" fillOpacity="0.8"/>
        </svg>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.7)',
        }}>
          {time}
        </span>
      </div>
    </div>
  )
}
