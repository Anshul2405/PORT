'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  phrases: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
  style?: React.CSSProperties
  cursorColor?: string
}

export default function Typewriter({
  phrases,
  typeSpeed = 60,
  deleteSpeed = 30,
  pauseTime = 2000,
  className,
  style,
  cursorColor = '#C9A84C',
}: TypewriterProps) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    if (isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
    }

    if (isDeleting) {
      if (text.length === 0) {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
        return
      }
      timeoutRef.current = setTimeout(() => {
        setText(text.slice(0, -1))
      }, deleteSpeed)
    } else {
      if (text.length === currentPhrase.length) {
        setIsPaused(true)
        return
      }
      timeoutRef.current = setTimeout(() => {
        setText(currentPhrase.slice(0, text.length + 1))
      }, typeSpeed)
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [text, phraseIndex, isDeleting, isPaused, phrases, typeSpeed, deleteSpeed, pauseTime])

  return (
    <span className={className} style={style}>
      {text}
      <span
        style={{
          color: cursorColor,
          animation: 'typewriterBlink 0.53s steps(1) infinite',
          marginLeft: '1px',
          fontWeight: 300,
        }}
      >
        |
      </span>
    </span>
  )
}
