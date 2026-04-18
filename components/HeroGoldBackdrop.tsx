'use client'

/**
 * CSS-only hero backdrop — avoids a second WebGL context and per-frame shader work on the GPU.
 */
export default function HeroGoldBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hero-gold-backdrop"
      aria-hidden
      style={{
        background: `
          radial-gradient(ellipse 85% 60% at 72% 42%, rgba(201, 168, 76, 0.16) 0%, transparent 52%),
          radial-gradient(ellipse 55% 45% at 22% 78%, rgba(201, 168, 76, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 50% 120%, rgba(18, 16, 14, 0.95) 0%, transparent 55%),
          var(--black)
        `,
      }}
    />
  )
}
