'use client'

import type { RefObject } from 'react'
import { useLayoutEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function useTextScramble(ref: RefObject<HTMLElement | null>, text: string) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    let interval: number | null = null

    const render = () => {
      let frame = 0
      element.textContent = text

      interval = window.setInterval(() => {
        const progress = frame / 2
        element.textContent = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < progress) return text[index]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        frame += 1

        if (progress >= text.length) {
          if (interval) window.clearInterval(interval)
          element.textContent = text
        }
      }, 30)
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: render,
    })

    return () => {
      if (interval) window.clearInterval(interval)
      trigger.kill()
      element.textContent = text
    }
  }, [ref, text])
}
