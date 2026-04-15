'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const CORNER_MARGIN = 48
const CORNER_SEQUENCE = ['tl', 'tr', 'br', 'bl'] as const

function cornerHit(cx: number, cy: number, w: number, h: number): string | null {
  const l = cx < CORNER_MARGIN
  const r = cx > w - CORNER_MARGIN
  const t = cy < CORNER_MARGIN
  const b = cy > h - CORNER_MARGIN
  if (t && l) return 'tl'
  if (t && r) return 'tr'
  if (b && r) return 'br'
  if (b && l) return 'bl'
  return null
}

let audioCtx: AudioContext | null = null

function playTone(freq: number, duration: number, volume = 0.04) {
  try {
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + duration + 0.02)
  } catch {
    /* no audio */
  }
}

type CursorVariant = 'default' | 'link' | 'orbit'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -100, y: -100 })
  const ringRefPosition = useRef({ x: -100, y: -100 })
  const frameRef = useRef<number>(0)
  const [isTouch, setIsTouch] = useState(false)
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<CursorVariant>('default')
  const prevVariant = useRef<CursorVariant>('default')
  const hoverSoundAt = useRef(0)
  const eggStep = useRef(0)
  const eggTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [eggOpen, setEggOpen] = useState(false)

  const resetEggTimer = useCallback(() => {
    if (eggTimeout.current) clearTimeout(eggTimeout.current)
    eggTimeout.current = setTimeout(() => {
      eggStep.current = 0
    }, 2800)
  }, [])

  useEffect(() => {
    const touchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

    if (touchDevice) {
      document.documentElement.classList.add('touch-device')
      const frame = window.requestAnimationFrame(() => setIsTouch(true))
      return () => window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (isTouch) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const animate = () => {
      const { x, y } = mouseRef.current

      ringRefPosition.current.x += (x - ringRefPosition.current.x) * 0.18
      ringRefPosition.current.y += (y - ringRefPosition.current.y) * 0.18

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${ringRefPosition.current.x}px, ${ringRefPosition.current.y}px, 0)`

      frameRef.current = window.requestAnimationFrame(animate)
    }

    const updateTargetState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const interactive = element?.closest('a, button, [data-cursor], [role="button"], input, textarea')
      const orbit = element?.closest('#shared-macbook-container, [data-cursor-orbit]')
      if (interactive) setVariant('link')
      else if (orbit) setVariant('orbit')
      else setVariant('default')
    }

    const handleMove = (event: MouseEvent) => {
      if (!visible) setVisible(true)
      mouseRef.current = { x: event.clientX, y: event.clientY }
      updateTargetState(event.target)

      const w = window.innerWidth
      const h = window.innerHeight
      const c = cornerHit(event.clientX, event.clientY, w, h)
      if (c) {
        const need = CORNER_SEQUENCE[eggStep.current]
        if (c === need) {
          eggStep.current += 1
          resetEggTimer()
          if (eggStep.current >= CORNER_SEQUENCE.length) {
            eggStep.current = 0
            setEggOpen(true)
            playTone(523, 0.12, 0.06)
            playTone(784, 0.12, 0.05)
          }
        } else if (c === CORNER_SEQUENCE[0]) {
          eggStep.current = 1
          resetEggTimer()
        }
      }
    }

    const handleLeave = () => {
      setVisible(false)
      mouseRef.current = { x: -100, y: -100 }
      ringRefPosition.current = { x: -100, y: -100 }
    }

    const handleMouseOver = (event: MouseEvent) => updateTargetState(event.target)
    const handleMouseOut = (event: MouseEvent) => updateTargetState(event.relatedTarget)

    const handleClick = () => {
      playTone(660, 0.06, 0.035)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('click', handleClick, true)

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('click', handleClick, true)
      window.cancelAnimationFrame(frameRef.current)
      if (eggTimeout.current) clearTimeout(eggTimeout.current)
    }
  }, [isTouch, visible, resetEggTimer])

  useEffect(() => {
    if (isTouch) return
    if (variant === 'link' && prevVariant.current !== 'link') {
      const now = performance.now()
      if (now - hoverSoundAt.current > 120) {
        hoverSoundAt.current = now
        playTone(440, 0.04, 0.025)
      }
    }
    prevVariant.current = variant
  }, [variant, isTouch])

  if (isTouch) return null

  const ringPx = variant === 'orbit' ? 56 : variant === 'link' ? 44 : 12
  const crossArm = variant === 'orbit' ? 32 : variant === 'link' ? 24 : 16
  const dotPx = variant === 'orbit' ? 5 : 4

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,width,height,box-shadow] duration-200"
        style={{
          width: dotPx,
          height: dotPx,
          opacity: visible ? 1 : 0,
          background: 'radial-gradient(circle at 32% 28%, #fff6e0 0%, var(--gold) 42%, #8a7344 100%)',
          boxShadow:
            variant === 'orbit'
              ? '0 0 14px rgba(200,169,110,0.55), 0 0 2px rgba(255,255,255,0.35) inset'
              : '0 0 10px rgba(200,169,110,0.4), 0 0 1px rgba(255,255,255,0.25) inset',
        }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,opacity,background-color,border-color,border-style] duration-200 ease-out"
        style={{
          width: ringPx,
          height: ringPx,
          opacity: visible ? 1 : 0,
          borderWidth: 1,
          borderStyle: variant === 'orbit' ? 'dashed' : 'solid',
          borderColor:
            variant === 'orbit'
              ? 'rgba(200,169,110,0.5)'
              : variant === 'link'
                ? 'rgba(200,169,110,0.65)'
                : 'rgba(200,169,110,0.35)',
          backgroundColor:
            variant === 'link' ? 'rgba(200,169,110,0.07)' : variant === 'orbit' ? 'rgba(200,169,110,0.04)' : 'transparent',
        }}
        aria-hidden
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: crossArm,
            height: crossArm,
            transform: 'translate(-50%, -50%)',
            opacity: variant === 'default' ? 0.22 : variant === 'link' ? 0.38 : 0.48,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)]"
            style={{ width: crossArm }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)]"
            style={{ height: crossArm }}
          />
        </div>
      </div>
      {eggOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/75 p-6"
          role="dialog"
          aria-label="Easter egg"
        >
          <div
            className="max-w-md rounded-lg border border-[var(--gold)] bg-[var(--black)] p-8 text-center"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <p className="text-lg text-[var(--gold)]">物作り PROTOCOL</p>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(238,238,232,0.72)]">
              Corner pattern unlocked. Mini-game: tap the gold dot 5 times in under 3s.
            </p>
            <EggMiniGame onClose={() => setEggOpen(false)} />
            <button
              type="button"
              data-cursor="link"
              className="mt-6 text-[10px] tracking-[0.2em] text-[var(--muted)] underline"
              onClick={() => setEggOpen(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  )
}
function EggMiniGame({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0)
  const [deadline, setDeadline] = useState<number | null>(null)
  const started = useRef(false)

  const start = () => {
    if (started.current) return
    started.current = true
    setScore(0)
    setDeadline(Date.now() + 3000)
  }

  useEffect(() => {
    if (deadline === null || score === 0) return
    const id = setInterval(() => {
      if (Date.now() > deadline! && score < 5) {
        setDeadline(null)
        started.current = false
      }
    }, 200)
    return () => clearInterval(id)
  }, [deadline, score])

  useEffect(() => {
    if (score >= 5) {
      playTone(880, 0.15, 0.05)
      const t = setTimeout(onClose, 800)
      return () => clearTimeout(t)
    }
  }, [score, onClose])

  return (
    <div className="mt-6">
      <button
        type="button"
        data-cursor="link"
        onClick={start}
        className="rounded-full border border-[var(--gold)] px-4 py-2 text-[11px] tracking-[0.15em] text-[var(--gold)]"
      >
        {deadline ? `TAPS ${score}/5` : 'START'}
      </button>
      {deadline && (
        <button
          type="button"
          className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--black)]"
          onClick={() => setScore((s) => s + 1)}
        >
          ●
        </button>
      )}
    </div>
  )
}

