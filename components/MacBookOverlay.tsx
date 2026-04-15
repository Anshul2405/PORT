'use client'

import { Suspense, useRef, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import MacOSDesktop from './how-i-build/MacOSDesktop'

/* ─── Shared mutable state (R3F ↔ DOM, no React re-renders) ─── */
const _s = {
  phase: 0,
  hibProgress: 0,
  rect: { x: 0, y: 0, w: 0, h: 0 },
}

/* ─── Hero screen canvas (same as HeroScene) ─── */
function buildScreenCanvas(): HTMLCanvasElement {
  const W = 1600, H = 1000
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(200,169,110,0.035)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

  ctx.fillStyle = 'rgba(200,169,110,0.08)'
  ctx.fillRect(0, 0, W, 48)
  const dots: [string, number][] = [['#FF5F57', 28], ['#FFBD2E', 54], ['#28CA41', 80]]
  dots.forEach(([c, x]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 24, 7, 0, Math.PI * 2); ctx.fill() })
  ctx.fillStyle = 'rgba(200,169,110,0.5)'
  ctx.font = '500 14px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('anshulraibole.dev', W / 2, 28)
  ctx.textAlign = 'left'

  return canvas
}

function drawRightPanel(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(200,169,110,0.12)'; ctx.fillRect(818, 56, 1, 920)
  ctx.fillStyle = '#EEEEE8'; ctx.font = '700 56px sans-serif'
  ctx.fillText('ANSHUL', 860, 170)
  ctx.fillStyle = '#C8A96E'; ctx.fillText('RAIBOLE', 860, 236)
  ctx.fillStyle = '#C8A96E'; ctx.fillRect(860, 252, 480, 2)
  ctx.fillStyle = 'rgba(238,238,232,0.45)'; ctx.font = '500 19px monospace'
  ctx.fillText('Full-Stack Engineer', 860, 294)
  ctx.fillText('AI & Data Science', 860, 320)
  ctx.fillStyle = 'rgba(200,169,110,0.1)'; ctx.fillRect(860, 350, 600, 1)

  const stats = [
    { num: '2+', label: 'YRS EXP' }, { num: '10+', label: 'PROJECTS' },
    { num: 'N3', label: '日本語' }, { num: 'AIML', label: 'SPECIALIZATION' },
  ]
  stats.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 860 + col * 300, y = 380 + row * 185
    ctx.fillStyle = 'rgba(200,169,110,0.035)'; ctx.fillRect(x, y, 275, 160)
    ctx.fillStyle = '#C8A96E'; ctx.fillRect(x, y, 3, 160)
    ctx.font = '700 58px sans-serif'; ctx.fillText(s.num, x + 18, y + 68)
    ctx.fillStyle = 'rgba(238,238,232,0.35)'; ctx.font = '500 15px monospace'
    ctx.fillText(s.label, x + 18, y + 96)
  })

  ctx.fillStyle = 'rgba(200,169,110,0.2)'; ctx.fillRect(860, 920, 600, 1)
  ctx.fillStyle = 'rgba(200,169,110,0.35)'; ctx.font = '400 13px monospace'
  ctx.fillText('MONOZUKURI — 物作り', 860, 955)
}

/* ─── 3D MacBook Model ─── */
function MacBookModel() {
  const { scene } = useGLTF('/models/macbook_opt.glb')
  const groupRef = useRef<THREE.Group>(null!)
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ready = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    ready.current = false
    tlRef.current?.kill()

    scene.scale.setScalar(1)
    scene.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(scene)
    const sz = box.getSize(new THREE.Vector3())
    const s = 2.0 / Math.max(sz.x, sz.y, sz.z)
    scene.scale.setScalar(s)
    const c = new THREE.Box3().setFromObject(scene).getCenter(new THREE.Vector3())
    scene.position.set(-c.x, -c.y, -c.z)

    const cvs = buildScreenCanvas()
    const ctx = cvs.getContext('2d')!
    const tex = new THREE.CanvasTexture(cvs)
    tex.colorSpace = THREE.SRGBColorSpace

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name === 'Object_123') {
        const mat = new THREE.MeshStandardMaterial({
          map: tex, emissiveMap: tex,
          emissive: new THREE.Color('#ffffff'),
          emissiveIntensity: 0.45,
          roughness: 0.15, metalness: 0,
          color: new THREE.Color('#ffffff'),
          transparent: true,
        })
        ;(child as THREE.Mesh).material = mat
        matRef.current = mat
      }
    })

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      ctx.beginPath(); ctx.rect(0, 48, 800, 952); ctx.clip()
      const a = img.naturalWidth / img.naturalHeight
      let dw = 800, dh = dw / a
      if (dh < 952) { dh = 952; dw = dh * a }
      ctx.drawImage(img, (800 - dw) / 2, 48 + (952 - dh) / 2, dw, dh)
      const g = ctx.createLinearGradient(620, 0, 810, 0)
      g.addColorStop(0, 'rgba(8,8,8,0)'); g.addColorStop(1, 'rgba(8,8,8,0.85)')
      ctx.fillStyle = g; ctx.fillRect(0, 48, 810, 952)
      ctx.restore()
      drawRightPanel(ctx)
      tex.needsUpdate = true
    }
    img.onerror = () => { drawRightPanel(ctx); tex.needsUpdate = true }
    img.src = '/images/anshul.png'

    group.position.set(0, -0.3, 0)
    group.rotation.set(0.14, -0.28, 0)

    const tl = gsap.timeline({ delay: 0.5 })
    tlRef.current = tl
    tl.to(group.position, { y: 0.4, duration: 1.5, ease: 'power3.out' }, 0)
    tl.to(group.rotation, { x: 0.04, y: -0.14, duration: 1.6, ease: 'power2.out' }, 0.1)
    tl.call(() => { ready.current = true }, [], 1.6)

    return () => {
      tl.kill(); tlRef.current = null
      tex.dispose()
      img.onload = null; img.onerror = null
    }
  }, [scene])

  useFrame(({ size, camera }) => {
    const _cam = camera
    const g = groupRef.current
    if (!g || !ready.current) return

    const p = _s.phase
    const cam = _cam as THREE.PerspectiveCamera
    const halfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const halfW = halfH * (size.width / size.height)

    const heroX = 0.52 * halfW
    const targetX = heroX * (1 - p)
    const targetY = 0.4 - p * 0.1
    const targetRotX = 0.04 * (1 - p)
    const targetRotY = -0.14 * (1 - p)

    const mi = Math.max(0, 1 - p * 2.5)
    const t = Date.now() * 0.001
    const float = Math.sin(t * 0.5) * 0.03 * (1 - p)

    const lerp = p > 0 ? 0.12 : 0.06
    g.position.x += (targetX - g.position.x) * lerp
    g.position.y += (targetY + float + mouse.current.y * 0.025 * mi - g.position.y) * lerp
    g.rotation.x += (targetRotX + mouse.current.y * 0.025 * mi - g.rotation.x) * 0.06
    g.rotation.y += (targetRotY + mouse.current.x * 0.07 * mi - g.rotation.y) * 0.06

    const scl = 1 + p * 0.15
    g.scale.setScalar(scl)

    if (matRef.current) {
      const texOp = Math.max(0, 1 - Math.max(0, p - 0.4) / 0.4)
      matRef.current.emissiveIntensity = 0.45 * Math.max(0.15, texOp)
      matRef.current.opacity = Math.max(0.25, texOp)
    }

    // Deterministic screen rect based on viewport + phase
    // When centered (p=1): screen is ~48% viewport width, centered, slightly above mid
    const vw = size.width
    const vh = size.height
    const screenW = vw * 0.38 * scl
    const screenH = screenW * (10 / 16)
    const heroScreenX = vw * 0.62
    const centeredScreenX = (vw - screenW) / 2
    const screenX = heroScreenX + (centeredScreenX - heroScreenX) * p
    const screenY = vh * 0.18
    _s.rect.x = screenX
    _s.rect.y = screenY
    _s.rect.w = screenW
    _s.rect.h = screenH
  })

  return <group ref={groupRef}><primitive object={scene} /></group>
}

/* ─── MacBook fixed overlay ─── */
const DESKTOP_W = 900

interface MacBookOverlayProps {
  activeStage: number
  visible?: boolean
}

export default function MacBookOverlay({ activeStage, visible = true }: MacBookOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const showDesktopRef = useRef(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#macbook-transition',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => { _s.phase = self.progress },
      })

      ScrollTrigger.create({
        trigger: '#how-i-build',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0,
        onUpdate: (self) => { _s.hibProgress = self.progress },
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let active = true
    const loop = () => {
      if (!active) return
      const p = _s.phase
      const el = overlayRef.current
      const wrap = canvasWrapRef.current
      const desk = desktopRef.current

      if (el) {
        if (p > 0.6) {
          const { x, y, w } = _s.rect
          const scale = Math.max(0.1, w / DESKTOP_W)
          el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
          el.style.opacity = `${Math.min(1, Math.max(0, (p - 0.65) / 0.25))}`
          el.style.pointerEvents = p > 0.95 ? 'auto' : 'none'

          if (!showDesktopRef.current && desk) {
            desk.style.display = 'block'
            showDesktopRef.current = true
          }
        } else {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          if (showDesktopRef.current && desk) {
            desk.style.display = 'none'
            showDesktopRef.current = false
          }
        }
      }

      if (wrap) {
        const exit = _s.hibProgress > 0.92
          ? Math.max(0, 1 - (_s.hibProgress - 0.92) / 0.08)
          : 1
        wrap.style.opacity = `${exit}`
      }

      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return () => { active = false }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        ref={canvasWrapRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 12,
        }}
      >
        <Canvas
          camera={{ position: [0, 0.4, 5.8], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.75]}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.0
            gl.outputColorSpace = THREE.SRGBColorSpace
          }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 4]} intensity={1.6} color="#ffffff" />
          <directionalLight position={[-2, 2, 2]} intensity={0.35} color="#e8d8c0" />
          <fog attach="fog" args={['#000000', 12, 24]} />
          <Suspense fallback={null}>
            <MacBookModel />
          </Suspense>
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.18} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.3} />
          </EffectComposer>
        </Canvas>
      </div>

      <div
        ref={overlayRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: DESKTOP_W, height: DESKTOP_W * 10 / 16,
          opacity: 0, zIndex: 13,
          pointerEvents: 'none',
          transformOrigin: 'top left',
          overflow: 'hidden', borderRadius: 4,
          boxShadow: '0 0 40px rgba(201,168,76,0.15)',
        }}
      >
        <div ref={desktopRef} style={{ display: 'none', width: '100%', height: '100%' }}>
          <MacOSDesktop activeStage={activeStage} />
        </div>
      </div>
    </>
  )
}

useGLTF.preload('/models/macbook_opt.glb')
