'use client'

import { useEffect, useState } from 'react'

interface VSCodeAppProps {
  isActive: boolean
  variant: 'design' | 'dev'
}

interface CodeLine {
  tokens: { text: string; color: string }[]
}

const CSS_CODE: CodeLine[] = [
  { tokens: [{ text: ':root {', color: '#D4D4D4' }] },
  { tokens: [{ text: '  /* Color Tokens */', color: '#6A9955' }] },
  { tokens: [{ text: '  --bg-primary:', color: '#9CDCFE' }, { text: '    #0D0C0B', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --bg-secondary:', color: '#9CDCFE' }, { text: '  #111009', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --gold:', color: '#9CDCFE' }, { text: '          #C9A84C', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --gold-light:', color: '#9CDCFE' }, { text: '    #E8C97A', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-primary:', color: '#9CDCFE' }, { text: '  #F5F3EE', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-muted:', color: '#9CDCFE' }, { text: '    #6B6860', color: '#CE9178' }, { text: ';', color: '#D4D4D4' }] },
  { tokens: [{ text: '', color: 'transparent' }] },
  { tokens: [{ text: '  /* Typography Scale */', color: '#6A9955' }] },
  { tokens: [{ text: '  --text-xs:', color: '#9CDCFE' }, { text: '   ', color: 'transparent' }, { text: '11', color: '#B5CEA8' }, { text: 'px;', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-sm:', color: '#9CDCFE' }, { text: '   ', color: 'transparent' }, { text: '13', color: '#B5CEA8' }, { text: 'px;', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-base:', color: '#9CDCFE' }, { text: ' ', color: 'transparent' }, { text: '16', color: '#B5CEA8' }, { text: 'px;', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-lg:', color: '#9CDCFE' }, { text: '   ', color: 'transparent' }, { text: '20', color: '#B5CEA8' }, { text: 'px;', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-xl:', color: '#9CDCFE' }, { text: '   clamp(', color: '#D4D4D4' }, { text: '2', color: '#B5CEA8' }, { text: 'rem, ', color: '#D4D4D4' }, { text: '4', color: '#B5CEA8' }, { text: 'vw, ', color: '#D4D4D4' }, { text: '3.5', color: '#B5CEA8' }, { text: 'rem);', color: '#D4D4D4' }] },
  { tokens: [{ text: '  --text-hero:', color: '#9CDCFE' }, { text: ' clamp(', color: '#D4D4D4' }, { text: '4', color: '#B5CEA8' }, { text: 'rem, ', color: '#D4D4D4' }, { text: '10', color: '#B5CEA8' }, { text: 'vw, ', color: '#D4D4D4' }, { text: '9', color: '#B5CEA8' }, { text: 'rem);', color: '#D4D4D4' }] },
  { tokens: [{ text: '', color: 'transparent' }] },
  { tokens: [{ text: '  /* Spacing */', color: '#6A9955' }] },
  { tokens: [{ text: '  --space-section:', color: '#9CDCFE' }, { text: ' ', color: 'transparent' }, { text: '120', color: '#B5CEA8' }, { text: 'px;', color: '#D4D4D4' }] },
  { tokens: [{ text: '}', color: '#D4D4D4' }] },
]

const TS_STATIC: CodeLine[] = [
  { tokens: [{ text: 'import', color: '#C586C0' }, { text: ' { useEffect, useRef } ', color: '#D4D4D4' }, { text: 'from', color: '#C586C0' }, { text: " 'react'", color: '#CE9178' }] },
  { tokens: [{ text: 'import', color: '#C586C0' }, { text: ' { gsap } ', color: '#D4D4D4' }, { text: 'from', color: '#C586C0' }, { text: " 'gsap'", color: '#CE9178' }] },
  { tokens: [{ text: '', color: 'transparent' }] },
  { tokens: [{ text: 'interface', color: '#C586C0' }, { text: ' Props', color: '#4EC9B0' }, { text: ' {', color: '#D4D4D4' }] },
  { tokens: [{ text: '  stage', color: '#9CDCFE' }, { text: ': ', color: '#D4D4D4' }, { text: 'number', color: '#4EC9B0' }] },
  { tokens: [{ text: '  isActive', color: '#9CDCFE' }, { text: ': ', color: '#D4D4D4' }, { text: 'boolean', color: '#4EC9B0' }] },
  { tokens: [{ text: '}', color: '#D4D4D4' }] },
  { tokens: [{ text: '', color: 'transparent' }] },
  { tokens: [{ text: 'export const', color: '#C586C0' }, { text: ' StageScene', color: '#DCDCAA' }, { text: ' = ({', color: '#D4D4D4' }] },
  { tokens: [{ text: '  stage,', color: '#9CDCFE' }] },
  { tokens: [{ text: '  isActive', color: '#9CDCFE' }] },
  { tokens: [{ text: '}: ', color: '#D4D4D4' }, { text: 'Props', color: '#4EC9B0' }, { text: ') => {', color: '#D4D4D4' }] },
  { tokens: [{ text: '  const', color: '#C586C0' }, { text: ' ref = ', color: '#D4D4D4' }, { text: 'useRef', color: '#DCDCAA' }, { text: '<HTMLDivElement>(', color: '#4EC9B0' }, { text: 'null', color: '#569CD6' }, { text: ')', color: '#D4D4D4' }] },
  { tokens: [{ text: '', color: 'transparent' }] },
  { tokens: [{ text: '  ', color: 'transparent' }, { text: 'useEffect', color: '#DCDCAA' }, { text: '(() => {', color: '#D4D4D4' }] },
]

const TS_TYPING: CodeLine[] = [
  { tokens: [{ text: '    if', color: '#C586C0' }, { text: ' (!isActive) ', color: '#D4D4D4' }, { text: 'return', color: '#C586C0' }] },
  { tokens: [{ text: '    gsap.', color: '#D4D4D4' }, { text: 'fromTo', color: '#DCDCAA' }, { text: '(ref.current,', color: '#D4D4D4' }] },
  { tokens: [{ text: '      { opacity: ', color: '#D4D4D4' }, { text: '0', color: '#B5CEA8' }, { text: ', y: ', color: '#D4D4D4' }, { text: '20', color: '#B5CEA8' }, { text: ' },', color: '#D4D4D4' }] },
  { tokens: [{ text: '      { opacity: ', color: '#D4D4D4' }, { text: '1', color: '#B5CEA8' }, { text: ', y: ', color: '#D4D4D4' }, { text: '0', color: '#B5CEA8' }, { text: ' }', color: '#D4D4D4' }] },
  { tokens: [{ text: '    )', color: '#D4D4D4' }] },
]

const FILE_TREE_CSS = [
  { name: 'PORTFOLIO', indent: 0, open: true },
  { name: 'styles', indent: 1, open: true },
  { name: 'tokens.css', indent: 2, selected: true },
  { name: 'globals.css', indent: 2 },
  { name: 'components.css', indent: 2 },
  { name: 'components', indent: 1, open: false },
]

const FILE_TREE_TS = [
  { name: 'PORTFOLIO', indent: 0, open: true },
  { name: 'components', indent: 1, open: true },
  { name: 'Hero.tsx', indent: 2 },
  { name: 'HowIBuild.tsx', indent: 2, selected: true },
  { name: 'About.tsx', indent: 2 },
  { name: 'styles', indent: 1, open: false },
]

const ACTIVITY_ICONS = [
  { label: 'Files', active: true },
  { label: 'Search', active: false },
  { label: 'Git', active: false },
  { label: 'Ext', active: false },
]

export default function VSCodeApp({ isActive, variant }: VSCodeAppProps) {
  const isDesign = variant === 'design'
  const code = isDesign ? CSS_CODE : TS_STATIC
  const fileTree = isDesign ? FILE_TREE_CSS : FILE_TREE_TS
  const tabName = isDesign ? 'tokens.css' : 'HowIBuild.tsx'

  const [visibleLines, setVisibleLines] = useState(0)
  const [typingVisible, setTypingVisible] = useState(0)

  useEffect(() => {
    if (!isActive) { setVisibleLines(0); setTypingVisible(0); return }
    const timers: ReturnType<typeof setTimeout>[] = []
    if (isDesign) {
      code.forEach((_, i) => {
        timers.push(setTimeout(() => setVisibleLines(i + 1), 40 * (i + 1)))
      })
    } else {
      setVisibleLines(TS_STATIC.length)
      TS_TYPING.forEach((_, i) => {
        timers.push(setTimeout(() => setTypingVisible(i + 1), 300 + i * 150))
      })
    }
    return () => timers.forEach(clearTimeout)
  }, [isActive, isDesign, code])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#1E1E1E' }}>
      {/* Title bar */}
      <div style={{
        height: 36,
        background: '#1E1E1E',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #111',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6, padding: '0 12px', alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{
          marginLeft: 24,
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#252526',
          borderTop: '2px solid #007ACC',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'rgba(255,255,255,0.8)',
          gap: 6,
        }}>
          {tabName} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>×</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Activity bar */}
        <div style={{
          width: 42,
          background: '#333333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          gap: 16,
          flexShrink: 0,
        }}>
          {ACTIVITY_ICONS.map((icon) => (
            <div key={icon.label} style={{
              width: 24,
              height: 24,
              borderRadius: 3,
              background: icon.active ? 'rgba(255,255,255,0.15)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: icon.active ? 'white' : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              borderLeft: icon.active ? '2px solid white' : '2px solid transparent',
            }}>
              {icon.label.charAt(0)}
            </div>
          ))}
        </div>

        {/* Explorer */}
        <div style={{
          width: 170,
          background: '#252526',
          borderRight: '1px solid #1E1E1E',
          padding: '8px 0',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '0 12px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}>
            EXPLORER
          </div>
          {fileTree.map((f, i) => (
            <div key={i} style={{
              padding: '2px 12px',
              paddingLeft: 12 + f.indent * 12,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: (f as { selected?: boolean }).selected ? 'white' : 'rgba(255,255,255,0.6)',
              background: (f as { selected?: boolean }).selected ? 'rgba(255,255,255,0.08)' : 'transparent',
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              cursor: 'default',
            }}>
              {(f as { open?: boolean }).open !== undefined && (
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>
                  {(f as { open?: boolean }).open ? '▼' : '▶'}
                </span>
              )}
              {f.name}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={{ flex: 1, background: '#1E1E1E', display: 'flex', overflow: 'hidden' }}>
          {/* Line numbers */}
          <div style={{ padding: '8px 0', width: 36, textAlign: 'right', flexShrink: 0 }}>
            {code.map((_, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: '20px',
                color: 'rgba(255,255,255,0.2)',
                paddingRight: 10,
                opacity: i < visibleLines ? 1 : 0,
                transition: 'opacity 0.1s ease',
              }}>
                {i + 1}
              </div>
            ))}
            {!isDesign && TS_TYPING.map((_, i) => (
              <div key={`t${i}`} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: '20px',
                color: 'rgba(255,255,255,0.2)',
                paddingRight: 10,
                opacity: i < typingVisible ? 1 : 0,
                transition: 'opacity 0.1s ease',
              }}>
                {TS_STATIC.length + i + 1}
              </div>
            ))}
          </div>

          {/* Code + git gutter */}
          <div style={{ flex: 1, padding: '8px 8px 8px 0', overflow: 'hidden', position: 'relative' }}>
            {code.map((line, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: '20px',
                whiteSpace: 'pre',
                opacity: i < visibleLines ? 1 : 0,
                transition: 'opacity 0.1s ease',
                display: 'flex',
              }}>
                {!isDesign && (
                  <span style={{
                    width: 3,
                    marginRight: 6,
                    background: '#4EC9B0',
                    borderRadius: 1,
                    flexShrink: 0,
                    opacity: 0.6,
                  }} />
                )}
                <span>
                  {line.tokens.map((t, ti) => (
                    <span key={ti} style={{ color: t.color }}>{t.text}</span>
                  ))}
                </span>
              </div>
            ))}
            {!isDesign && TS_TYPING.map((line, i) => (
              <div key={`t${i}`} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                lineHeight: '20px',
                whiteSpace: 'pre',
                opacity: i < typingVisible ? 1 : 0,
                transition: 'opacity 0.15s ease',
                display: 'flex',
              }}>
                <span style={{
                  width: 3,
                  marginRight: 6,
                  background: '#4EC9B0',
                  borderRadius: 1,
                  flexShrink: 0,
                  opacity: 0.6,
                }} />
                <span>
                  {line.tokens.map((t, ti) => (
                    <span key={ti} style={{ color: t.color }}>{t.text}</span>
                  ))}
                </span>
              </div>
            ))}
            {/* Blinking cursor */}
            {isDesign && visibleLines >= code.length && (
              <span className="hib-blink-cursor" style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#007ACC',
                position: 'absolute',
                bottom: 8,
              }}>
                |
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        height: 22,
        background: '#007ACC',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 16,
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: 'white',
        flexShrink: 0,
      }}>
        <span>⎇ main</span>
        <span>0 errors</span>
        <span style={{ marginLeft: 'auto' }}>{isDesign ? 'CSS' : 'TypeScript'}</span>
      </div>
    </div>
  )
}
