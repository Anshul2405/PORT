'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface DockItemData {
  icon: ReactNode
  label: string
  href: string
}

interface DockProps {
  items: DockItemData[]
  className?: string
  style?: React.CSSProperties
}

const ICON_SIZE = 36
const MAGNIFICATION = 1.4
const NEIGHBOR_MAG = 1.2
const SIGMA = 60

function gaussian(x: number, sigma: number): number {
  return Math.exp(-(x * x) / (2 * sigma * sigma))
}

function DockItem({ item, mouseX, index, totalItems }: {
  item: DockItemData
  mouseX: ReturnType<typeof useMotionValue<number>>
  index: number
  totalItems: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    if (!ref.current || val === -1000) return 1000
    const rect = ref.current.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return Math.abs(val - center)
  })

  const rawScale = useTransform(distance, (d) => {
    if (d > SIGMA * 3) return 1
    const g = gaussian(d, SIGMA)
    return 1 + (MAGNIFICATION - 1) * g
  })

  const scale = useSpring(rawScale, { stiffness: 300, damping: 25, mass: 0.3 })

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.href.startsWith('mailto') ? undefined : '_blank'}
      rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      data-cursor="link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        scale,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        textDecoration: 'none',
        position: 'relative',
        padding: '8px',
        transformOrigin: 'bottom center',
      }}
    >
      {/* Label above */}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          top: '-24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: '#C9A84C',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {item.label}
      </motion.span>

      {/* Icon */}
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hovered ? '#C9A84C' : '#6B6860',
          transition: 'color 0.2s ease',
        }}
      >
        {item.icon}
      </div>
    </motion.a>
  )
}

export default function Dock({ items, className, style }: DockProps) {
  const mouseX = useMotionValue(-1000)

  return (
    <motion.div
      className={className}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(-1000)}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: '4px',
        padding: '8px 16px',
        borderRadius: '16px',
        background: 'rgba(201, 168, 76, 0.05)',
        border: '1px solid rgba(201, 168, 76, 0.15)',
        ...style,
      }}
    >
      {items.map((item, i) => (
        <DockItem
          key={item.label}
          item={item}
          mouseX={mouseX}
          index={i}
          totalItems={items.length}
        />
      ))}
    </motion.div>
  )
}
