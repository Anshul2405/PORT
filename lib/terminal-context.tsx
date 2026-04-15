'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface TerminalState {
  isOpen: boolean
  openTerminal: () => void
  closeTerminal: () => void
}

const TerminalContext = createContext<TerminalState | null>(null)

export function useTerminal(): TerminalState {
  const ctx = useContext(TerminalContext)
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider')
  return ctx
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openTerminal = useCallback(() => setIsOpen(true), [])
  const closeTerminal = useCallback(() => setIsOpen(false), [])

  return (
    <TerminalContext.Provider value={{ isOpen, openTerminal, closeTerminal }}>
      {children}
    </TerminalContext.Provider>
  )
}
