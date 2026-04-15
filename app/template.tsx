'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        onComplete: () => {
          if (el) el.style.transform = ''
        },
      }
    )
  }, [pathname])

  return (
    <div ref={ref} className="min-h-0">
      {children}
    </div>
  )
}
