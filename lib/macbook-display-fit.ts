import * as THREE from 'three'
import { MACBOOK_GLTF_URL } from '@/lib/macbook-model-url'
import { SCREEN_W, SCREEN_H, TEX_SCALE } from '@/lib/macbook-screens'

const DEFAULT_ASPECT = 1600 / 1000

// ─── macbook_air_m2.glb UV screen-face measurements ───────────────────────────
// Extracted from the baked Glass_-_Heavy_Color texture (2048 × 2048 JPEG).
// The wallpaper sits at image pixels x=1070–1989, y=23–1516.
//
// The mesh UV attributes for Object_4 (Glass) are arranged unusually:
//   getX() = u  →  screen VERTICAL   (u=0.5225 at screen TOP,  u=0.9712 at BOTTOM)
//   getY() = v  →  screen HORIZONTAL (v=0.0112 at screen LEFT, v=0.7402 at RIGHT)
//
// With texture.rotation=90°, flipY=true the CanvasTexture sampling is:
//   canvas_x = v × W   →  canvas X maps to screen LEFT ↔ RIGHT  ✓
//   canvas_y = u × H   →  canvas Y maps to screen TOP  ↔ BOTTOM ✓
//
// So only the canvas sub-region
//   x ∈ [V_LEFT×W, V_RIGHT×W]  and  y ∈ [U_TOP×H, U_BOTTOM×H]
// is visible on the physical display.  Everything outside is bezel / lid-back.
const AIR_V_LEFT   = 0.0112   // canvas_x = V_LEFT   × W  →  screen left  edge
const AIR_V_RIGHT  = 0.7402   // canvas_x = V_RIGHT  × W  →  screen right edge
const AIR_U_TOP    = 0.5225   // canvas_y = U_TOP    × H  →  screen top   edge
const AIR_U_BOTTOM = 0.9712   // canvas_y = U_BOTTOM × H  →  screen bottom edge
const AIR_V_SPAN   = AIR_V_RIGHT  - AIR_V_LEFT    // 0.7290
const AIR_U_SPAN   = AIR_U_BOTTOM - AIR_U_TOP     // 0.4487

/**
 * True when we should use the UV-offset drawing path for macbook_air_m2.glb.
 * Can be overridden with NEXT_PUBLIC_MACBOOK_CANVAS_ASPECT=hero|mesh.
 */
function isMacbookAirUVMode(): boolean {
  const mode = process.env.NEXT_PUBLIC_MACBOOK_CANVAS_ASPECT?.trim().toLowerCase()
  if (mode === 'hero' || mode === 'mesh') return false
  return MACBOOK_GLTF_URL.includes('macbook_air')
}

/** LCD angle in degrees; also used when baking the texture in `macbook-canvas-texture`. */
export function getMacbookTextureRotationDeg(): number {
  const explicit = process.env.NEXT_PUBLIC_MACBOOK_TEX_ROTATION_DEG?.trim()
  if (explicit !== undefined && explicit !== '') {
    const n = Number(explicit)
    return Number.isFinite(n) ? n : 0
  }
  if (MACBOOK_GLTF_URL.includes('macbook_air')) return 90
  return 0
}

/** UV bounds → du/dv (often ~1 on Sketchfab atlases even when the glass is ~16:10). */
function estimateMacbookGlassAspectFromUV(mesh: THREE.Mesh): number | null {
  const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute | undefined
  if (!uv) return null
  let minU = Infinity
  let maxU = -Infinity
  let minV = Infinity
  let maxV = -Infinity
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i)
    const v = uv.getY(i)
    if (!Number.isFinite(u) || !Number.isFinite(v)) continue
    minU = Math.min(minU, u)
    maxU = Math.max(maxU, u)
    minV = Math.min(minV, v)
    maxV = Math.max(maxV, v)
  }
  const du = maxU - minU
  const dv = maxV - minV
  if (!(du > 1e-8 && dv > 1e-8)) return null
  const asp = du / dv
  if (asp > 0.15 && asp < 6) return asp
  return null
}

/** In-plane aspect from bbox (two largest axes) — matches physical LCD shape for thin glass. */
function estimateMacbookGlassAspectFromBBox(mesh: THREE.Mesh): number | null {
  if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
  const bb = mesh.geometry.boundingBox!
  const size = new THREE.Vector3()
  bb.getSize(size)
  const dims = [size.x, size.y, size.z].sort((a, b) => b - a)
  const [a, b, c] = dims
  const thin = c / Math.max(a, 1e-6) < 0.12
  const w = thin ? a : dims[0]
  const h = thin ? b : dims[1]
  const asp = w / Math.max(h, 1e-6)
  if (Number.isFinite(asp) && asp > 0.15 && asp < 6) return asp
  return null
}

/**
 * Prefer bbox when UV is a square atlas but the glass sheet is physically wider (macbook_air_m2
 * Object_4: UV≈1, bbox≈1.48). Otherwise bbox first, UV fallback.
 */
export function estimateMacbookGlassAspect(mesh: THREE.Mesh): number {
  const bboxAsp = estimateMacbookGlassAspectFromBBox(mesh)
  const uvAsp = estimateMacbookGlassAspectFromUV(mesh)

  if (bboxAsp != null && uvAsp != null) {
    const uvSquare = Math.abs(uvAsp - 1) < 0.11
    const bboxNotSquare = Math.abs(bboxAsp - 1) > 0.18
    if (uvSquare && bboxNotSquare && Math.abs(bboxAsp - uvAsp) > 0.15) return bboxAsp
  }

  if (bboxAsp != null) return bboxAsp
  if (uvAsp != null) return uvAsp
  return DEFAULT_ASPECT
}

/**
 * Canvas width/height ratio that fills the LCD without distortion.
 *
 * Three.js UV rotation=90° with flipY=true maps canvas-X → screen-horizontal and
 * canvas-Y → screen-vertical (confirmed from visible screenshot orientation). So the display
 * canvas aspect must equal the physical screen aspect, same as the 0° case.
 * (Earlier code returned 1/meshAspect which was the source of the horizontal stretch.)
 */
export function effectiveMacbookContentAspect(meshAspect: number, _rotationDeg: number): number {
  return meshAspect
}

export function resolveMacbookScreenAspect(mesh: THREE.Mesh | null): number {
  const env = process.env.NEXT_PUBLIC_MACBOOK_SCREEN_ASPECT?.trim()
  if (env !== undefined && env !== '') {
    const n = Number(env)
    if (Number.isFinite(n) && n > 0.1) return n
  }
  return mesh ? estimateMacbookGlassAspect(mesh) : DEFAULT_ASPECT
}

/**
 * Pixel size for the offscreen texture canvas.
 *
 * For **macbook_air_m2.glb** (default): uses the UV-aware sizing so that the canvas
 * sub-region that maps to the physical LCD has exactly the hero aspect ratio (16:10).
 * This allows `drawMacbookScreenContain` to place the full hero at the correct UV offset
 * with zero letterboxing and zero distortion.
 *   W/H = hero_aspect × AIR_U_SPAN / AIR_V_SPAN ≈ 0.985 (nearly-square canvas)
 *
 * Set `NEXT_PUBLIC_MACBOOK_CANVAS_ASPECT=hero` for a raw 16:10 canvas (debug).
 * Set `NEXT_PUBLIC_MACBOOK_CANVAS_ASPECT=mesh` for the old mesh-aspect sizing.
 */
export function getMacbookDisplayCanvasSize(mesh: THREE.Mesh | null): { width: number; height: number } {
  const mode = process.env.NEXT_PUBLIC_MACBOOK_CANVAS_ASPECT?.trim().toLowerCase()
  if (mode === 'hero') {
    return { width: SCREEN_W * TEX_SCALE, height: SCREEN_H * TEX_SCALE }
  }
  const hPx = SCREEN_H * TEX_SCALE
  if (isMacbookAirUVMode()) {
    // Size the canvas so the visible UV region (AIR_V_SPAN × AIR_U_SPAN) has the
    // same aspect ratio as the hero canvas (SCREEN_W/SCREEN_H = 1.6).
    // Equation: (AIR_V_SPAN × W) / (AIR_U_SPAN × H) = 1.6
    //        → W = H × 1.6 × AIR_U_SPAN / AIR_V_SPAN ≈ 1970
    const wPx = Math.round(hPx * (SCREEN_W / SCREEN_H) * AIR_U_SPAN / AIR_V_SPAN)
    return { width: wPx, height: hPx }
  }
  // Generic mesh-matched sizing for other GLBs (or explicit 'mesh' mode)
  const rot = getMacbookTextureRotationDeg()
  const meshAsp = resolveMacbookScreenAspect(mesh)
  const eff = effectiveMacbookContentAspect(meshAsp, rot)
  const wPx = Math.max(64, Math.round(hPx * eff))
  return { width: wPx, height: hPx }
}

/** `object-fit: contain` — full source visible, uniform scale, letterbox if aspects differ. */
export function computeContainDestRect(
  srcW: number,
  srcH: number,
  destW: number,
  destH: number,
): { ox: number; oy: number; dw: number; dh: number } {
  const srcAspect = srcW / Math.max(srcH, 1)
  const destAspect = destW / Math.max(destH, 1)
  if (srcAspect > destAspect) {
    const dw = destW
    const dh = dw / srcAspect
    return { ox: 0, oy: (destH - dh) / 2, dw, dh }
  }
  const dh = destH
  const dw = dh * srcAspect
  return { ox: (destW - dw) / 2, oy: 0, dw, dh }
}

/**
 * Compute the sub-region of the display canvas that is actually visible on the
 * physical screen.  For macbook_air_m2.glb with rotation=90° + flipY=true the
 * visible region is offset from the canvas origin because the glass UV atlas
 * places the screen face at u∈[0.52,0.97], v∈[0.01,0.74].
 */
function macbookAirScreenRect(destW: number, destH: number): { x0: number; y0: number; rw: number; rh: number } {
  if (isMacbookAirUVMode()) {
    return {
      x0: AIR_V_LEFT   * destW,
      y0: AIR_U_TOP    * destH,
      rw: AIR_V_SPAN   * destW,
      rh: AIR_U_SPAN   * destH,
    }
  }
  return { x0: 0, y0: 0, rw: destW, rh: destH }
}

/** Fits hero/stage into the LCD bitmap without cropping (`object-fit: contain`). */
export function drawMacbookScreenContain(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  destW: number,
  destH: number,
): void {
  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, destW, destH)
  const { x0, y0, rw, rh } = macbookAirScreenRect(destW, destH)
  const { ox, oy, dw, dh } = computeContainDestRect(src.width, src.height, rw, rh)
  ctx.drawImage(src, x0 + ox, y0 + oy, dw, dh)
}

/** Crossfade with matching contain rects per layer (hero/stage usually share dimensions). */
export function drawMacbookCrossfadeContain(
  ctx: CanvasRenderingContext2D,
  bottom: HTMLCanvasElement,
  top: HTMLCanvasElement,
  destW: number,
  destH: number,
  blendTop: number,
): void {
  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, destW, destH)
  const { x0, y0, rw, rh } = macbookAirScreenRect(destW, destH)
  const r0 = computeContainDestRect(bottom.width, bottom.height, rw, rh)
  const r1 = computeContainDestRect(top.width, top.height, rw, rh)
  const t = Math.max(0, Math.min(1, blendTop))
  ctx.globalAlpha = 1 - t
  ctx.drawImage(bottom, x0 + r0.ox, y0 + r0.oy, r0.dw, r0.dh)
  ctx.globalAlpha = t
  ctx.drawImage(top, x0 + r1.ox, y0 + r1.oy, r1.dw, r1.dh)
  ctx.globalAlpha = 1
}
