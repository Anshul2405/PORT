'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type Lenis from 'lenis'

const LenisRefContext = createContext<(() => Lenis | null) | null>(null)

export function useLenis(): (() => Lenis | null) | null {
  return useContext(LenisRefContext)
}

export function LenisProvider({ children, lenisRef }: { children: ReactNode; lenisRef: React.RefObject<Lenis | null> }) {
  return (
    <LenisRefContext.Provider value={() => lenisRef.current}>
      {children}
    </LenisRefContext.Provider>
  )
}
