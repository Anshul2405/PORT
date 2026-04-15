'use client'

import { useRef, useState, useEffect, useCallback, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTerminal } from '@/lib/terminal-context'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  content: string | ReactNode
  color?: string
}

const PROMPT = 'anshul@portfolio:~$ '

const WELCOME_LINES: TerminalLine[] = [
  { id: 'w-1', type: 'system', content: 'Welcome to Anshul-OS v2.0', color: '#C9A84C' },
  { id: 'w-2', type: 'system', content: "Type 'help' for available commands.", color: '#6B6860' },
  { id: 'w-3', type: 'system', content: '' },
]

const NEOFETCH_ART = [
  '┌─────────────────────────────────┐',
  '│  ██████╗ ██████╗               │',
  '│  ██╔══██╗██╔══██╗              │',
  '│  ███████║██████╔╝              │',
  '│  ██╔══██║██╔══██╗              │',
  '│  ██║  ██║██║  ██║              │',
  '│  ╚═╝  ╚═╝╚═╝  ╚═╝              │',
  '└─────────────────────────────────┘',
]

interface SpecLine {
  label: string
  value: string
}

const NEOFETCH_SPECS: SpecLine[] = [
  { label: 'OS', value: 'Anshul-OS v2.0 (Dark Edition)' },
  { label: 'Host', value: 'ANSHUL RAIBOLE' },
  { label: 'Kernel', value: 'Full-Stack 5.0 + AI/ML Kernel' },
  { label: 'CPU', value: 'Intel i7-9750H (12 cores @ 2.60GHz)' },
  { label: 'GPU', value: 'NVIDIA GTX 1650 4GB VRAM' },
  { label: 'Memory', value: '16GB / 16GB (100% utilized lol)' },
  { label: 'Shell', value: 'zsh 5.9 + oh-my-zsh' },
  { label: 'Language', value: 'JLPT N3 Processing... ██████░░░░ 62%' },
  { label: 'Status', value: 'OPEN TO WORK → anshulraibole2003@gmail.com' },
]

function uid(): string {
  return crypto.randomUUID()
}

function parseCommand(raw: string, closeTerminal: () => void): TerminalLine[] {
  const cmd = raw.trim().toLowerCase()
  const lines: TerminalLine[] = []

  switch (cmd) {
    case 'neofetch': {
      NEOFETCH_ART.forEach((line) => {
        lines.push({ id: uid(), type: 'output', content: line, color: '#C9A84C' })
      })
      lines.push({ id: uid(), type: 'output', content: '' })
      NEOFETCH_SPECS.forEach((spec) => {
        lines.push({
          id: uid(),
          type: 'output',
          content: (
            <span>
              <span style={{ color: '#C9A84C', display: 'inline-block', width: '110px' }}>
                {spec.label}:
              </span>
              <span style={{ color: '#E8E6E0' }}>{spec.value}</span>
            </span>
          ),
        })
      })
      break
    }

    case 'help':
      lines.push({
        id: uid(),
        type: 'output',
        content: (
          <span>
            <span style={{ color: '#C9A84C' }}>Available commands:</span>
            {'\n'}help, neofetch, whoami, skills, contact, projects, sudo, clear, exit
          </span>
        ),
      })
      break

    case 'whoami':
      lines.push({
        id: uid(),
        type: 'output',
        content: 'Anshul Raibole — Full-Stack Engineer × AI & Data Science',
      })
      lines.push({
        id: uid(),
        type: 'output',
        content: 'Currently @ KCC Infra, Pune | Open to freelance & full-time',
      })
      break

    case 'skills':
      lines.push({
        id: uid(),
        type: 'output',
        content: (
          <span style={{ whiteSpace: 'pre' }}>
            <span style={{ color: '#C9A84C' }}>{'LANGUAGES  '}</span>→ C++, Python, JavaScript, SQL{'\n'}
            <span style={{ color: '#C9A84C' }}>{'AI/ML      '}</span>→ TensorFlow, PyTorch, LangChain{'\n'}
            <span style={{ color: '#C9A84C' }}>{'WEB        '}</span>→ React, Next.js, Node.js, Django{'\n'}
            <span style={{ color: '#C9A84C' }}>{'CLOUD      '}</span>→ AWS, Docker, Kubernetes
          </span>
        ),
      })
      break

    case 'contact':
      lines.push({
        id: uid(),
        type: 'output',
        content: (
          <span style={{ whiteSpace: 'pre' }}>
            <span style={{ color: '#C9A84C' }}>{'EMAIL    '}</span>→{' '}
            <a href="mailto:anshulraibole2003@gmail.com" style={{ color: '#E8E6E0', textDecoration: 'underline' }}>
              anshulraibole2003@gmail.com
            </a>{'\n'}
            <span style={{ color: '#C9A84C' }}>{'GITHUB   '}</span>→{' '}
            <a href="https://github.com/Anshul2405" target="_blank" rel="noopener noreferrer" style={{ color: '#E8E6E0', textDecoration: 'underline' }}>
              github.com/Anshul2405
            </a>{'\n'}
            <span style={{ color: '#C9A84C' }}>{'LINKEDIN '}</span>→{' '}
            <a href="https://linkedin.com/in/anshulraibole" target="_blank" rel="noopener noreferrer" style={{ color: '#E8E6E0', textDecoration: 'underline' }}>
              linkedin.com/in/anshulraibole
            </a>
          </span>
        ),
      })
      break

    case 'projects':
      lines.push({
        id: uid(),
        type: 'output',
        content: (
          <span style={{ whiteSpace: 'pre' }}>
            <span style={{ color: '#C9A84C' }}>Monozukuri</span>    → AI-powered development workflow platform{'\n'}
            <span style={{ color: '#C9A84C' }}>Darwin AI</span>     → Intelligent document analysis & extraction{'\n'}
            <span style={{ color: '#C9A84C' }}>Portfolio</span>      → This interactive developer portfolio
          </span>
        ),
      })
      break

    case 'sudo':
      lines.push({
        id: uid(),
        type: 'output',
        content: "Permission denied. (just kidding — type SUDO with your keyboard to unlock something... 👀)",
        color: '#00FF00',
      })
      break

    case 'clear':
      return []

    case 'exit':
      closeTerminal()
      return []

    default:
      if (cmd) {
        lines.push({
          id: uid(),
          type: 'error',
          content: `command not found: ${raw.trim()}. Type 'help' for available commands.`,
          color: 'var(--muted)',
        })
      }
      break
  }

  return lines
}

function Terminal() {
  const { closeTerminal } = useTerminal()
  const [output, setOutput] = useState<TerminalLine[]>([...WELCOME_LINES])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = useCallback(() => {
    if (!input.trim() && !input) return

    const inputLine: TerminalLine = {
      id: uid(),
      type: 'input',
      content: `${PROMPT}${input}`,
    }

    const cmd = input.trim().toLowerCase()

    if (cmd === 'clear') {
      setOutput([...WELCOME_LINES])
      setInput('')
      historyRef.current.push(input)
      historyIndexRef.current = -1
      return
    }

    const result = parseCommand(input, closeTerminal)

    if (cmd === 'exit') return

    historyRef.current.push(input)
    historyIndexRef.current = -1

    setOutput((prev) => [...prev, inputLine, ...result])
    setInput('')
  }, [input, closeTerminal])

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const history = historyRef.current
        if (history.length === 0) return
        const newIndex =
          historyIndexRef.current === -1
            ? history.length - 1
            : Math.max(0, historyIndexRef.current - 1)
        historyIndexRef.current = newIndex
        setInput(history[newIndex])
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const history = historyRef.current
        if (historyIndexRef.current === -1) return
        const newIndex = historyIndexRef.current + 1
        if (newIndex >= history.length) {
          historyIndexRef.current = -1
          setInput('')
        } else {
          historyIndexRef.current = newIndex
          setInput(history[newIndex])
        }
        return
      }
    },
    [handleSubmit]
  )

  const lineColor = (line: TerminalLine): string => {
    if (line.color) return line.color
    switch (line.type) {
      case 'input': return '#E8E6E0'
      case 'error': return '#FF5F57'
      case 'system': return '#6B6860'
      default: return '#E8E6E0'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 'min(720px, 90vw)',
        height: 'min(480px, 70vh)',
        background: 'rgba(13, 12, 11, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(201, 168, 76, 0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10001,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Window chrome */}
      <div
        style={{
          height: '32px',
          background: 'rgba(20, 18, 16, 0.95)',
          borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={closeTerminal}
          aria-label="Close terminal"
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FF5F57',
            border: 'none',
            cursor: 'pointer',
          }}
        />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28C840' }} />
        <span
          style={{
            marginLeft: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#6B6860',
          }}
        >
          anshul@portfolio: ~
        </span>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: '1.8',
        }}
      >
        {output.map((line) => (
          <div
            key={line.id}
            className="terminal-line-enter"
            style={{
              color: lineColor(line),
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              minHeight: line.content === '' ? '1.8em' : undefined,
            }}
          >
            {line.content}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid rgba(201, 168, 76, 0.1)',
          padding: '10px 16px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#C9A84C',
            whiteSpace: 'nowrap',
            marginRight: '4px',
          }}
        >
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F5F3EE',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            caretColor: '#C9A84C',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function TerminalOverlay() {
  const { isOpen, openTerminal, closeTerminal } = useTerminal()

  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        if (isOpen) closeTerminal()
        else openTerminal()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, openTerminal, closeTerminal])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="terminal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeTerminal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Terminal />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TerminalTrigger() {
  const { openTerminal } = useTerminal()

  return (
    <button
      type="button"
      data-cursor="link"
      onClick={openTerminal}
      title="Open terminal (Ctrl + `)"
      className="hidden rounded-full border border-[var(--border)] px-2.5 py-1 text-[9px] tracking-[0.2em] text-[var(--gold)] transition-colors hover:bg-[var(--gold-dim)] md:block"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {'>'}_
    </button>
  )
}
