'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import {
  SCREEN_W, SCREEN_H, TEX_SCALE,
  buildHeroScreenCanvas, drawHeroPhoto, buildStageCanvas,
} from '@/lib/macbook-screens'

function MacBookModel({ howIBuildStage }: { howIBuildStage: number }) {
  const { scene } = useGLTF('/models/macbook_opt.glb')
  const groupRef = useRef<THREE.Group>(null!)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animDone = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const crossfadeRef = useRef(0)
  const lastCfCompositeModeRef = useRef<'hero' | 'stage' | 'blend' | ''>('')
  const lastRenderedStage = useRef(0)

  const prevStageCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageTransRef = useRef({ progress: 1 })
  const stageTlRef = useRef<gsap.core.Timeline | null>(null)
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const baseEmissive = 0.45
  const heroScrollProgressRef = useRef(0)
  const prefersReducedMotionRef = useRef(false)

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

    const displayCanvas = document.createElement('canvas')
    displayCanvas.width = SCREEN_W * TEX_SCALE
    displayCanvas.height = SCREEN_H * TEX_SCALE
    displayCanvasRef.current = displayCanvas

    const heroCanvas = buildHeroScreenCanvas()
    heroCanvasRef.current = heroCanvas

    stageCanvasRef.current = buildStageCanvas(0)

    const dCtx = displayCanvas.getContext('2d')!
    dCtx.drawImage(heroCanvas, 0, 0)

    const texture = new THREE.CanvasTexture(displayCanvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
    textureRef.current = texture

    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && mesh.name === 'Object_123') {
        const mat = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: new THREE.Color('#ffffff'),
          emissiveIntensity: baseEmissive,
          roughness: 0.15,
          metalness: 0.0,
          color: new THREE.Color('#ffffff'),
        })
        mesh.material = mat
        screenMaterialRef.current = mat
      }
    })

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      drawHeroPhoto(heroCanvas, img)
      if (crossfadeRef.current < 1) {
        dCtx.setTransform(1, 0, 0, 1, 0, 0)
        dCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height)
        dCtx.drawImage(heroCanvas, 0, 0)
        texture.needsUpdate = true
      }
    }
    img.onerror = () => {}
    img.src = '/images/anshul.png'

    const reduce = prefersReducedMotionRef.current
    group.position.set(0, reduce ? 0.5 : 1.02, reduce ? 0 : 0.07)
    group.rotation.set(reduce ? 0.06 : 0.11, reduce ? -0.2 : -0.3, reduce ? 0 : 0.018)

    const tl = gsap.timeline({ delay: reduce ? 0.12 : 0.42 })
    tlRef.current = tl
    const mat = screenMaterialRef.current

    if (reduce) {
      tl.to(group.position, { y: 0.4, z: 0, duration: 0.42, ease: 'power2.out' }, 0)
      tl.to(group.rotation, { x: 0.04, y: -0.14, z: 0, duration: 0.42, ease: 'power2.out' }, 0)
      tl.call(() => { animDone.current = true }, [], 0.42)
    } else {
      tl.to(group.position, { y: 0.4, z: 0, duration: 1.22, ease: 'power4.out' }, 0)
      tl.to(group.rotation, { x: 0.04, y: -0.14, z: 0, duration: 1.12, ease: 'power3.out' }, 0.07)
      if (mat) {
        tl.to(mat, { emissiveIntensity: 0.56, duration: 0.09, ease: 'power2.out' }, 0.82)
        tl.to(mat, { emissiveIntensity: baseEmissive, duration: 0.48, ease: 'power2.out' }, 0.9)
      }
      tl.call(() => { animDone.current = true }, [], 1.28)
    }

    const heroEl = document.querySelector('#hero')
    const crossfadeST = heroEl
      ? ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            heroScrollProgressRef.current = prefersReducedMotionRef.current ? 0 : p
            let t = 0
            if (p <= 0.28) t = 0
            else if (p >= 0.94) t = 1
            else {
              const u = (p - 0.28) / (0.94 - 0.28)
              t = u * u * (3 - 2 * u)
            }
            crossfadeRef.current = t
          },
        })
      : null

    return () => {
      tl.kill()
      tlRef.current = null
      stageTlRef.current?.kill()
      stageTlRef.current = null
      crossfadeST?.kill()
      texture.dispose()
      textureRef.current = null
      screenMaterialRef.current = null
      img.onload = null
      img.onerror = null
    }
  }, [scene])

  useEffect(() => {
    const newStage = buildStageCanvas(howIBuildStage)

    if (crossfadeRef.current >= 1 && stageCanvasRef.current && animDone.current) {
      stageTlRef.current?.kill()

      prevStageCanvasRef.current = stageCanvasRef.current
      stageCanvasRef.current = newStage
      stageTransRef.current.progress = 0

      const tl = gsap.timeline()
      stageTlRef.current = tl
      const fast = prefersReducedMotionRef.current
      tl.to(stageTransRef.current, {
        progress: 1,
        duration: fast ? 0.12 : 0.38,
        ease: 'power2.out',
        onComplete: () => { prevStageCanvasRef.current = null },
      }, 0)
    } else {
      stageCanvasRef.current = newStage
      stageTransRef.current.progress = 1

      if (crossfadeRef.current >= 1 && displayCanvasRef.current && textureRef.current) {
        const dCtx = displayCanvasRef.current.getContext('2d')!
        dCtx.setTransform(1, 0, 0, 1, 0, 0)
        dCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height)
        dCtx.drawImage(newStage, 0, 0)
        textureRef.current.needsUpdate = true
      }
    }

    lastRenderedStage.current = howIBuildStage
  }, [howIBuildStage])

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return

    if (animDone.current) {
      const t = clock.elapsedTime
      let yParallax = 0
      let zParallax = 0
      if (!prefersReducedMotionRef.current) {
        const p = heroScrollProgressRef.current
        const smoothstep = (edge0: number, edge1: number, x: number) => {
          const tt = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
          return tt * tt * (3 - 2 * tt)
        }
        const smoothP = p * p * (3 - 2 * p)
        yParallax =
          -0.09 * smoothstep(0, 0.45, smoothP) +
          0.024 * smoothstep(0.74, 1, p)
        zParallax =
          0.14 * smoothstep(0, 0.5, smoothP) +
          0.05 * smoothstep(0.68, 1, p)
      }
      const floatY =
        0.4 + Math.sin(t * 0.5) * 0.03 + yParallax
      group.position.y += (floatY - group.position.y) * 0.025
      group.position.z += (zParallax - group.position.z) * 0.055
    }

    const display = displayCanvasRef.current
    const hero = heroCanvasRef.current
    const stage = stageCanvasRef.current
    const texture = textureRef.current
    if (!display || !hero || !texture) return

    const trans = stageTransRef.current.progress
    if (trans < 1 && prevStageCanvasRef.current && stage && crossfadeRef.current >= 1) {
      const dCtx = display.getContext('2d')!
      dCtx.setTransform(1, 0, 0, 1, 0, 0)
      dCtx.clearRect(0, 0, display.width, display.height)
      dCtx.globalAlpha = 1 - trans
      dCtx.drawImage(prevStageCanvasRef.current, 0, 0)
      dCtx.globalAlpha = trans
      dCtx.drawImage(stage, 0, 0)
      dCtx.globalAlpha = 1
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

    const dCtx = display.getContext('2d')!
    dCtx.setTransform(1, 0, 0, 1, 0, 0)
    dCtx.clearRect(0, 0, display.width, display.height)

    if (mode === 'hero' || !stage) {
      dCtx.drawImage(hero, 0, 0)
    } else if (mode === 'stage') {
      dCtx.drawImage(stage, 0, 0)
    } else {
      dCtx.globalAlpha = 1 - cf
      dCtx.drawImage(hero, 0, 0)
      dCtx.globalAlpha = cf
      dCtx.drawImage(stage, 0, 0)
      dCtx.globalAlpha = 1
    }

    texture.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function MacBookOverlay({ howIBuildStage }: { howIBuildStage: number }) {
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
        width: '58%',
        height: '100vh',
        zIndex: 10,
        overflow: 'visible',
        cursor: 'grab',
        opacity: 1,
      }}
    >
      {orbitHintVisible && (
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
      <Canvas
        camera={{ position: [0, 0.4, 5.8], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        style={{
          background: 'transparent',
          position: 'absolute',
          inset: 0,
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 4]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-2, 2, 2]} intensity={0.35} color="#e8d8c0" />
        <directionalLight position={[0, 2, -4]} intensity={0.8} color="#e8d8c0" />
        <directionalLight position={[0, -3, 0]} intensity={0.4} color="#e8d8c0" />
        <fog attach="fog" args={['#000000', 12, 24]} />
        <Suspense fallback={null}>
          <MacBookModel howIBuildStage={howIBuildStage} />
        </Suspense>
        <OrbitControls
          target={[0, 0.3, 0]}
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.5}
          onStart={() => setOrbitHintVisible(false)}
        />
        <EffectComposer multisampling={4}>
          <Bloom intensity={0.18} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default function SharedMacBook({ howIBuildStage }: { howIBuildStage: number }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return createPortal(
    <MacBookOverlay howIBuildStage={howIBuildStage} />,
    document.body,
  )
}

useGLTF.preload('/models/macbook_opt.glb')
