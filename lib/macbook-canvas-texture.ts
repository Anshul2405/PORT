import type { CanvasTexture } from 'three'
import { getMacbookTextureRotationDeg } from '@/lib/macbook-display-fit'

/**
 * LCD map sampling for hero/stage CanvasTextures.
 * Uses GPU `texture.rotation` (same as Three’s map UV transform). CPU “bake” rotation was removed:
 * it fought canvas Y-down vs GL upload + mesh UVs and kept landing sideways or lopsided.
 *
 * **flipY:** Default `false`. Parent `Texture` defaults to `true`, which often makes canvas-authored
 * screens appear mirrored / rotated wrong relative to the GLB LCD.
 */
export function applyMacbookScreenTextureParams(texture: CanvasTexture): void {
  texture.center.set(0.5, 0.5)

  const deg = getMacbookTextureRotationDeg()
  texture.rotation = (deg * Math.PI) / 180

  const flip = process.env.NEXT_PUBLIC_MACBOOK_TEX_FLIP_Y?.trim().toLowerCase()
  if (flip === 'true' || flip === '1') texture.flipY = true
  else if (flip === 'false' || flip === '0') texture.flipY = false
  /* default: Three.js Texture default (true) — correct for canvas-authored maps on standard mesh UVs */

  texture.updateMatrix()
  texture.needsUpdate = true
}
