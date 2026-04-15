'use client'

import { useEffect, useState } from 'react'

const MARQUEE_TEXT =
  'FULLSTACK ENGINEER  ✦  PROJECT LEAD  ✦  GENERATIVE AI  ✦  DIGITAL TWIN  ✦  JAPANESE N3  ✦  MONOZUKURI  ✦  PUNE, INDIA  ✦  AI & DATA SCIENCE  ✦  '

const MARQUEE_ITEMS = MARQUEE_TEXT.split('  ✦  ').filter(Boolean)

const GITHUB_USER = 'Anshul2405'

function MarqueeContent({ extra, lane }: { extra: string | null; lane: number }) {
  const items = extra ? [...MARQUEE_ITEMS, extra] : MARQUEE_ITEMS
  return (
    <>
      {items.map((item, i) => (
        <span key={`lane-${lane}-${item}-${i}`}>
          {i > 0 && '  ✦  '}
          <span
            className="marquee-word inline-block origin-center px-1 transition-transform duration-200 hover:scale-110"
            style={{ letterSpacing: '0.08em' }}
          >
            {item}
          </span>
        </span>
      ))}
      {'  ✦  '}
    </>
  )
}

export default function Marquee() {
  const [githubLine, setGithubLine] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=8`, {
          headers: { Accept: 'application/vnd.github+json' },
        })
        if (!res.ok) return
        const events = (await res.json()) as { type: string; repo?: { name: string }; payload?: { commits?: unknown[] } }[]
        if (cancelled || !Array.isArray(events)) return
        const push = events.find((e) => e.type === 'PushEvent' && e.repo?.name)
        if (push?.repo?.name) {
          const commits = Array.isArray(push.payload?.commits) ? push.payload!.commits!.length : 1
          setGithubLine(`GITHUB LIVE  ✦  ${push.repo.name.toUpperCase()}  ✦  ${commits} COMMIT${commits > 1 ? 'S' : ''}`)
          return
        }
        const prof = await fetch(`https://api.github.com/users/${GITHUB_USER}`)
        if (!prof.ok) return
        const data = (await prof.json()) as { public_repos?: number }
        if (!cancelled && typeof data.public_repos === 'number') {
          setGithubLine(`GITHUB  ✦  ${data.public_repos} PUBLIC REPOS  ✦  @${GITHUB_USER.toUpperCase()}`)
        }
      } catch {
        /* ignore */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="marquee"
      aria-hidden="true"
      className="marquee-section flex h-14 w-full items-center overflow-hidden border-y border-[var(--border)] bg-[rgba(200,169,110,0.03)]"
      style={{ height: '56px' }}
    >
      <div
        className="marquee-track flex w-max shrink-0 items-center whitespace-nowrap px-4 text-[12px] font-bold uppercase text-[var(--gold)]"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em' }}
      >
        <MarqueeContent extra={githubLine} lane={0} />
        <MarqueeContent extra={githubLine} lane={1} />
      </div>
    </section>
  )
}
