/**
 * Single source for the MacBook GLB used by SharedMacBook + mobile preview.
 *
 * Drop a lighter model into `/public/models/` (e.g. decimated mesh) and set:
 * `NEXT_PUBLIC_MACBOOK_GLB=/models/your_model.glb`
 */
function normalizePublicPath(raw: string): string {
  const t = raw.trim()
  if (!t) return '/models/macbook_air_m2.glb'
  return t.startsWith('/') ? t : `/${t}`
}

export const MACBOOK_GLTF_URL =
  typeof process.env.NEXT_PUBLIC_MACBOOK_GLB === 'string' &&
  process.env.NEXT_PUBLIC_MACBOOK_GLB.trim().length > 0
    ? normalizePublicPath(process.env.NEXT_PUBLIC_MACBOOK_GLB)
    : '/models/macbook_air_m2.glb'
