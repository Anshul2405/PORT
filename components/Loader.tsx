'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const LoaderSculpture = dynamic(() => import('@/components/LoaderSculpture'), {
  ssr: false,
})

type LoaderProps = {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const reduceMotion = useReducedMotion() === true
  const [hidden, setHidden] = useState(false)
  const [gone, setGone] = useState(false)
  const [progress, setProgress] = useState(0)
  const calledRef = useRef(false)
  const startRef = useRef<number | null>(null)

  const fadeOutMs = reduceMotion ? 320 : 1300
  const fadeMs = reduceMotion ? 520 : 6800
  const exitMs = reduceMotion ? 720 : fadeMs + fadeOutMs + 200
  const exitAnimMs = 600
  const progressEndMs = Math.max(1, exitMs - exitAnimMs)

  useEffect(() => {
    startRef.current = performance.now()
    let raf = 0
    const tick = () => {
      const t0 = startRef.current
      if (t0 == null) return
      const elapsed = performance.now() - t0
      const next = Math.min(100, Math.round((elapsed / progressEndMs) * 100))
      setProgress(next)
      if (elapsed < exitMs + 80) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [exitMs, progressEndMs])

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), Math.max(0, exitMs - exitAnimMs))
    const t2 = setTimeout(() => {
      setGone(true)
      if (!calledRef.current) {
        calledRef.current = true
        onComplete()
      }
    }, exitMs)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete, exitMs, exitAnimMs])

  if (gone) return null

  const barMax = 200

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'max(40px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(62px, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(20px, env(safe-area-inset-right, 0px))',
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transform: hidden ? 'scale(1.1)' : 'scale(1)',
        transition: reduceMotion
          ? 'opacity 0.25s ease'
          : 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.42, 0, 0.58, 1), visibility 600ms ease',
        pointerEvents: hidden ? 'none' : 'auto',
        background:
          'radial-gradient(circle at 50% 40%, rgba(30,30,30,0.42) 0%, rgba(10,10,10,0.96) 48%, #070707 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -80px 120px rgba(0,0,0,0.38)',
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      {/* Single revolving crest — same ink asset as nav, light treatment matches ArMonogram "light" */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: 0,
          filter: 'drop-shadow(0 18px 42px rgba(0,0,0,0.65)) drop-shadow(0 0 20px rgba(201,168,76,0.12))',
        }}
      >
        <Suspense fallback={<div style={{ height: 300, width: 360 }} />}>
          <LoaderSculpture spinning={!reduceMotion} />
        </Suspense>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.15 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: barMax,
            maxWidth: 'min(200px, 52vw)',
            height: 1,
            background: 'rgba(201,168,76,0.15)',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#C9A84C',
              borderRadius: 1,
              transition: 'width 0.08s linear',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", ui-monospace, monospace',
            fontSize: '11px',
            fontVariantNumeric: 'tabular-nums',
            color: 'rgba(201,168,76,0.6)',
            letterSpacing: '0.2em',
            marginTop: 12,
          }}
        >
          {progress}%
        </span>
      </motion.div>
    </div>
  )
}
