'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type ModelProps = {
  modelPath: string
  scale: number
  rotation?: [number, number, number]
  position?: [number, number, number]
}

function Model({ modelPath, scale, rotation = [0, 0, 0], position = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!groupRef.current) return

    const box = new THREE.Box3().setFromObject(clonedScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    clonedScene.position.set(-center.x, -center.y, -center.z)
    groupRef.current.scale.setScalar(scale / maxDim)
    groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2])
    groupRef.current.position.set(position[0], position[1], position[2])
  }, [clonedScene, position, rotation, scale])

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.rotation.y = rotation[1] + mouseRef.current.x * 0.12 + Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    groupRef.current.rotation.x = rotation[0] + mouseRef.current.y * 0.05
  })

  return (
    <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.3}>
      <group ref={groupRef}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  )
}

type DeviceModelProps = {
  modelPath: string
  className?: string
  scale?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
  cameraPosition?: [number, number, number]
}

export default function DeviceModel({
  modelPath,
  className = '',
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  cameraPosition = [0, 0, 5],
}: DeviceModelProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: cameraPosition, fov: 32 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 4, 6]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-4, 2, 3]} intensity={1.4} color="#c8a96e" />
        <pointLight position={[0, 2, 3]} intensity={1.2} color="#f0d080" />
        <fog attach="fog" args={['#060606', 8, 16]} />
        <Suspense fallback={null}>
          <Model modelPath={modelPath} scale={scale} rotation={rotation} position={position} />
        </Suspense>
        <EffectComposer>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.28}
            luminanceSmoothing={0.82}
            mipmapBlur
            radius={0.35}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/keyboard_opt.glb')
useGLTF.preload('/models/monitor_opt.glb')
