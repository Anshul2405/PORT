'use client'

import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const NARROW_VIEWPORT_QUERY = '(max-width: 768px)'
/** Touch-first or no fine pointer — prefer lighter content. */
const COARSE_OR_NO_HOVER_QUERY = '(pointer: coarse), (hover: none)'

function connectionSuggestsLite(nav: Navigator): boolean {
  const conn = (nav as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  if (!conn) return false
  if (conn.saveData === true) return true
  const t = conn.effectiveType
  return t === 'slow-2g' || t === '2g'
}

export function evaluatePerformanceLiteMode(): boolean {
  if (typeof window === 'undefined') return false

  const nav = navigator
  if (
    window.matchMedia(REDUCED_MOTION_QUERY).matches ||
    window.matchMedia(NARROW_VIEWPORT_QUERY).matches ||
    window.matchMedia(COARSE_OR_NO_HOVER_QUERY).matches ||
    connectionSuggestsLite(nav)
  ) {
    return true
  }
  return false
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const mqRm = window.matchMedia(REDUCED_MOTION_QUERY)
  const mqVp = window.matchMedia(NARROW_VIEWPORT_QUERY)
  const mqPtr = window.matchMedia(COARSE_OR_NO_HOVER_QUERY)

  mqRm.addEventListener('change', onStoreChange)
  mqVp.addEventListener('change', onStoreChange)
  mqPtr.addEventListener('change', onStoreChange)

  const conn = (navigator as Navigator & { connection?: EventTarget }).connection
  if (conn && 'addEventListener' in conn) {
    conn.addEventListener('change', onStoreChange as EventListener)
  }

  window.addEventListener('resize', onStoreChange)

  return () => {
    mqRm.removeEventListener('change', onStoreChange)
    mqVp.removeEventListener('change', onStoreChange)
    mqPtr.removeEventListener('change', onStoreChange)
    if (conn && 'removeEventListener' in conn) {
      conn.removeEventListener('change', onStoreChange as EventListener)
    }
    window.removeEventListener('resize', onStoreChange)
  }
}

export function usePerformanceLiteMode(): boolean {
  return useSyncExternalStore(
    subscribe,
    evaluatePerformanceLiteMode,
    () => false,
  )
}
