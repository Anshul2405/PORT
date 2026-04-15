'use client'

import { useRef, useEffect, useCallback, Suspense } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import { registerPortfolioKeySimConsumer } from '@/lib/keyboard-sim-bridge'

/** @deprecated Prefer `simulatePortfolioKeyPress` from `@/lib/keyboard-sim-bridge` — queued until the 3D keyboard is ready */
export const KEYBOARD_SIMULATE_EVENT = 'portfolio-keyboard-simulate'

export type KeyboardSimulateDetail = { code: string; silent?: boolean }

export { simulatePortfolioKeyPress } from '@/lib/keyboard-sim-bridge'

interface KeyboardProps {
  className?: string
  style?: React.CSSProperties
  introTick?: number
  /** When false, camera stays fixed so scripted key presses read clearly */
  orbitEnabled?: boolean
  /** Fired for printable keys (no modifiers) — parent can spawn UI e.g. skill chips */
  onKeyCharacter?: (char: string) => void
}

/** Merged row slabs: press along geometry's thinnest axis (parent scale makes raw Y/Z tweaks invisible). */
type MergedPressConfig = {
  rest: THREE.Vector3
  axis: THREE.Vector3
  distance: number
}

interface MeshRef {
  mesh: THREE.Mesh
  originalY: number
  originalZ: number
  mergedPress?: MergedPressConfig
}

const KEY_MAP: Record<string, string> = {
  KeyA: 'Key_A', KeyB: 'Key_B', KeyC: 'Key_C', KeyD: 'Key_D',
  KeyE: 'Key_E', KeyF: 'Key_F', KeyG: 'Key_G', KeyH: 'Key_H',
  KeyI: 'Key_I', KeyJ: 'Key_J', KeyK: 'Key_K', KeyL: 'Key_L',
  KeyM: 'Key_M', KeyN: 'Key_N', KeyO: 'Key_O', KeyP: 'Key_P',
  KeyQ: 'Key_Q', KeyR: 'Key_R', KeyS: 'Key_S', KeyT: 'Key_T',
  KeyU: 'Key_U', KeyV: 'Key_V', KeyW: 'Key_W', KeyX: 'Key_X',
  KeyY: 'Key_Y', KeyZ: 'Key_Z',
  Digit0: 'Key_0', Digit1: 'Key_1', Digit2: 'Key_2', Digit3: 'Key_3',
  Digit4: 'Key_4', Digit5: 'Key_5', Digit6: 'Key_6', Digit7: 'Key_7',
  Digit8: 'Key_8', Digit9: 'Key_9',
  Space: 'Key_Space', Enter: 'Key_Enter', Backspace: 'Key_Backspace',
  ShiftLeft: 'Key_ShiftLeft', ShiftRight: 'Key_ShiftRight',
  ControlLeft: 'Key_CtrlLeft', ControlRight: 'Key_CtrlRight',
  AltLeft: 'Key_AltLeft', AltRight: 'Key_AltRight',
  Tab: 'Key_Tab', CapsLock: 'Key_CapsLock', Escape: 'Key_Escape',
  Comma: 'Key_Comma', Period: 'Key_Period', Slash: 'Key_Slash',
  Semicolon: 'Key_Semicolon', Quote: 'Key_Quote',
  BracketLeft: 'Key_BracketLeft', BracketRight: 'Key_BracketRight',
  Backslash: 'Key_Backslash', Minus: 'Key_Minus', Equal: 'Key_Equal',
  Backquote: 'Key_Backquote',
}

const MESH_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_MAP).map(([code, mesh]) => [mesh, code])
)

/** Maps a typed character to `KeyboardEvent.code`-style values used by `KEY_MAP`. */
function characterToKeyboardCode(ch: string): string | null {
  const key = ch === ' ' ? ' ' : ch
  const upper = key.toUpperCase()
  if (/^[A-Z]$/.test(upper)) return `Key${upper}`
  if (/^[0-9]$/.test(key)) return `Digit${key}`
  if (key === ' ') return 'Space'
  if (key === ',') return 'Comma'
  if (key === '.') return 'Period'
  if (key === '/') return 'Slash'
  if (key === ';') return 'Semicolon'
  if (key === "'") return 'Quote'
  if (key === '-') return 'Minus'
  if (key === '=') return 'Equal'
  if (key === '[') return 'BracketLeft'
  if (key === ']') return 'BracketRight'
  if (key === '\\') return 'Backslash'
  if (key === '`') return 'Backquote'
  return null
}

/**
 * `apple_magic_keyboard.glb` merges caps into three row meshes under `Keys_0`.
 * Map DOM `KeyboardEvent.code` → which row mesh should dip (QWERTY layout).
 */
function mergedRowMeshForDomCode(code: string): string | null {
  if (code.startsWith('Digit')) return 'Object_4'
  if (code === 'Space') return 'Object_6'
  if (code.startsWith('Key')) {
    const L = code.slice(3)
    if (L && 'QWERTYUIOP'.includes(L)) return 'Object_4'
    if (L && 'ASDFGHJKL'.includes(L)) return 'Object_5'
    if (L && 'ZXCVBNM'.includes(L)) return 'Object_6'
    return 'Object_5'
  }
  if (['Backquote', 'Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Backslash'].includes(code)) {
    return 'Object_4'
  }
  if (['Semicolon', 'Quote'].includes(code)) return 'Object_5'
  if (['Comma', 'Period', 'Slash'].includes(code)) return 'Object_6'
  return null
}

function getMergedRowMeshRef(code: string, map: Map<string, MeshRef>): MeshRef | undefined {
  const name = mergedRowMeshForDomCode(code)
  return name ? map.get(name) : undefined
}

const SIM_KEY_GOLD = new THREE.Color(0xc9a84c)

function collectPbrMaterials(
  mesh: THREE.Mesh
): Array<THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial> {
  const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).filter(
    Boolean
  ) as THREE.Material[]
  const out: Array<THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial> = []
  for (const m of mats) {
    if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
      out.push(m)
    }
  }
  return out
}

/** Short gold emissive hit — readable on merged GLB where cap motion is unreliable. */
function pulseMeshEmissiveHit(mesh: THREE.Mesh) {
  const mats = collectPbrMaterials(mesh)
  if (!mats.length) return
  const driver = (mesh.userData._emPulseDriver ??= { k: 0 })
  gsap.killTweensOf(driver)
  const snaps = mats.map((m) => ({ em: m.emissive.clone(), i: m.emissiveIntensity, m }))
  const apply = () => {
    for (const s of snaps) {
      s.m.emissive.copy(s.em).lerp(SIM_KEY_GOLD, driver.k * 0.82)
      s.m.emissiveIntensity = THREE.MathUtils.lerp(s.i, 0.65, driver.k)
    }
  }
  driver.k = 0
  apply()
  gsap
    .timeline({
      onComplete: () => {
        for (const s of snaps) {
          s.m.emissive.copy(s.em)
          s.m.emissiveIntensity = s.i
        }
      },
    })
    .to(driver, { k: 1, duration: 0.05, ease: 'power2.out', onUpdate: apply })
    .to(driver, { k: 0, duration: 0.12, ease: 'power3.out', onUpdate: apply })
}

/** Softer than `flashLight()` — used for auto-type so each stroke reads without strobing the whole scene. */
function pulseSimPointLight(light: THREE.PointLight | null) {
  if (!light) return
  gsap.killTweensOf(light)
  light.intensity = 0
  gsap
    .timeline({
      onComplete: () => {
        light.intensity = 0
      },
    })
    .to(light, { intensity: 1.45, duration: 0.038, ease: 'power2.out' })
    .to(light, { intensity: 0, duration: 0.1, ease: 'power2.in' })
}

function pulseMergedRowMeshesUnderPlate(plate: THREE.Object3D) {
  for (const name of ['Object_4', 'Object_5', 'Object_6'] as const) {
    const o = plate.getObjectByName(name)
    if (o && (o as THREE.Mesh).isMesh) pulseMeshEmissiveHit(o as THREE.Mesh)
  }
}

function buildMergedPressForRowMesh(mesh: THREE.Mesh): MergedPressConfig | undefined {
  if (!['Object_4', 'Object_5', 'Object_6'].includes(mesh.name)) return undefined
  const geom = mesh.geometry
  if (!geom) return undefined
  if (!geom.boundingBox) geom.computeBoundingBox()
  const bb = geom.boundingBox
  if (!bb) return undefined
  const ex = new THREE.Vector3()
  bb.getSize(ex)
  const { x, y, z } = ex
  if (x <= 1e-8 && y <= 1e-8 && z <= 1e-8) return undefined
  const minD = Math.min(x, y, z)
  const axis = new THREE.Vector3(0, -1, 0)
  if (minD === x) axis.set(-1, 0, 0)
  else if (minD === z) axis.set(0, 0, -1)
  axis.normalize()
  const distance = THREE.MathUtils.clamp(minD * 0.38, 0.07, 0.5)
  return {
    rest: mesh.position.clone(),
    axis,
    distance,
  }
}

function setMergedRowPressed(entry: MeshRef, t: number) {
  const m = entry.mergedPress
  if (!m) return
  const { mesh } = entry
  const { axis, distance, rest } = m
  mesh.position.copy(rest).addScaledVector(axis, -distance * THREE.MathUtils.clamp(t, 0, 1))
}

function tweenMergedRowStroke(entry: MeshRef) {
  if (!entry.mergedPress) {
    const { mesh, originalY } = entry
    gsap.to(mesh.position, {
      y: originalY - 0.14,
      duration: 0.05,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        gsap.to(mesh.position, {
          y: originalY,
          duration: 0.16,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      },
    })
    return
  }
  const w = { t: 0 }
  gsap.to(w, {
    t: 1,
    duration: 0.048,
    ease: 'power2.in',
    overwrite: 'auto',
    onUpdate: () => setMergedRowPressed(entry, w.t),
    onComplete: () => {
      gsap.to(w, {
        t: 0,
        duration: 0.17,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => setMergedRowPressed(entry, w.t),
      })
    },
  })
}

function tweenMergedRowDown(entry: MeshRef) {
  if (!entry.mergedPress) {
    entry.mesh.position.y = entry.originalY - 0.14
    return
  }
  setMergedRowPressed(entry, 1)
}

function tweenMergedRowUp(entry: MeshRef) {
  if (!entry.mergedPress) {
    gsap.to(entry.mesh.position, {
      y: entry.originalY,
      duration: 0.15,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    return
  }
  const w = { t: 1 }
  gsap.to(w, {
    t: 0,
    duration: 0.16,
    ease: 'power3.out',
    overwrite: 'auto',
    onUpdate: () => setMergedRowPressed(entry, w.t),
  })
}

const KEYCAP_GLYPH_CACHE_KEY = 'keycap_black_glyph_v2'

/** Per-cap `Key_*` meshes or merged Sketchfab rows `Object_4`–`Object_6` (actual printed keys in this GLB). */
function isKeycapSurfaceMesh(name: string): boolean {
  return name.startsWith('Key_') || name === 'Object_4' || name === 'Object_5' || name === 'Object_6'
}

/**
 * After the albedo map is applied, push darker texels (printed lettering) to true black.
 */
function installKeycapBlackLegends(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial
) {
  if (!mat.map) return
  mat.customProgramCacheKey = () => KEYCAP_GLYPH_CACHE_KEY
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
#include <map_fragment>
#ifdef USE_MAP
{
  float _lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
  float _glyph = 1.0 - smoothstep(0.02, 0.5, _lum);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0, 0.0, 0.0), _glyph);
}
#endif
`
    )
  }
  mat.needsUpdate = true
}

/** Darken key caps + kill spec/clearcoat so printed legends stay readable (white keys were clipping). */
function tuneKeyCapMaterial(m: THREE.Material): THREE.Material {
  if (m instanceof THREE.MeshPhysicalMaterial) {
    const c = m.clone()
    c.color.multiplyScalar(0.58)
    c.emissive.set(0x000000)
    c.emissiveIntensity = 0
    c.roughness = Math.min(1, (c.roughness ?? 0.5) + 0.42)
    c.metalness = 0
    c.clearcoat = 0
    c.clearcoatRoughness = 1
    c.transmission = 0
    c.thickness = 0
    c.sheen = 0
    c.reflectivity = 0
    c.envMapIntensity = Math.min(c.envMapIntensity, 0.35)
    installKeycapBlackLegends(c)
    return c
  }
  if (m instanceof THREE.MeshStandardMaterial) {
    const c = m.clone()
    c.color.multiplyScalar(0.58)
    c.emissive.set(0x000000)
    c.emissiveIntensity = 0
    c.roughness = Math.min(1, (c.roughness ?? 0.5) + 0.42)
    c.metalness = 0
    c.envMapIntensity = Math.min(c.envMapIntensity, 0.35)
    installKeycapBlackLegends(c)
    return c
  }
  if (m instanceof THREE.MeshBasicMaterial) {
    const c = m.clone()
    c.color.multiplyScalar(0.55)
    installKeycapBlackLegends(c)
    return c
  }
  return m
}

let _audioCtx: AudioContext | null = null
function getAudioCtx(): AudioContext | null {
  try {
    if (!_audioCtx) _audioCtx = new AudioContext()
    if (_audioCtx.state === 'suspended') _audioCtx.resume()
    return _audioCtx
  } catch {
    return null
  }
}

function playMechClick(isSpace = false) {
  const ctx = getAudioCtx()
  if (!ctx) return

  const now = ctx.currentTime
  const duration = isSpace ? 0.06 : 0.035
  const pitch = 1800 + Math.random() * 1200

  const clickBuf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate)
  const data = clickBuf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const env = 1 - i / data.length
    data[i] = (Math.random() * 2 - 1) * env * env
  }
  const clickSrc = ctx.createBufferSource()
  clickSrc.buffer = clickBuf

  const clickFilter = ctx.createBiquadFilter()
  clickFilter.type = 'bandpass'
  clickFilter.frequency.value = pitch
  clickFilter.Q.value = isSpace ? 1.5 : 3

  const clickGain = ctx.createGain()
  clickGain.gain.setValueAtTime(isSpace ? 0.18 : 0.14, now)
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.02)

  clickSrc.connect(clickFilter).connect(clickGain).connect(ctx.destination)
  clickSrc.start(now)
  clickSrc.stop(now + duration + 0.03)

  const thockOsc = ctx.createOscillator()
  thockOsc.type = 'sine'
  thockOsc.frequency.setValueAtTime(isSpace ? 65 : 90 + Math.random() * 30, now)
  thockOsc.frequency.exponentialRampToValueAtTime(40, now + 0.05)

  const thockGain = ctx.createGain()
  thockGain.gain.setValueAtTime(isSpace ? 0.12 : 0.06, now)
  thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

  thockOsc.connect(thockGain).connect(ctx.destination)
  thockOsc.start(now)
  thockOsc.stop(now + 0.06)
}

function KeyboardModel({
  onKeyCharacter,
  introTick = 0,
}: {
  onKeyCharacter?: (char: string) => void
  introTick?: number
}) {
  const { scene } = useGLTF('/models/apple_magic_keyboard.glb')
  const rootRef = useRef<THREE.Group>(null)
  const meshMapRef = useRef<Map<string, MeshRef>>(new Map())
  /** Merged Sketchfab-style GLBs use a `Keys_0` group instead of per-cap `Key_*` meshes. */
  const keysPlateRef = useRef<THREE.Object3D | null>(null)
  const keysPlateBaseYRef = useRef(0)
  const pointLightRef = useRef<THREE.PointLight>(null)
  const sudoBufferRef = useRef('')
  const sudoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pressedKeysRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const map = meshMapRef.current
    map.clear()

    // Auto-center and normalize model scale so different GLB exports
    // sit centered in the viewport without manual tweaking.
    const bounds = new THREE.Box3().setFromObject(scene)
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const normalizedScale = 3.85 / maxDim

    scene.position.sub(center)
    scene.scale.setScalar(normalizedScale)
    // Final resting orientation: high-view, low keyboard angle.
    scene.rotation.set(0.34, -0.02, 0)

    const keysPlate = scene.getObjectByName('Keys_0') ?? null
    keysPlateRef.current = keysPlate
    if (keysPlate) keysPlateBaseYRef.current = keysPlate.position.y

    // Mesh map + merged-row press data (needs final transforms so bbox matches what you see).
    scene.updateMatrixWorld(true)
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        map.set(mesh.name, {
          mesh,
          originalY: mesh.position.y,
          originalZ: mesh.position.z,
          mergedPress: buildMergedPressForRowMesh(mesh),
        })
      }
    })

    // Key caps: merged GLB uses Object_4/5/6 — not Key_*; still need legend shader + tuned mats.
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh || !isKeycapSurfaceMesh(mesh.name)) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const next = mats.map((mat) => tuneKeyCapMaterial(mat))
      mesh.material = next.length === 1 ? next[0]! : next
    })
  }, [scene])

  useEffect(() => {
    if (!scene || introTick <= 0) return
    // Replay intro exactly when section enters viewport.
    scene.rotation.set(-0.52, 0.24, 0)
    gsap.to(scene.rotation, {
      x: 0.34,
      y: -0.02,
      z: 0,
      duration: 1.12,
      ease: 'power3.out',
    })
  }, [introTick, scene])

  const playSudoSound = useCallback(() => {
    const ctx = getAudioCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.35)
  }, [])

  const activateSudo = useCallback(() => {
    document.body.classList.add('sudo-mode')
    playSudoSound()

    if (sudoTimeoutRef.current) clearTimeout(sudoTimeoutRef.current)
    sudoTimeoutRef.current = setTimeout(() => {
      document.body.classList.remove('sudo-mode')
    }, 5000)
  }, [playSudoSound])

  const flashLight = useCallback(() => {
    if (pointLightRef.current) {
      gsap.fromTo(
        pointLightRef.current,
        { intensity: 0 },
        { intensity: 3, duration: 0.06, yoyo: true, repeat: 1, ease: 'power2.out' }
      )
    }
  }, [])

  const KEY_TRAVEL = 0.0082
  /** Visible travel when the GLB has merged key geometry under `Keys_0` (no `Key_A` meshes). */
  const PLATE_TRAVEL_BASE = 0.024

  const animateKeysPlateStroke = useCallback((code: string) => {
    const plate = keysPlateRef.current
    if (!plate) return
    const baseY = keysPlateBaseYRef.current
    const hash = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const travel = PLATE_TRAVEL_BASE + (hash % 9) * 0.0022
    gsap.killTweensOf(plate.position)
    gsap.fromTo(
      plate.position,
      { y: baseY },
      {
        y: baseY - travel,
        duration: 0.058,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(plate.position, {
            y: baseY,
            duration: 0.17,
            ease: 'back.out(2.6)',
          })
        },
      }
    )
  }, [])

  /**
   * Programmatic stroke: mesh motion where it works, plus **emissive + soft rim light** so
   * auto-type always reads on merged GLBs (geometry-only motion is often invisible).
   */
  const pressKey = useCallback((character: string) => {
    const code = characterToKeyboardCode(character)
    if (!code || !(code in KEY_MAP)) return

    const map = meshMapRef.current
    const glbName = KEY_MAP[code]
    const entry = map.get(glbName)

    if (entry) {
      gsap.to(entry.mesh.position, {
        y: entry.originalY - KEY_TRAVEL,
        duration: 0.055,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(entry.mesh.position, {
            y: entry.originalY,
            duration: 0.15,
            ease: 'back.out(2.8)',
          })
        },
      })
      pulseMeshEmissiveHit(entry.mesh)
    } else {
      const rowEntry = getMergedRowMeshRef(code, map)
      if (rowEntry) {
        tweenMergedRowStroke(rowEntry)
        pulseMeshEmissiveHit(rowEntry.mesh)
      } else if (keysPlateRef.current) {
        const plate = keysPlateRef.current
        gsap.killTweensOf(plate.position)
        gsap.to(plate.position, {
          y: keysPlateBaseYRef.current - PLATE_TRAVEL_BASE,
          duration: 0.055,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(plate.position, {
              y: keysPlateBaseYRef.current,
              duration: 0.15,
              ease: 'back.out(2.8)',
            })
          },
        })
        pulseMergedRowMeshesUnderPlate(plate)
      }
    }

    pulseSimPointLight(pointLightRef.current)
    playMechClick(code === 'Space')
  }, [])

  const animateKeyPress = useCallback(
    (code: string, silent?: boolean, holdKeyDown?: boolean) => {
      const map = meshMapRef.current
      const meshName = KEY_MAP[code]
      if (meshName) {
        const entry = map.get(meshName)
        if (entry) {
          if (holdKeyDown) {
            gsap.to(entry.mesh.position, {
              y: entry.originalY - KEY_TRAVEL,
              duration: 0.052,
              ease: 'power2.in',
            })
          } else {
            gsap.to(entry.mesh.position, {
              y: entry.originalY - KEY_TRAVEL,
              duration: 0.055,
              ease: 'power2.in',
              onComplete: () => {
                gsap.to(entry.mesh.position, {
                  y: entry.originalY,
                  duration: 0.16,
                  ease: 'back.out(2.8)',
                })
              },
            })
          }
        } else {
          const rowEntry = getMergedRowMeshRef(code, map)
          if (rowEntry) {
            if (holdKeyDown) tweenMergedRowDown(rowEntry)
            else tweenMergedRowStroke(rowEntry)
          } else if (keysPlateRef.current) {
            const plate = keysPlateRef.current
            if (holdKeyDown) {
              gsap.killTweensOf(plate.position)
              gsap.to(plate.position, {
                y: keysPlateBaseYRef.current - PLATE_TRAVEL_BASE,
                duration: 0.055,
                ease: 'power2.in',
              })
            } else {
              animateKeysPlateStroke(code)
            }
          }
        }
      }
      if (!silent) playMechClick(code === 'Space')
    },
    [animateKeysPlateStroke]
  )

  const onKeyMeshPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      const name = (e.object as THREE.Mesh).name
      const code =
        MESH_TO_CODE[name] ?? (name.startsWith('Object_') ? 'KeyH' : undefined)
      if (!code) return
      animateKeyPress(code, false, false)
      flashLight()
    },
    [animateKeyPress, flashLight]
  )

  useEffect(() => {
    const disposeSim = registerPortfolioKeySimConsumer(({ code, silent }) => {
      if (!(code in KEY_MAP)) return
      animateKeyPress(code, silent)
      if (!silent) flashLight()
    })
    return disposeSim
  }, [animateKeyPress, flashLight])

  useEffect(() => {
    const handler: EventListener = (e) => {
      const ce = e as CustomEvent<{ character?: string }>
      const ch = ce.detail?.character
      if (typeof ch !== 'string' || ch.length === 0) return
      pressKey(ch)
    }
    window.addEventListener('simulateKeyPress', handler)
    return () => window.removeEventListener('simulateKeyPress', handler)
  }, [pressKey])

  useEffect(() => {
    const map = meshMapRef.current

    const onKeyDown = (e: KeyboardEvent) => {
      if (pressedKeysRef.current.has(e.code)) return
      pressedKeysRef.current.add(e.code)
      const isSynthetic = !e.isTrusted

      const meshName = KEY_MAP[e.code]
      if (meshName) {
        const entry = map.get(meshName)
        if (entry) {
          gsap.to(entry.mesh.position, {
            y: entry.originalY - KEY_TRAVEL,
            duration: 0.055,
            ease: 'power2.in',
          })
        } else {
          const rowEntry = getMergedRowMeshRef(e.code, map)
          if (rowEntry) {
            tweenMergedRowDown(rowEntry)
          } else if (keysPlateRef.current) {
            gsap.killTweensOf(keysPlateRef.current.position)
            gsap.to(keysPlateRef.current.position, {
              y: keysPlateBaseYRef.current - PLATE_TRAVEL_BASE,
              duration: 0.055,
              ease: 'power2.in',
            })
          }
        }
      }

      // Ignore synthetic (programmatic) keyboard events for audio/light
      // to avoid continuous flicker/click loops from automated animations.
      if (!isSynthetic) {
        playMechClick(e.code === 'Space')
      }

      if (
        onKeyCharacter &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        onKeyCharacter(e.key)
      }

      if (!isSynthetic) {
        flashLight()
      }

      const letter = e.key.length === 1 ? e.key.toUpperCase() : ''
      if (letter) {
        sudoBufferRef.current = (sudoBufferRef.current + letter).slice(-4)
        if (sudoBufferRef.current === 'SUDO') {
          sudoBufferRef.current = ''
          activateSudo()
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current.delete(e.code)

      const meshName = KEY_MAP[e.code]
      if (meshName) {
        const entry = map.get(meshName)
        if (entry) {
          gsap.to(entry.mesh.position, {
            y: entry.originalY,
            duration: 0.15,
            ease: 'back.out(2.8)',
          })
        } else {
          const rowEntry = getMergedRowMeshRef(e.code, map)
          if (rowEntry) {
            tweenMergedRowUp(rowEntry)
          } else if (keysPlateRef.current) {
            gsap.to(keysPlateRef.current.position, {
              y: keysPlateBaseYRef.current,
              duration: 0.15,
              ease: 'back.out(2.8)',
            })
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      if (sudoTimeoutRef.current) clearTimeout(sudoTimeoutRef.current)
    }
  }, [activateSudo, flashLight, onKeyCharacter])

  return (
    <group ref={rootRef}>
      <primitive object={scene} onPointerDown={onKeyMeshPointerDown} />
      <pointLight
        ref={pointLightRef}
        position={[0, 0.8, 0.2]}
        color="#C9A84C"
        intensity={0}
        distance={5}
        decay={2}
      />
    </group>
  )
}

function WireframeFallback() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(clock.elapsedTime * 2) * 0.25
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[3, 0.15, 1]} />
      <meshBasicMaterial color="#C9A84C" wireframe transparent opacity={0.5} />
    </mesh>
  )
}

export default function InteractiveKeyboard({
  className,
  style,
  onKeyCharacter,
  introTick,
  orbitEnabled = true,
}: KeyboardProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        touchAction: orbitEnabled ? 'none' : 'auto',
        pointerEvents: 'auto',
        overflow: 'visible',
        background: 'transparent',
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 1.72, 4.55], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{
          width: '100%',
          height: '100%',
          cursor: orbitEnabled ? 'grab' : 'default',
          pointerEvents: 'auto',
          touchAction: orbitEnabled ? 'none' : 'auto',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          // Lower than 1.0: keeps key-cap albedo below clip so letter art stays visible.
          gl.toneMappingExposure = 0.86
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <OrbitControls
          makeDefault
          enableRotate={orbitEnabled}
          target={[0, 0.36, 0]}
          autoRotate={false}
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.45}
        />
        <ambientLight intensity={0.48} />
        <hemisphereLight args={['#f0ebe3', '#0a0a0a', 0.52]} />
        {/* Primary — slightly angled to rake across key tops for glyph contrast */}
        <directionalLight position={[0.6, 5.0, 2.8]} intensity={1.05} color="#ffffff" />
        <directionalLight position={[-3.2, 3.1, 1.6]} intensity={0.45} color="#d4b87a" />
        <directionalLight position={[2.2, 1.6, 4.8]} intensity={0.42} color="#c8d4ee" />
        <directionalLight position={[0, 2.2, 5.4]} intensity={0.38} color="#f5f0e6" />
        <spotLight
          position={[0.15, 4.2, 2.9]}
          angle={0.52}
          penumbra={0.92}
          intensity={0.72}
          color="#fff4e0"
          castShadow={false}
        />
        <Suspense fallback={<WireframeFallback />}>
          <KeyboardModel onKeyCharacter={onKeyCharacter} introTick={introTick} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/apple_magic_keyboard.glb')
