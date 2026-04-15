'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SCREEN_W, SCREEN_H, TEX_SCALE, buildHeroScreenCanvas, drawHeroPhoto } from '@/lib/macbook-screens'

function MobileMacModel() {
  const { scene } = useGLTF('/models/macbook_opt.glb')
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
    const displayCanvas = document.createElement('canvas')
    displayCanvas.width = SCREEN_W * TEX_SCALE
    displayCanvas.height = SCREEN_H * TEX_SCALE
    const dCtx = displayCanvas.getContext('2d')
    if (!dCtx) return

    const heroCanvas = buildHeroScreenCanvas()
    dCtx.drawImage(heroCanvas, 0, 0)

    const texture = new THREE.CanvasTexture(displayCanvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 8
    textureRef.current = texture

    model.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && mesh.name === 'Object_123') {
        const mat = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: new THREE.Color('#ffffff'),
          emissiveIntensity: 0.42,
          roughness: 0.16,
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
      dCtx.setTransform(1, 0, 0, 1, 0, 0)
      dCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height)
      dCtx.drawImage(heroCanvas, 0, 0)
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
  return (
    <div className="hib-mobile-mac" aria-hidden>
      <div className="hib-mobile-mac-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.34, 4.5], fov: 31 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
          dpr={[1, 1.25]}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={0.58} />
          <directionalLight position={[3, 4, 3]} intensity={1.25} />
          <directionalLight position={[-2, 1, 2]} intensity={0.34} color="#e8d8c0" />
          <fog attach="fog" args={['#0b0a08', 10, 20]} />
          <Suspense fallback={null}>
            <MobileMacModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

useGLTF.preload('/models/macbook_opt.glb')

