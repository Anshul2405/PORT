'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const TAGS = ['React', 'Python', 'AWS', 'Three.js', 'N3 日本語', 'Docker']

export default function SkillsPhysicsPlayground() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const w = Math.max(320, wrap.clientWidth)
    const h = 300
    const thick = 24

    const engine = Matter.Engine.create()
    engine.world.gravity.y = 0.85
    const { world } = engine

    const wallOpts = { isStatic: true, render: { visible: false } }
    const floor = Matter.Bodies.rectangle(w / 2, h - thick / 2, w, thick, wallOpts)
    const left = Matter.Bodies.rectangle(-thick / 2, h / 2, thick, h * 2, wallOpts)
    const right = Matter.Bodies.rectangle(w + thick / 2, h / 2, thick, h * 2, wallOpts)
    const ceiling = Matter.Bodies.rectangle(w / 2, -thick / 2, w, thick, wallOpts)

    const bodies = TAGS.map((label, i) => {
      const body = Matter.Bodies.rectangle(60 + (i % 3) * 100, 50 + Math.floor(i / 3) * 50, 96, 40, {
        restitution: 0.35,
        friction: 0.08,
        frictionAir: 0.02,
        chamfer: { radius: 6 },
        label,
      })
      return body
    })

    Matter.World.add(world, [floor, left, right, ceiling, ...bodies])

    const mouse = Matter.Mouse.create(wrap)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.28, damping: 0.08, render: { visible: false } },
    })
    Matter.World.add(world, mouseConstraint)

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    const sync = () => {
      bodies.forEach((b, i) => {
        const el = labelRefs.current[i]
        if (el) {
          el.style.left = `${b.position.x}px`
          el.style.top = `${b.position.y}px`
          el.style.transform = `translate(-50%, -50%) rotate(${b.angle}rad)`
        }
      })
    }

    Matter.Events.on(engine, 'afterUpdate', sync)

    return () => {
      Matter.Events.off(engine, 'afterUpdate', sync)
      Matter.Runner.stop(runner)
      Matter.World.clear(world, false)
      Matter.Engine.clear(engine)
    }
  }, [])

  return (
    <div className="mt-14 w-full">
      <p
        className="mb-4 text-[10px] tracking-[0.28em] text-[var(--gold)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        DRAG SKILLS — MATTER.JS
      </p>
      <div
        ref={wrapRef}
        className="relative w-full cursor-grab overflow-hidden rounded-[20px] border border-[var(--border)] bg-[rgba(200,169,110,0.04)] active:cursor-grabbing"
        style={{ height: 300, touchAction: 'none' }}
      >
        {TAGS.map((tag, i) => (
          <div
            key={tag}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="pointer-events-none absolute whitespace-nowrap rounded-full border border-[var(--gold)] bg-[rgba(10,10,10,0.92)] px-3 py-2 text-[10px] tracking-[0.08em] text-[var(--white)] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            style={{
              fontFamily: 'var(--font-mono)',
              left: 0,
              top: 0,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}
