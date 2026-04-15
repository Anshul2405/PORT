/** Ink bounding box of `public/brand/ar-crest-hd.png` (updated when you re-run `scripts/sync-crest-logo.py`) */
export const CREST_INK_W = 704
export const CREST_INK_H = 863
export const crestAspectRatio = `${CREST_INK_W} / ${CREST_INK_H}` as const
/** height = width × (H/W) */
export const crestHeightForWidth = (w: number) => Math.round((w * CREST_INK_H) / CREST_INK_W)
