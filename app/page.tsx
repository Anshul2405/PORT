'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowIBuild from '@/components/HowIBuild'
import { TerminalProvider } from '@/lib/terminal-context'
import { usePerformanceLiteMode } from '@/lib/use-performance-mode'

// Code-split everything below the hero fold so it doesn't block initial parse
const SharedMacBook    = dynamic(() => import('@/components/SharedMacBook'),    { ssr: false })
const About            = dynamic(() => import('@/components/About'))
const Experience       = dynamic(() => import('@/components/Experience'))
const Projects         = dynamic(() => import('@/components/Projects'))
const Skills           = dynamic(() => import('@/components/Skills'))
const CurrentlyBuilding = dynamic(() => import('@/components/CurrentlyBuilding'))
const Contact          = dynamic(() => import('@/components/Contact'))
const CustomCursor     = dynamic(() => import('@/components/CustomCursor'),     { ssr: false })
const NavDots          = dynamic(() => import('@/components/NavDots'),          { ssr: false })
const TerminalOverlay  = dynamic(() => import('@/components/TerminalOverlay'),  { ssr: false })

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hibStage, setHibStage] = useState(0)
  const performanceLite = usePerformanceLiteMode()
  const handleStageChange = useCallback((stage: number) => setHibStage(stage), [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isLoaded])

  useEffect(() => {
    document.documentElement.classList.toggle('perf-lite', performanceLite)
    return () => document.documentElement.classList.remove('perf-lite')
  }, [performanceLite])

  return (
    <TerminalProvider>
      {!performanceLite && <CustomCursor />}
      <ScrollProgressBar />
      <TerminalOverlay />
      <SharedMacBook howIBuildStage={hibStage} />
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      <main aria-hidden={!isLoaded} className="relative min-w-0 w-full overflow-x-clip">
        <Navbar />
        <NavDots />
        <Hero />
        <HowIBuild onStageChange={handleStageChange} />
        <About />
        <Experience />
        <Projects />
        <CurrentlyBuilding />
        <Skills />
        <Contact />
      </main>
    </TerminalProvider>
  )
}

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const bar = barRef.current
          if (!bar) return
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          bar.style.width = docHeight > 0 ? `${(window.scrollY / docHeight) * 100}%` : '0%'
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 'calc(var(--nav-h) + env(safe-area-inset-top, 0px))',
        left: 0,
        height: '1px',
        background: '#C9A84C',
        zIndex: 9999,
        width: '0%',
        pointerEvents: 'none',
      }}
    />
  )
}
