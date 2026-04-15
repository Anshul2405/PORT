'use client'

// Photo: public/images/anshul.png

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Monitor() {
  const { scene } = useGLTF('/models/monitor_opt.glb')
  const groupRef = useRef<THREE.Group>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(3.5 / maxDim)
    const box2 = new THREE.Box3().setFromObject(scene)
    const center = box2.getCenter(new THREE.Vector3())
    scene.position.set(-center.x, -center.y, -center.z)

    const photoTexture = new THREE.TextureLoader().load('/images/anshul.png')
    let applied = false
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const name = mesh.name.toLowerCase()
        if (
          name.includes('screen') ||
          name.includes('display') ||
          name.includes('glass') ||
          name.includes('lcd')
        ) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: photoTexture,
            emissiveMap: photoTexture,
            emissive: new THREE.Color('#ffffff'),
            emissiveIntensity: 0.3,
            roughness: 0.05,
            metalness: 0,
          })
          applied = true
          console.log('Monitor screen found:', mesh.name)
        }
        if (!applied) {
          console.log('Monitor mesh:', mesh.name)
        }
      }
    })

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05
    groupRef.current.rotation.y += (mouse.current.x * 0.1 - groupRef.current.rotation.y) * 0.03
    groupRef.current.rotation.x += (mouse.current.y * 0.05 - groupRef.current.rotation.x) * 0.03
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

export default function MonitorScene() {
  return (
    <div style={{ width: '100%', height: '500px', background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <directionalLight position={[-2, 2, 2]} intensity={1} color="#C8A96E" />
        <Suspense fallback={null}>
          <Monitor />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/monitor_opt.glb')
