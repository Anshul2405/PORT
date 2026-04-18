import * as THREE from 'three'
import type { Mesh, Object3D } from 'three'

const ENV =
  typeof process.env.NEXT_PUBLIC_MACBOOK_SCREEN_MESH === 'string'
    ? process.env.NEXT_PUBLIC_MACBOOK_SCREEN_MESH.trim()
    : ''

/**
 * macbook_air_m2.glb (Sketchfab): the visible wallpaper sits on **Glass_-_Heavy_Color**
 * (node name `Object_4`), not the keyboard (`Object_3` + keyboard.jpg — larger UV area).
 * Legacy macbook_opt used `Object_123`.
 */
const FALLBACK_SCREEN_NAMES = [
  'Object_123',
  'Object_4',
  'Object_8',
  'Object_6',
  'Object_3',
  'Object_2',
  'Object_7',
  'Object_5',
]

function materialHasDiffuseMap(mat: THREE.Material): boolean {
  if (
    !(mat instanceof THREE.MeshStandardMaterial) &&
    !(mat instanceof THREE.MeshBasicMaterial) &&
    !(mat instanceof THREE.MeshPhysicalMaterial)
  ) {
    return false
  }
  return mat.map != null
}

/** Keyboard mesh uses a huge texture — never treat it as the LCD. */
function isKeyboardLikeMaterial(mat: THREE.Material): boolean {
  return (mat.name || '').toLowerCase().includes('keyboard')
}

/** Diffuse map that is safe to replace with our canvas (excludes keyboard decal). */
function hasScreenDiffuseMap(mat: THREE.Material): boolean {
  return materialHasDiffuseMap(mat) && !isKeyboardLikeMaterial(mat)
}

/** Replace screen material; prefers the glass/LCD slot over keyboard textures. */
export function assignMacbookScreenMaterial(
  mesh: Mesh,
  screenMat: THREE.MeshStandardMaterial,
): void {
  const disposeStd = (m: THREE.Material) => {
    if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
      m.map?.dispose()
      m.emissiveMap?.dispose()
      m.normalMap?.dispose()
      m.roughnessMap?.dispose()
      m.metalnessMap?.dispose()
    }
    m.dispose()
  }

  if (Array.isArray(mesh.material)) {
    const mats = mesh.material as THREE.Material[]
    let idx = mats.findIndex((m) => hasScreenDiffuseMap(m))
    if (idx < 0) idx = mats.findIndex((m) => materialHasDiffuseMap(m))
    if (idx < 0) idx = 0
    disposeStd(mats[idx])
    const next = [...mats]
    next[idx] = screenMat
    mesh.material = next as THREE.Material[]
  } else {
    disposeStd(mesh.material)
    mesh.material = screenMat
  }
}

function meshUsesGlassWallpaper(mesh: Mesh): boolean {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  return mats.some((mat) => {
    if (!materialHasDiffuseMap(mat)) return false
    const n = (mat.name || '').toLowerCase()
    return n.includes('glass') && !n.includes('keyboard')
  })
}

export function findMacbookScreenMesh(root: Object3D): Mesh | null {
  const names = ENV ? [ENV] : FALLBACK_SCREEN_NAMES
  for (const name of names) {
    let hit: Mesh | null = null
    root.traverse((child) => {
      const m = child as Mesh
      if (m.isMesh && m.name === name) hit = m
    })
    if (hit) return hit
  }

  /* Prefer the glass mesh that carries the baked wallpaper texture */
  let glass: Mesh | null = null
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    if (meshUsesGlassWallpaper(mesh)) glass = mesh
  })
  if (glass) return glass

  let best: Mesh | null = null
  let bestScore = 0
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const hasMap = mats.some((mat) => hasScreenDiffuseMap(mat))
    if (!hasMap) return
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
    const bb = mesh.geometry.boundingBox!
    const size = new THREE.Vector3()
    bb.getSize(size)
    const dims = [size.x, size.y, size.z].filter((d) => d > 1e-6)
    dims.sort((a, b) => b - a)
    const score = dims.length >= 2 ? dims[0] * dims[1] : 0
    if (score > bestScore) {
      bestScore = score
      best = mesh
    }
  })
  if (best) return best

  bestScore = 0
  root.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
    const bb = mesh.geometry.boundingBox!
    const size = new THREE.Vector3()
    bb.getSize(size)
    const dims = [size.x, size.y, size.z].filter((d) => d > 1e-6)
    dims.sort((a, b) => b - a)
    const score = dims.length >= 2 ? dims[0] * dims[1] : 0
    if (score > bestScore) {
      bestScore = score
      best = mesh
    }
  })
  return best
}
