'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/** Tight-cropped, premultiplied crest (no halos). */
const LOADER_LOGO_TEX = '/brand/loader-crest-clean.png'
const LOADER_LOGO_W = 409
const LOADER_LOGO_H = 496

function Loader3dLogoCard({ spinning }: { spinning: boolean }) {
  const tex = useTexture(LOADER_LOGO_TEX, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = THREE.ClampToEdgeWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = true
    t.premultiplyAlpha = true
    t.needsUpdate = true
  })

  const gl = useThree((s) => s.gl)
  const map = useMemo(() => {
    const c = tex.clone()
    c.anisotropy = gl.capabilities.getMaxAnisotropy()
    c.needsUpdate = true
    return c
  }, [tex, gl])

  const group = useRef<THREE.Group>(null)

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        premultipliedAlpha: true,
        alphaTest: 0.028,
        side: THREE.FrontSide,
        toneMapped: true,
        depthWrite: true,
        color: new THREE.Color('#141414'),
      }),
    [map]
  )

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        premultipliedAlpha: true,
        alphaTest: 0.02,
        side: THREE.FrontSide,
        toneMapped: true,
        depthWrite: false,
        opacity: 0.52,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color('#8c6b32'),
      }),
    [map]
  )

  useEffect(() => {
    return () => {
      material.dispose()
      edgeMaterial.dispose()
    }
  }, [material, edgeMaterial])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    if (spinning) {
      g.rotation.y += delta * 0.5
      g.rotation.x = Math.sin(performance.now() / 4400) * 0.055
    }
  })

  // Keep native aspect to avoid top/bottom compression.
  const h = 2.18
  const w = h * (LOADER_LOGO_W / LOADER_LOGO_H)
  const z = 0.03

  return (
    <group ref={group} rotation={spinning ? [0.1, 0.2, 0.02] : [0.1, 0.35, 0]}>
      <mesh position={[0, 0, z]} material={material}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, 0, z + 0.003]} material={edgeMaterial} scale={[1.018, 1.018, 1]}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, 0, -z]} rotation={[0, Math.PI, 0]} material={material}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh
        position={[0, 0, -z - 0.003]}
        rotation={[0, Math.PI, 0]}
        material={edgeMaterial}
        scale={[1.018, 1.018, 1]}
      >
        <planeGeometry args={[w, h]} />
      </mesh>
    </group>
  )
}

function Scene({ spinning }: { spinning: boolean }) {
  return (
    <group>
      {spinning ? (
        <Float speed={1.05} rotationIntensity={0.04} floatIntensity={0.12}>
          <Loader3dLogoCard spinning={spinning} />
        </Float>
      ) : (
        <Loader3dLogoCard spinning={spinning} />
      )}
    </group>
  )
}

type LoaderSculptureProps = {
  spinning?: boolean
}

export default function LoaderSculpture({ spinning = true }: LoaderSculptureProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.06, 6.2], fov: 32, near: 0.1, far: 200 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      style={{
        width: 'min(86vw, 420px)',
        height: 'min(50vh, 420px)',
        maxWidth: '100%',
        background: 'transparent',
        display: 'block',
        overflow: 'visible',
      }}
    >
      <Suspense fallback={null}>
        <Scene spinning={spinning} />
      </Suspense>
    </Canvas>
  )
}
