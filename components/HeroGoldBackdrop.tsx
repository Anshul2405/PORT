'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.15;
  float n = noise(uv * 3.0 + vec2(t, -t * 0.7));
  n += noise(uv * 6.0 - vec2(t * 0.5, t)) * 0.5;
  float glow = smoothstep(0.35, 0.85, n);
  vec3 gold = vec3(0.79, 0.66, 0.43);
  vec3 dim = vec3(0.02, 0.02, 0.02);
  vec3 col = mix(dim, gold * 0.35, glow * 0.22);
  float radial = 1.0 - length(uv - vec2(0.72, 0.45)) * 1.1;
  radial = smoothstep(0.0, 1.0, radial);
  col += gold * radial * 0.08;
  gl_FragColor = vec4(col, 0.92);
}
`

function GoldPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function HeroGoldBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 45, near: 0.1, far: 20 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        <GoldPlane />
      </Canvas>
    </div>
  )
}
