'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function MobileMacModel() {
  const { scene } = useGLTF('/models/macbook_opt.glb')
  const groupRef = useRef<THREE.Group>(null!)

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

export default function MobileMacPreview({
  stageNumber,
  stageTitle,
}: {
  stageNumber: string
  stageTitle: string
}) {
  return (
    <div className="hib-mobile-mac" aria-hidden>
      <div className="hib-mobile-mac-toolbar">
        <span />
        <span />
        <span />
      </div>
      <div className="hib-mobile-mac-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0.28, 4.6], fov: 32 }}
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
      <div className="hib-mobile-mac-screen">
        <p className="hib-mobile-mac-kicker">MAC PREVIEW</p>
        <p className="hib-mobile-mac-stage">{`STAGE ${stageNumber}`}</p>
        <p className="hib-mobile-mac-title">{stageTitle}</p>
      </div>
    </div>
  )
}

useGLTF.preload('/models/macbook_opt.glb')

