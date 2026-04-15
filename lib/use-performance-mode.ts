'use client'

import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 8
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : 8
  return cores <= 4 || memory <= 4
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return isLowPowerDevice() || window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia(REDUCED_MOTION_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function usePerformanceLiteMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

