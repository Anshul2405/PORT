'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { buildHeroScreenCanvas, drawHeroPhoto } from '@/lib/macbook-screens'
import { usePerformanceLiteMode } from '@/lib/use-performance-mode'
import { MACBOOK_GLTF_URL } from '@/lib/macbook-model-url'
import { applyMacbookScreenTextureParams } from '@/lib/macbook-canvas-texture'
import { drawMacbookScreenContain, getMacbookDisplayCanvasSize } from '@/lib/macbook-display-fit'
import { assignMacbookScreenMaterial, findMacbookScreenMesh } from '@/lib/macbook-screen-mesh'

function MobileMacModel() {
  const { scene } = useGLTF(MACBOOK_GLTF_URL)
  const groupRef = useRef<THREE.Group>(null!)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.scale.setScalar(1)
    cloned.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const scale = 2.15 / Math.max(size.x, size.y, size.z)
    cloned.scale.setScalar(scale)
    const center = new THREE.Box3().setFromObject(cloned).getCenter(new THREE.Vector3())
    cloned.position.set(-center.x, -center.y, -center.z)
    return cloned
  }, [scene])

  useEffect(() => {
    const screenMesh = findMacbookScreenMesh(model)
    const px = getMacbookDisplayCanvasSize(screenMesh)

    const displayCanvas = document.createElement('canvas')
    displayCanvas.width = px.width
    displayCanvas.height = px.height
    const dCtx = displayCanvas.getContext('2d')
    if (!dCtx) return

    const heroCanvas = buildHeroScreenCanvas()
    drawMacbookScreenContain(dCtx, heroCanvas, displayCanvas.width, displayCanvas.height)

    const texture = new THREE.CanvasTexture(displayCanvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 4
    applyMacbookScreenTextureParams(texture)
    textureRef.current = texture

    if (screenMesh) {
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.42,
        roughness: 0.16,
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
      dCtx.setTransform(1, 0, 0, 1, 0, 0)
      dCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height)
      drawMacbookScreenContain(dCtx, heroCanvas, displayCanvas.width, displayCanvas.height)
      texture.needsUpdate = true
    }
    img.onerror = () => {}
    img.src = '/images/anshul.png'

    return () => {
      img.onload = null
      img.onerror = null
      screenMaterialRef.current = null
      texture.dispose()
      textureRef.current = null
    }
  }, [model])

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    const t = clock.elapsedTime
    group.rotation.y = -0.16 + Math.sin(t * 0.32) * 0.11
    group.rotation.x = 0.05 + Math.sin(t * 0.4) * 0.01
    group.position.y = 0.08 + Math.sin(t * 0.55) * 0.02
  })

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  )
}

export default function MobileMacPreview() {
  const performanceLite = usePerformanceLiteMode()

  if (performanceLite) {
    return (
      <div className="hib-mobile-mac" aria-hidden>
        <div
          className="hib-mobile-mac-canvas-wrap"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(155deg, #1c1a17 0%, #0a0908 55%, #060605 100%)',
            borderRadius: '12px',
            boxShadow:
              '0 28px 56px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(201,168,76,0.1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- lightweight static substitute for WebGL */}
          <img
            src="/images/anshul.png"
            alt=""
            width={640}
            height={400}
            decoding="async"
            style={{
              width: '72%',
              height: 'auto',
              borderRadius: '6px',
              opacity: 0.94,
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="hib-mobile-mac" aria-hidden>
      <div className="hib-mobile-mac-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.34, 4.5], fov: 31 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={0.58} />
          <directionalLight position={[3, 4, 3]} intensity={1.25} />
          <directionalLight position={[-2, 1, 2]} intensity={0.34} color="#e8d8c0" />
          <fog attach="fog" args={['#0b0a08', 10, 20]} />
          <Suspense fallback={null}>
            <MobileMacModel />
          </Suspense>
          <OrbitControls
            target={[0, 0.25, 0]}
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.45}
            minPolarAngle={Math.PI / 2.4}
            maxPolarAngle={Math.PI / 1.95}
          />
        </Canvas>
      </div>
    </div>
  )
}
