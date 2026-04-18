'use client'

import { Suspense, useRef, useEffect, useSyncExternalStore, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import {
  buildHeroScreenCanvas, drawHeroPhoto, buildStageCanvas,
} from '@/lib/macbook-screens'
import { MACBOOK_GLTF_URL } from '@/lib/macbook-model-url'
import { applyMacbookScreenTextureParams } from '@/lib/macbook-canvas-texture'
import {
  drawMacbookCrossfadeContain,
  drawMacbookScreenContain,
  getMacbookDisplayCanvasSize,
} from '@/lib/macbook-display-fit'
import { assignMacbookScreenMaterial, findMacbookScreenMesh } from '@/lib/macbook-screen-mesh'

function MacBookModel({ howIBuildStage, isMobileLandscape }: { howIBuildStage: number; isMobileLandscape: boolean }) {
  const { scene } = useGLTF(MACBOOK_GLTF_URL)
  const { invalidate } = useThree()
  const groupRef = useRef<THREE.Group>(null!)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const displayCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animDone = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const crossfadeRef = useRef(0)
  const lastCfCompositeModeRef = useRef<'hero' | 'stage' | 'blend' | ''>('')
  const lastRenderedStage = useRef(0)

  const prevStageCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageTransRef = useRef({ progress: 1 })
  const stageTlRef = useRef<gsap.core.Timeline | null>(null)
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const baseEmissive = 0.22
  const prefersReducedMotionRef = useRef(false)
  const floatOffsetRef = useRef({ v: 0 })
  const floatTweenRef = useRef<gsap.core.Tween | null>(null)

  // Gyroscope lerp targets — updated by orientation events, consumed in useFrame
  const gyroTargetRef = useRef({ x: 0.04, y: -0.14 })
  const gyroLerpingRef = useRef(false)

  // Stable ref so ScrollTrigger callbacks can read the prop without re-creating closures
  const isMobileLandscapeRef = useRef(isMobileLandscape)
  useEffect(() => { isMobileLandscapeRef.current = isMobileLandscape }, [isMobileLandscape])
  // Scroll render throttle: on mobile we cap scroll-driven renders at ~20fps
  const lastScrollRenderRef = useRef(0)
  // Mobile float: setInterval handle (15fps sine wave, replaces GSAP float on mobile)
  const mobileFloatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    prefersReducedMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    animDone.current = false
    lastCfCompositeModeRef.current = ''
    tlRef.current?.kill()

    scene.scale.setScalar(1)
    scene.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const scale = 2.35 / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(scale)
    const center = new THREE.Box3().setFromObject(scene).getCenter(new THREE.Vector3())
    scene.position.set(-center.x, -center.y, -center.z)

    // Shift aluminium body from silver → Space Black.
    // Only the albedo (color) is touched; normal/roughness/metalness maps are preserved.
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[]
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return
        const n = mat.name.toLowerCase()
        if (n.includes('glass') || n.includes('screen') || n.includes('display')) return
        mat.color.multiplyScalar(0.2)          // ~80 % darker → near-black
        mat.color.r = Math.min(1, mat.color.r + 0.018) // subtle warm undertone
        mat.color.g = Math.min(1, mat.color.g + 0.010) // matches gold theme
      })
    })

    const screenMesh = findMacbookScreenMesh(scene)
    const px = getMacbookDisplayCanvasSize(screenMesh)

    const displayCanvas = document.createElement('canvas')
    // On mobile landscape, halve the display canvas — cuts 2D draw + GPU texture
    // upload cost by 4×. Barely visible at 375px viewport height with DPR=1.
    const canvasScale = isMobileLandscape ? 0.5 : 1
    displayCanvas.width = Math.round(px.width * canvasScale)
    displayCanvas.height = Math.round(px.height * canvasScale)
    displayCanvasRef.current = displayCanvas
    const dCtx = displayCanvas.getContext('2d')!
    displayCtxRef.current = dCtx

    const heroCanvas = buildHeroScreenCanvas()
    heroCanvasRef.current = heroCanvas

    stageCanvasRef.current = buildStageCanvas(0)

    drawMacbookScreenContain(dCtx, heroCanvas, displayCanvas.width, displayCanvas.height)

    const texture = new THREE.CanvasTexture(displayCanvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
    applyMacbookScreenTextureParams(texture)
    textureRef.current = texture

    if (screenMesh) {
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: baseEmissive,
        roughness: 0.15,
        metalness: 0.0,
        color: new THREE.Color('#ffffff'),
      })
      assignMacbookScreenMaterial(screenMesh, mat)
      screenMaterialRef.current = mat
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      drawHeroPhoto(heroCanvas, img)
      if (crossfadeRef.current < 1) {
        dCtx.setTransform(1, 0, 0, 1, 0, 0)
        drawMacbookScreenContain(dCtx, heroCanvas, displayCanvas.width, displayCanvas.height)
        texture.needsUpdate = true
        invalidate()
      }
    }
    img.onerror = () => {}
    img.src = '/images/anshul.png'

    const reduce = prefersReducedMotionRef.current
    group.position.set(0, reduce ? 0.5 : 1.02, reduce ? 0 : 0.07)
    group.rotation.set(reduce ? 0.06 : 0.11, reduce ? -0.2 : -0.3, reduce ? 0 : 0.018)

    // Mobile gets a faster entrance (fewer 60fps renders during animation)
    const mob = isMobileLandscape
    // onUpdate: invalidate so demand frameloop renders each tween step
    const tl = gsap.timeline({ delay: reduce ? 0.12 : mob ? 0.18 : 0.42, onUpdate: invalidate })
    tlRef.current = tl
    const mat = screenMaterialRef.current

    if (reduce) {
      tl.to(group.position, { y: 0.4, z: 0, duration: 0.42, ease: 'power2.out' }, 0)
      tl.to(group.rotation, { x: 0.04, y: -0.14, z: 0, duration: 0.42, ease: 'power2.out' }, 0)
      tl.call(() => { animDone.current = true }, [], 0.42)

    } else {
      // Mobile duration multiplier: 0.5× = ~40 renders instead of ~77
      const d = mob ? 0.5 : 1
      tl.to(group.position, { y: 0.4, z: 0, duration: 1.22 * d, ease: 'power4.out' }, 0)
      tl.to(group.rotation, { x: 0.04, y: -0.14, z: 0, duration: 1.12 * d, ease: 'power3.out' }, 0.07 * d)
      if (mat) {
        tl.to(mat, { emissiveIntensity: 0.32, duration: 0.09, ease: 'power2.out' }, 0.82 * d)
        tl.to(mat, { emissiveIntensity: baseEmissive, duration: 0.48, ease: 'power2.out' }, 0.9 * d)
      }
      tl.call(() => {
        animDone.current = true

        if (!prefersReducedMotionRef.current) {
          if (mob) {
            // Mobile float: setInterval at ~15fps instead of GSAP's 60fps onUpdate.
            // Gives the MacBook life without burning GPU budget between gyro events.
            const t0 = performance.now()
            mobileFloatIntervalRef.current = setInterval(() => {
              if (!groupRef.current) return
              groupRef.current.position.y = 0.4 + Math.sin((performance.now() - t0) * 0.00045) * 0.018
              invalidate()
            }, 67) // ~15fps
          } else {
            floatTweenRef.current = gsap.to(floatOffsetRef.current, {
              v: 0.025,
              duration: 2.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              onUpdate: () => {
                groupRef.current.position.y = 0.4 + floatOffsetRef.current.v
                invalidate()
              },
            })
          }
        }
      }, [], 1.28 * d)
    }

    const smoothstep = (e0: number, e1: number, x: number) => {
      const tt = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
      return tt * tt * (3 - 2 * tt)
    }

    const heroEl = document.querySelector('#hero')
    const crossfadeST = heroEl
      ? ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = reduce ? 0 : self.progress

            // crossfade hero → stage (always update the value)
            let t = 0
            if (p > 0.28 && p < 0.94) {
              const u = (p - 0.28) / (0.94 - 0.28)
              t = u * u * (3 - 2 * u)
            } else if (p >= 0.94) t = 1
            crossfadeRef.current = t

            // z-parallax: desktop only — skip on mobile to save render budget
            if (!reduce && animDone.current && !isMobileLandscapeRef.current) {
              const smoothP = p * p * (3 - 2 * p)
              const zP = 0.14 * smoothstep(0, 0.5, smoothP) + 0.05 * smoothstep(0.68, 1, p)
              group.position.z = zP
            }

            // On mobile, cap scroll-triggered renders at ~20fps so the GPU
            // isn't overwhelmed during fast scrolling (saves ~40 renders/sec)
            if (isMobileLandscapeRef.current) {
              const now = performance.now()
              if (now - lastScrollRenderRef.current < 48) return
              lastScrollRenderRef.current = now
            }
            invalidate()
          },
        })
      : null

    return () => {
      tl.kill()
      tlRef.current = null
      stageTlRef.current?.kill()
      stageTlRef.current = null
      crossfadeST?.kill()
      floatTweenRef.current?.kill()
      floatTweenRef.current = null
      if (mobileFloatIntervalRef.current !== null) {
        clearInterval(mobileFloatIntervalRef.current)
        mobileFloatIntervalRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      floatOffsetRef.current.v = 0
      texture.dispose()
      textureRef.current = null
      displayCtxRef.current = null
      screenMaterialRef.current = null
      img.onload = null
      img.onerror = null
    }
  // isMobileLandscape is stable per mount (component remounts on orientation change)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, invalidate])

  useEffect(() => {
    // Build the new stage canvas off the current frame so the render loop
    // isn't blocked by canvas drawing during a stage switch.
    const id = setTimeout(() => {
      const newStage = buildStageCanvas(howIBuildStage)
      lastRenderedStage.current = howIBuildStage

      if (crossfadeRef.current >= 1 && stageCanvasRef.current && animDone.current) {
        stageTlRef.current?.kill()

        prevStageCanvasRef.current = stageCanvasRef.current
        stageCanvasRef.current = newStage
        stageTransRef.current.progress = 0

        const tl = gsap.timeline({ onUpdate: invalidate })
        stageTlRef.current = tl
        const fast = prefersReducedMotionRef.current
        tl.to(stageTransRef.current, {
          progress: 1,
          duration: fast ? 0.1 : 0.22,
          ease: 'power2.out',
          onComplete: () => { prevStageCanvasRef.current = null },
        }, 0)
      } else {
        stageCanvasRef.current = newStage
        stageTransRef.current.progress = 1

        const dCtx = displayCtxRef.current
        const display = displayCanvasRef.current
        const texture = textureRef.current
        if (crossfadeRef.current >= 1 && dCtx && display && texture) {
          dCtx.setTransform(1, 0, 0, 1, 0, 0)
          drawMacbookScreenContain(dCtx, newStage, display.width, display.height)
          texture.needsUpdate = true
          invalidate()
        }
      }
    }, 0)
    return () => clearTimeout(id)
  }, [howIBuildStage, invalidate])

  // Gyroscope tilt — only on mobile landscape; throttled to ~30fps; smooth lerp in useFrame
  useEffect(() => {
    if (!isMobileLandscape) return

    const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    let lastT = 0

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (!animDone.current || e.beta === null || e.gamma === null) return
      const now = performance.now()
      if (now - lastT < 32) return // hard cap at ~30fps
      lastT = now
      // beta 90° = phone held upright; gamma 0° = no left/right tilt
      gyroTargetRef.current.x = 0.04 + clampN((e.beta - 90) * 0.004, -0.22, 0.22)
      gyroTargetRef.current.y = -0.14 + clampN(e.gamma * 0.007, -0.32, 0.32)
      gyroLerpingRef.current = true
      invalidate() // wake the demand frameloop for one lerp step
    }

    let listening = false
    const startListening = () => {
      if (listening) return
      type DOEWithPermission = typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<PermissionState>
      }
      const DOE = DeviceOrientationEvent as DOEWithPermission
      if (typeof DOE.requestPermission === 'function') {
        void DOE.requestPermission().then((p) => {
          if (p === 'granted') {
            window.addEventListener('deviceorientation', onOrientation)
            listening = true
          }
        })
      } else {
        window.addEventListener('deviceorientation', onOrientation)
        listening = true
      }
    }

    const container = document.getElementById('shared-macbook-container')
    container?.addEventListener('touchstart', startListening, { once: true })

    return () => {
      window.removeEventListener('deviceorientation', onOrientation)
      container?.removeEventListener('touchstart', startListening)
    }
  }, [invalidate, isMobileLandscape])

  useFrame((_, delta) => {
    const display = displayCanvasRef.current
    const dCtx = displayCtxRef.current
    const hero = heroCanvasRef.current
    const stage = stageCanvasRef.current
    const texture = textureRef.current
    if (!display || !dCtx || !hero || !texture) return

    const trans = stageTransRef.current.progress
    if (trans < 1 && prevStageCanvasRef.current && stage && crossfadeRef.current >= 1) {
      dCtx.setTransform(1, 0, 0, 1, 0, 0)
      drawMacbookCrossfadeContain(
        dCtx,
        prevStageCanvasRef.current,
        stage,
        display.width,
        display.height,
        trans,
      )
      texture.needsUpdate = true
      return
    }

    const cf = Math.max(0, Math.min(1, crossfadeRef.current))
    const mode: 'hero' | 'stage' | 'blend' =
      cf < 0.006 ? 'hero' : cf > 0.994 ? 'stage' : 'blend'
    const pm = lastCfCompositeModeRef.current
    if (mode === 'hero' && pm === 'hero') return
    if (mode === 'stage' && pm === 'stage') return
    lastCfCompositeModeRef.current = mode

    dCtx.setTransform(1, 0, 0, 1, 0, 0)

    if (mode === 'hero' || !stage) {
      drawMacbookScreenContain(dCtx, hero, display.width, display.height)
    } else if (mode === 'stage') {
      drawMacbookScreenContain(dCtx, stage, display.width, display.height)
    } else {
      drawMacbookCrossfadeContain(dCtx, hero, stage, display.width, display.height, cf)
    }

    texture.needsUpdate = true

    // Smooth gyroscope lerp — re-invalidates until rotation converges
    if (gyroLerpingRef.current) {
      const group = groupRef.current
      const t = gyroTargetRef.current
      const a = Math.min(1, delta * 9) // exponential approach, ~9 rad/s
      group.rotation.x += (t.x - group.rotation.x) * a
      group.rotation.y += (t.y - group.rotation.y) * a
      if (Math.abs(t.x - group.rotation.x) > 0.0004 || Math.abs(t.y - group.rotation.y) > 0.0004) {
        invalidate() // keep ticking until settled
      } else {
        gyroLerpingRef.current = false
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function MacBookOverlay({ howIBuildStage, isMobileLandscape }: { howIBuildStage: number; isMobileLandscape: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [orbitHintVisible, setOrbitHintVisible] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hibEl = document.querySelector('#how-i-build')
    if (!hibEl) return

    const st = ScrollTrigger.create({
      trigger: hibEl,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (self.progress > 0.92) {
          const fade = (self.progress - 0.92) / 0.08
          container.style.opacity = String(Math.max(0, 1 - fade))
        } else {
          container.style.opacity = '1'
        }
      },
      onLeave: () => {
        container.style.opacity = '0'
        container.style.pointerEvents = 'none'
      },
      onEnterBack: () => {
        container.style.opacity = '1'
        container.style.pointerEvents = ''
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div
      ref={containerRef}
      id="shared-macbook-container"
      data-cursor-orbit
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'clamp(500px, 52vw, 980px)',
        minWidth: 'min(500px, 100vw)',
        maxWidth: '100vw',
        height: '100dvh',
        zIndex: 10,
        overflow: 'visible',
        cursor: isMobileLandscape ? 'default' : 'grab',
        opacity: 1,
        // Gold ambient glow shows through the transparent WebGL canvas
        background: isMobileLandscape
          ? 'radial-gradient(ellipse 85% 65% at 48% 50%, rgba(201,168,76,0.06) 0%, transparent 68%)'
          : 'transparent',
      }}
    >
      {/* Desktop: drag-to-orbit hint */}
      {orbitHintVisible && !isMobileLandscape && (
        <div
          className="macbook-orbit-hint pointer-events-none absolute bottom-[14%] left-[8%] z-20 max-w-[200px] text-left max-md:hidden"
          aria-hidden
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              color: 'rgba(201, 168, 76, 0.75)',
              marginBottom: '10px',
            }}
          >
            3D PREVIEW
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(1rem, 1.35vw, 1.2rem)',
              lineHeight: 1.35,
              color: 'rgba(238, 238, 232, 0.88)',
            }}
          >
            Drag to orbit
            <span style={{ color: 'rgba(201, 168, 76, 0.9)' }}> · </span>
            give it a spin
          </p>
        </div>
      )}
      {/* Mobile landscape: tilt hint */}
      {isMobileLandscape && (
        <div
          className="pointer-events-none absolute z-20 flex items-center gap-[7px]"
          aria-hidden
          style={{
            bottom: 'max(14px, env(safe-area-inset-bottom, 0px) + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.35em',
            color: 'rgba(201, 168, 76, 0.65)',
            whiteSpace: 'nowrap',
            animation: 'rotate-hint-pulse 3s ease-in-out 4',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 0-10 10" /><path d="M12 2l-3 3 3 3" />
            <path d="M12 22a10 10 0 0 0 10-10" /><path d="M12 22l3-3-3-3" />
          </svg>
          TILT TO EXPLORE
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0.36, 6.2], fov: 31 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        frameloop="demand"
        dpr={isMobileLandscape ? 1 : [1, 1.5]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ReinhardToneMapping
          gl.toneMappingExposure = 0.9
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        style={{
          background: 'transparent',
          position: 'absolute',
          inset: 0,
        }}
      >
        <ambientLight intensity={0.38} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-3, 1, -3]} intensity={0.55} color="#c8a96e" />
        {/* 3rd fill light skipped on mobile to reduce draw calls */}
        {!isMobileLandscape && <directionalLight position={[0, -2, 3]} intensity={0.18} color="#ffffff" />}
        <Suspense fallback={null}>
          <MacBookModel howIBuildStage={howIBuildStage} isMobileLandscape={isMobileLandscape} />
        </Suspense>
        {/* OrbitControls only on desktop — mobile uses gyroscope */}
        {!isMobileLandscape && (
          <OrbitControls
            target={[0, 0.3, 0]}
            enablePan={false}
            enableZoom={false}
            rotateSpeed={0.5}
            onStart={() => setOrbitHintVisible(false)}
          />
        )}
      </Canvas>
    </div>
  )
}

/** Floating MacBook — wide desktop OR landscape mobile (≥680 px wide). */
const MACBOOK_MIN_WIDTH = 1180
const MACBOOK_LANDSCAPE_MQ = '(orientation: landscape) and (min-width: 680px)'
// Touch device in landscape = mobile landscape experience
const MOBILE_LANDSCAPE_MQ = '(pointer: coarse) and (orientation: landscape) and (min-width: 680px)'

function subscribeMacbookViewport(cb: () => void) {
  const mqW = window.matchMedia(`(min-width: ${MACBOOK_MIN_WIDTH}px)`)
  const mqL = window.matchMedia(MACBOOK_LANDSCAPE_MQ)
  mqW.addEventListener('change', cb)
  mqL.addEventListener('change', cb)
  return () => {
    mqW.removeEventListener('change', cb)
    mqL.removeEventListener('change', cb)
  }
}

function getMacbookViewportWideEnough() {
  return (
    window.matchMedia(`(min-width: ${MACBOOK_MIN_WIDTH}px)`).matches ||
    window.matchMedia(MACBOOK_LANDSCAPE_MQ).matches
  )
}

function subscribeMobileLandscape(cb: () => void) {
  const mq = window.matchMedia(MOBILE_LANDSCAPE_MQ)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getIsMobileLandscape() {
  return window.matchMedia(MOBILE_LANDSCAPE_MQ).matches
}

export default function SharedMacBook({ howIBuildStage }: { howIBuildStage: number }) {
  const wideEnough = useSyncExternalStore(
    subscribeMacbookViewport,
    getMacbookViewportWideEnough,
    () => false,
  )
  const isMobileLandscape = useSyncExternalStore(
    subscribeMobileLandscape,
    getIsMobileLandscape,
    () => false,
  )

  if (!wideEnough) return null
  return createPortal(
    <MacBookOverlay howIBuildStage={howIBuildStage} isMobileLandscape={isMobileLandscape} />,
    document.body,
  )
}

useGLTF.preload(MACBOOK_GLTF_URL)
