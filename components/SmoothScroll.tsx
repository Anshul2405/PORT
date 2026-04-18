'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LenisProvider } from '@/lib/lenis-context'
import { usePerformanceLiteMode } from '@/lib/use-performance-mode'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const performanceLite = usePerformanceLiteMode()

  useEffect(() => {
    if (performanceLite) {
      lenisRef.current = null
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      return
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [performanceLite])

  return <LenisProvider lenisRef={lenisRef}>{children}</LenisProvider>
}
