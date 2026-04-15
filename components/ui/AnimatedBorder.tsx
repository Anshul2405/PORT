'use client'

import { type ReactNode } from 'react'

interface AnimatedBorderProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  borderRadius?: number
  speed?: number
  borderWidth?: number
}

export default function AnimatedBorder({
  children,
  className,
  style,
  borderRadius = 100,
  speed = 3,
  borderWidth = 1,
}: AnimatedBorderProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: borderWidth,
        borderRadius,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: `conic-gradient(from var(--border-angle, 0deg), #C9A84C, #E8C97A, #C9A84C, rgba(201,168,76,0.3), #C9A84C)`,
          animation: `animatedBorderSpin ${speed}s linear infinite`,
        }}
      />
      <div
        style={{
          position: 'relative',
          borderRadius: borderRadius - borderWidth,
          background: 'var(--black, #000)',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}
