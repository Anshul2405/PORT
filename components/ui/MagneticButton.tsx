'use client'

import { useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import Link from 'next/link'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'outline' | 'filled' | 'compact'
  style?: CSSProperties
  className?: string
  disabled?: boolean
  pullRadius?: number
  strength?: number
}

const SPRING = { stiffness: 200, damping: 15, mass: 0.5 }

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'outline',
  style,
  className,
  disabled = false,
  pullRadius = 80,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const dist = Math.sqrt(distX * distX + distY * distY)

    if (dist < pullRadius) {
      x.set(distX * strength)
      y.set(distY * strength)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #C9A84C',
    color: hovered && !disabled ? '#0D0C0B' : '#C9A84C',
    background: hovered && !disabled ? '#C9A84C' : 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
    cursor: disabled ? 'default' : 'none',
    transition: 'background 0.25s ease, color 0.25s ease',
    borderRadius: variant === 'compact' ? '100px' : '2px',
    padding: variant === 'compact' ? '8px 20px' : '12px 28px',
    ...(variant === 'compact' && { fontSize: '10px', letterSpacing: '0.22em' }),
    ...style,
  }

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, ...baseStyles }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="link"
      className={className}
    >
      {children}
    </motion.div>
  )

  if (href && !disabled) {
    if (href.startsWith('mailto:') || href.startsWith('http')) {
      return (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {inner}
        </a>
      )
    }
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {inner}
      </Link>
    )
  }

  if (onClick && !disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ background: 'none', border: 'none', padding: 0, display: 'inline-block' }}
      >
        {inner}
      </button>
    )
  }

  return inner
}
