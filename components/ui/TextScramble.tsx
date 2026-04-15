'use client'

import { useRef, useCallback, useState, useImperativeHandle, forwardRef, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01'

export interface TextScrambleHandle {
  trigger: () => void
}

interface TextScrambleProps {
  text: string
  speed?: number
  maxFrames?: number
  className?: string
  style?: React.CSSProperties
  as?: 'span' | 'div' | 'p'
  triggerOnHover?: boolean
}

const TextScramble = forwardRef<TextScrambleHandle, TextScrambleProps>(
  ({ text, speed = 40, maxFrames = 10, className, style, as: Tag = 'span', triggerOnHover = false }, ref) => {
    const [display, setDisplay] = useState(text)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const isAnimating = useRef(false)

    useEffect(() => {
      if (!isAnimating.current) setDisplay(text)
    }, [text])

    const trigger = useCallback(() => {
      if (isAnimating.current) return
      isAnimating.current = true
      let frame = 0

      intervalRef.current = setInterval(() => {
        frame++
        const progress = frame / (maxFrames / text.length)

        const scrambled = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < progress) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        setDisplay(scrambled)

        if (progress >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDisplay(text)
          isAnimating.current = false
        }
      }, speed)
    }, [text, speed, maxFrames])

    useImperativeHandle(ref, () => ({ trigger }), [trigger])

    useEffect(() => {
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, [])

    return (
      <Tag
        className={className}
        style={style}
        onMouseEnter={triggerOnHover ? trigger : undefined}
      >
        {display}
      </Tag>
    )
  }
)

TextScramble.displayName = 'TextScramble'
export default TextScramble
