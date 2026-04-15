"use client"

import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Component = () => {
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [capsLock, setCapsLock] = useState(false)
  const [shift, setShift] = useState(false)
  const [numLock, setNumLock] = useState(true)
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const normalize = (key: string) => {
      if (key === ' ') return 'Space'
      if (key === 'Control') return 'Ctrl'
      if (key === 'Meta') return 'Meta'
      if (key === 'Alt') return 'Alt'
      if (key === 'Shift') return 'Shift'
      if (key === 'Tab') return 'Tab'
      if (key === 'Enter') return 'Enter'
      if (key === 'Backspace') return 'Backspace'
      if (key === 'CapsLock') return 'CapsLock'
      if (key === 'ContextMenu') return 'ContextMenu'
      return key.length === 1 ? key.toLowerCase() : key
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(normalize(e.key))
      if (e.key === 'CapsLock') setCapsLock((prev) => !prev)
      if (e.key === 'Shift') setShift(true)
      if (e.key === 'NumLock') setNumLock((prev) => !prev)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const released = normalize(e.key)
      setPressedKey((current) => (current === released ? null : current))
      if (e.key === 'Shift') setShift(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleKeyPress = (key: string) => {
    setPressedKey(key)
    setTimeout(() => setPressedKey(null), 150)

    if (key === 'CapsLock') {
      setCapsLock(!capsLock)
    } else if (key === 'Shift') {
      setShift(!shift)
    } else if (key === 'NumLock') {
      setNumLock(!numLock)
    } else {
      if (shift) setShift(false)
    }
  }

  const getKeyDisplay = (key: string, shiftSymbol?: string) => {
    if (key.length === 1 && key.match(/[a-z]/)) {
      return capsLock || shift ? key.toUpperCase() : key
    }
    return shift && shiftSymbol ? shiftSymbol : key
  }

  const isCompact = windowWidth < 768

  const KeyButton = ({
    children,
    keyId,
    subLabel,
    className = '',
    variant = 'outline' as const,
    onClick,
    isActive = false,
    widthUnits = 1,
  }: {
    children: React.ReactNode
    keyId: string
    subLabel?: React.ReactNode
    className?: string
    variant?: 'outline' | 'secondary' | 'default'
    onClick?: () => void
    isActive?: boolean
    widthUnits?: number
  }) => {
    const unit = isCompact ? 28 : 40
    const gap = 4
    const isPressed = pressedKey === keyId
    const width = unit * widthUnits + (widthUnits - 1) * gap

    return (
      <Button
        variant={isActive ? 'default' : variant}
        className={`relative flex ${isCompact ? 'h-9 text-[10px]' : 'h-11 text-[11px]'} flex-col items-center justify-center border border-white/18 bg-[#12151a] font-mono text-white transition-all duration-100 hover:bg-[#161a20] ${isPressed ? 'scale-[0.95] bg-[#1f242c] shadow-inner shadow-black/70' : 'shadow-[0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.35)]'} ${className}`}
        style={{ width }}
        onClick={onClick}
      >
        {subLabel && (
          <span className={`absolute left-1.5 top-0.5 ${isCompact ? 'text-[8px]' : 'text-[9px]'} text-white/55`}>
            {subLabel}
          </span>
        )}
        {children}
      </Button>
    )
  }

  const numberRow = [
    { key: '`', shiftSymbol: '~' },
    { key: '1', shiftSymbol: '!' },
    { key: '2', shiftSymbol: '@' },
    { key: '3', shiftSymbol: '#' },
    { key: '4', shiftSymbol: '$' },
    { key: '5', shiftSymbol: '%' },
    { key: '6', shiftSymbol: '^' },
    { key: '7', shiftSymbol: '&' },
    { key: '8', shiftSymbol: '*' },
    { key: '9', shiftSymbol: '(' },
    { key: '0', shiftSymbol: ')' },
    { key: '-', shiftSymbol: '_' },
    { key: '=', shiftSymbol: '+' },
  ]

  const topRow = [
    { key: 'q' },
    { key: 'w' },
    { key: 'e' },
    { key: 'r' },
    { key: 't' },
    { key: 'y' },
    { key: 'u' },
    { key: 'i' },
    { key: 'o' },
    { key: 'p' },
    { key: '[', shiftSymbol: '{' },
    { key: ']', shiftSymbol: '}' },
    { key: '\\', shiftSymbol: '|' },
  ]

  const middleRow = [
    { key: 'a' },
    { key: 's' },
    { key: 'd' },
    { key: 'f' },
    { key: 'g' },
    { key: 'h' },
    { key: 'j' },
    { key: 'k' },
    { key: 'l' },
    { key: ';', shiftSymbol: ':' },
    { key: "'", shiftSymbol: '"' },
  ]

  const bottomRow = [
    { key: 'z' },
    { key: 'x' },
    { key: 'c' },
    { key: 'v' },
    { key: 'b' },
    { key: 'n' },
    { key: 'm' },
    { key: ',', shiftSymbol: '<' },
    { key: '.', shiftSymbol: '>' },
    { key: '/', shiftSymbol: '?' },
  ]
  return (
    <div className="w-full overflow-x-auto">
      <div className={`mx-auto w-fit rounded-xl border border-white/10 bg-[#0b0d11]/85 ${isCompact ? 'p-2' : 'p-3'}`}>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {numberRow.map((item) => (
              <KeyButton
                key={item.key}
                keyId={item.key}
                onClick={() => handleKeyPress(item.key)}
                subLabel={item.shiftSymbol}
              >
                {getKeyDisplay(item.key, item.shiftSymbol)}
              </KeyButton>
            ))}
            <KeyButton keyId="Backspace" onClick={() => handleKeyPress('Backspace')} widthUnits={2}>
              ⌫
            </KeyButton>
          </div>

          <div className="flex gap-1">
            <KeyButton keyId="Tab" widthUnits={1.6} onClick={() => handleKeyPress('Tab')}>
              Tab
            </KeyButton>
            {topRow.map((item) => (
              <KeyButton
                key={item.key}
                keyId={item.key}
                onClick={() => handleKeyPress(item.key)}
                subLabel={item.shiftSymbol}
              >
                {getKeyDisplay(item.key, item.shiftSymbol)}
              </KeyButton>
            ))}
          </div>

          <div className="flex gap-1">
            <KeyButton
              keyId="CapsLock"
              widthUnits={1.95}
              onClick={() => handleKeyPress('CapsLock')}
              isActive={capsLock}
            >
              Caps
            </KeyButton>
            {middleRow.map((item) => (
              <KeyButton
                key={item.key}
                keyId={item.key}
                onClick={() => handleKeyPress(item.key)}
                subLabel={item.shiftSymbol}
              >
                {getKeyDisplay(item.key, item.shiftSymbol)}
              </KeyButton>
            ))}
            <KeyButton keyId="Enter" widthUnits={2.05} onClick={() => handleKeyPress('Enter')}>
              Enter
            </KeyButton>
          </div>

          <div className="flex gap-1">
            <KeyButton
              keyId="Shift"
              widthUnits={2.2}
              onClick={() => handleKeyPress('Shift')}
              isActive={shift}
            >
              Shift
            </KeyButton>
            {bottomRow.map((item) => (
              <KeyButton
                key={item.key}
                keyId={item.key}
                onClick={() => handleKeyPress(item.key)}
                subLabel={item.shiftSymbol}
              >
                {getKeyDisplay(item.key, item.shiftSymbol)}
              </KeyButton>
            ))}
            <KeyButton
              keyId="Shift"
              widthUnits={2.2}
              onClick={() => handleKeyPress('Shift')}
              isActive={shift}
            >
              Shift
            </KeyButton>
          </div>

          <div className="flex gap-1">
            <KeyButton keyId="Ctrl" widthUnits={1.4} onClick={() => handleKeyPress('Control')}>
              Ctrl
            </KeyButton>
            <KeyButton keyId="Meta" widthUnits={1.4} onClick={() => handleKeyPress('Meta')}>
              ⊞
            </KeyButton>
            <KeyButton keyId="Alt" widthUnits={1.4} onClick={() => handleKeyPress('Alt')}>
              Alt
            </KeyButton>
            <KeyButton keyId="Space" widthUnits={5.8} onClick={() => handleKeyPress(' ')}>
              {' '}
            </KeyButton>
            <KeyButton keyId="Alt" widthUnits={1.4} onClick={() => handleKeyPress('Alt')}>
              Alt
            </KeyButton>
            <KeyButton keyId="ContextMenu" widthUnits={1.4} onClick={() => handleKeyPress('ContextMenu')}>
              ☰
            </KeyButton>
            <KeyButton keyId="Ctrl" widthUnits={1.4} onClick={() => handleKeyPress('Control')}>
              Ctrl
            </KeyButton>
          </div>
        </div>
      </div>
    </div>
  )
}
