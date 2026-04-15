'use client'

interface AuroraBackgroundProps {
  className?: string
  style?: React.CSSProperties
}

export default function AuroraBackground({ className, style }: AuroraBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          top: '10%',
          left: '15%',
          borderRadius: '50%',
          background: 'rgba(201, 168, 76, 0.04)',
          filter: 'blur(120px)',
          animation: 'auroraBlob1 18s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          top: '40%',
          right: '10%',
          borderRadius: '50%',
          background: 'rgba(201, 168, 76, 0.03)',
          filter: 'blur(100px)',
          animation: 'auroraBlob2 22s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '400px',
          bottom: '5%',
          left: '30%',
          borderRadius: '50%',
          background: 'rgba(201, 168, 76, 0.02)',
          filter: 'blur(140px)',
          animation: 'auroraBlob3 15s ease-in-out infinite',
        }}
      />
    </div>
  )
}
