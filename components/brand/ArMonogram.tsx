import type { CSSProperties, HTMLAttributes } from 'react'
import { CREST_INK_H, CREST_INK_W } from '@/components/brand/crest-meta'

/** Ink PNG (black + internal light lines on transparent). Used for `light` tone + pipeline source. */
const CREST_SRC = '/brand/ar-crest-hd.png'

/** Cleaned + gold-tinted 3DLogoLab crest used in top bar. */
const CREST_GOLD_SRC = '/brand/ar-topbar-3d-gold.png'
const CREST_GOLD_W = 407
const CREST_GOLD_H = 496

/** Loader / light UI: invert keeps all line detail vs painting every pixel white. */
const LIGHT_FILTER = 'invert(1)'

export type ArMonogramProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** CSS width in px when not filling a parent */
  size?: number
  markTitle?: string
  tone?: 'gold' | 'light'
  /** Passed to `<img sizes>` when using fluid layout (loader); improves DPR pick */
  imgSizes?: string
}

/**
 * Raster crest at **native ink resolution** (see `crest-meta.ts`) — browser scales down sharply.
 * Avoids CSS `mask-image` (often soft / stair‑stepped). Replace PNGs in `/public/brand/` to rebrand.
 */
export function ArMonogram({
  size = 36,
  className,
  markTitle = 'AR',
  tone = 'gold',
  imgSizes,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  style,
  ...rest
}: ArMonogramProps) {
  const isFluid = style?.width === '100%' && style?.height === '100%'
  const isGold = tone === 'gold'
  const nativeW = isGold ? CREST_GOLD_W : CREST_INK_W
  const nativeH = isGold ? CREST_GOLD_H : CREST_INK_H
  const hFixed = size != null ? Math.round((size * nativeH) / nativeW) : undefined

  const imgStyle: CSSProperties = {
    display: 'block',
    width: isFluid ? '100%' : size,
    height: isFluid ? '100%' : hFixed,
    objectFit: 'contain',
    objectPosition: 'center',
    filter: tone === 'light' ? LIGHT_FILTER : undefined,
    WebkitFontSmoothing: 'antialiased',
    ...(!isFluid ? { maxWidth: '100%' } : {}),
  }

  return (
    <div
      className={className}
      style={{
        lineHeight: 0,
        ...(!isFluid && size != null
          ? { width: size, height: hFixed }
          : { width: '100%', height: '100%' }),
        ...style,
      }}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : (ariaLabel ?? markTitle)}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- native dims + sizes = crisp; next/image re-encodes */}
      <img
        src={isGold ? CREST_GOLD_SRC : CREST_SRC}
        width={nativeW}
        height={nativeH}
        sizes={
          imgSizes ??
          (isFluid
            ? '(min-width: 768px) 80px, 64px'
            : `${Math.max(48, size ?? 36)}px`)
        }
        decoding="async"
        fetchPriority="high"
        alt=""
        draggable={false}
        style={imgStyle}
      />
    </div>
  )
}
