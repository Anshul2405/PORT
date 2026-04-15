'use client'

import { useMemo } from 'react'
import MacOSMenuBar from './MacOSMenuBar'
import MacOSDock from '@/components/ui/mac-os-dock'
import NotionApp from './apps/NotionApp'
import FigmaApp from './apps/FigmaApp'
import VSCodeApp from './apps/VSCodeApp'
import TerminalApp from './apps/TerminalApp'
import ChromeApp from './apps/ChromeApp'
import SlackApp from './apps/SlackApp'

// SVG data URL icons — inline, zero network requests, never break
const svgIcon = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`

const ICON_VSCODE = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#007ACC"/><path d="M70 14L28 50 17 42v6l11 8-11 8v6l12-8 42-36 14 8v3L69 47 42 50l27 3 16-10v3l-14 8-42 36-12-8v6l11-8L70 86l17-8V22z" fill="#fff" fill-opacity=".3"/><path d="M70 14L28 50 17 58v-6l11-8-11-8v-6l12 8 42 36 14-8V22z" fill="#fff" fill-opacity=".5"/></svg>`
)

const ICON_TERMINAL = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#444"/><stop offset="1" stop-color="#1C1C1E"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(#t)"/><path d="M25 30l22 20-22 20" stroke="#4ade80" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M52 70h23" stroke="#4ade80" stroke-width="7" stroke-linecap="round"/></svg>`
)

const ICON_FIGMA = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#2C2C2C"/><circle cx="58" cy="50" r="12" fill="#1ABCFE"/><path d="M34 74a12 12 0 0112-12h12v12a12 12 0 11-24 0z" fill="#0ACF83"/><path d="M46 14h12a12 12 0 010 24H46z" fill="#FF7262"/><path d="M22 26a12 12 0 0112-12h12v24H34a12 12 0 01-12-12z" fill="#F24E1E"/><path d="M22 50a12 12 0 0112-12h12v24H34a12 12 0 01-12-12z" fill="#A259FF"/></svg>`
)

const ICON_CHROME = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#fff"/><circle cx="50" cy="50" r="36" fill="#fff"/><path d="M50 18a32 32 0 00-27.7 16l16 27.7A14 14 0 0150 36h32a32 32 0 00-32-18z" fill="#DB4437"/><path d="M22.3 34A32 32 0 0038 82l16-27.7A14 14 0 0136 50H4.3a32 32 0 0118-16z" fill="#0F9D58"/><path d="M62 82A32 32 0 0082 34H50a14 14 0 018 4.3L42 66a32 32 0 0020 16z" fill="#F4B400"/><circle cx="50" cy="50" r="14" fill="#4285F4"/><circle cx="50" cy="50" r="8" fill="#fff"/><circle cx="50" cy="50" r="6" fill="#4285F4"/></svg>`
)

const ICON_SLACK = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#fff"/><g transform="translate(15,15) scale(1.3)"><path d="M13 36a5 5 0 11-5-5h5z" fill="#E01E5A"/><path d="M16 36a5 5 0 1110 0v13a5 5 0 11-10 0z" fill="#E01E5A"/><path d="M21 13a5 5 0 115-5v5z" fill="#36C5F0"/><path d="M21 16a5 5 0 110 10H8a5 5 0 110-10z" fill="#36C5F0"/><path d="M44 21a5 5 0 115 5h-5z" fill="#2EB67D"/><path d="M41 21a5 5 0 11-10 0V8a5 5 0 1110 0z" fill="#2EB67D"/><path d="M36 44a5 5 0 11-5 5v-5z" fill="#ECB22E"/><path d="M36 41a5 5 0 110-10h13a5 5 0 110 10z" fill="#ECB22E"/></g></svg>`
)

const ICON_NOTION = svgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#fff"/><path d="M25 20l40-3c3 0 4 1 4 3v46c0 3-1 5-4 5L30 74c-4 0-6-2-6-5V25c0-4 2-6 6-5z" stroke="#000" stroke-width="3.5" fill="none"/><path d="M50 22v55" stroke="#000" stroke-width="3.5" stroke-linecap="round"/><path d="M30 28h10" stroke="#000" stroke-width="2.5" stroke-linecap="round"/><path d="M30 36h10" stroke="#000" stroke-width="2.5" stroke-linecap="round"/><path d="M68 18l10 8v48l-10-6" stroke="#000" stroke-width="3.5" fill="none" stroke-linejoin="round"/></svg>`
)

const DOCK_APPS = [
  { id: 'vscode', name: 'VS Code', icon: ICON_VSCODE },
  { id: 'terminal', name: 'Terminal', icon: ICON_TERMINAL },
  { id: 'figma', name: 'Figma', icon: ICON_FIGMA },
  { id: 'chrome', name: 'Chrome', icon: ICON_CHROME },
  { id: 'slack', name: 'Slack', icon: ICON_SLACK },
  { id: 'notion', name: 'Notion', icon: ICON_NOTION },
]

const OPEN_APPS_PER_STAGE: Record<number, string[]> = {
  0: ['notion'],
  1: ['figma'],
  2: ['vscode'],
  3: ['vscode', 'terminal'],
  4: ['terminal'],
  5: ['chrome'],
  6: ['chrome', 'slack'],
}

interface WindowState {
  visible: boolean
  zIndex: number
  left: string
  top: string
  width: string
  height: string
  background?: boolean
}

function getWindowStates(stage: number): Record<string, WindowState> {
  const hidden: WindowState = { visible: false, zIndex: 0, left: '0', top: '40px', width: '100%', height: 'calc(100% - 104px)' }
  const full: WindowState = { visible: true, zIndex: 10, left: '0', top: '40px', width: '100%', height: 'calc(100% - 104px)' }

  switch (stage) {
    case 0:
      return { notion: full, figma: hidden, vscode: hidden, terminal: hidden, chrome: hidden, slack: hidden }
    case 1:
      return { notion: hidden, figma: full, vscode: hidden, terminal: hidden, chrome: hidden, slack: hidden }
    case 2:
      return {
        notion: hidden,
        figma: { visible: true, zIndex: 5, left: '0', top: '40px', width: '100%', height: 'calc(100% - 104px)', background: true },
        vscode: full, terminal: hidden, chrome: hidden, slack: hidden,
      }
    case 3:
      return {
        notion: hidden, figma: hidden,
        vscode: { visible: true, zIndex: 10, left: '0', top: '40px', width: '55%', height: 'calc(100% - 104px)' },
        terminal: { visible: true, zIndex: 10, left: '55%', top: '40px', width: '45%', height: 'calc(100% - 104px)' },
        chrome: hidden, slack: hidden,
      }
    case 4:
      return { notion: hidden, figma: hidden, vscode: hidden, terminal: full, chrome: hidden, slack: hidden }
    case 5:
      return {
        notion: hidden, figma: hidden, vscode: hidden,
        terminal: { visible: true, zIndex: 5, left: '0', top: '40px', width: '100%', height: 'calc(100% - 104px)', background: true },
        chrome: full, slack: hidden,
      }
    case 6:
      return {
        notion: hidden, figma: hidden, vscode: hidden, terminal: hidden,
        chrome: { visible: true, zIndex: 10, left: '0', top: '40px', width: '50%', height: 'calc(100% - 104px)' },
        slack: { visible: true, zIndex: 10, left: '50%', top: '40px', width: '50%', height: 'calc(100% - 104px)' },
      }
    default:
      return { notion: full, figma: hidden, vscode: hidden, terminal: hidden, chrome: hidden, slack: hidden }
  }
}

function AppWindow({ state, children }: { state: WindowState; children: React.ReactNode }) {
  return (
    <div
      className="hib-app-window"
      style={{
        position: 'absolute',
        left: state.left,
        top: state.top,
        width: state.width,
        height: state.height,
        minHeight: 440,
        zIndex: state.zIndex,
        opacity: state.visible ? 1 : 0,
        transform: state.visible
          ? state.background ? 'scale(0.97)' : 'scale(1)'
          : 'scale(0.85) translateY(20px)',
        filter: state.background ? 'brightness(0.7)' : 'none',
        transition: 'opacity 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.35s ease',
        pointerEvents: state.visible && !state.background ? 'auto' : 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: state.background ? 8 : 0,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export default function MacOSDesktop({ activeStage }: { activeStage: number }) {
  const states = getWindowStates(activeStage)
  const openApps = useMemo(() => OPEN_APPS_PER_STAGE[activeStage] ?? [], [activeStage])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 900,
      aspectRatio: '16 / 10',
      minHeight: 540,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
      background: 'radial-gradient(ellipse at 30% 40%, #1a1a2e 0%, #0a0a0f 60%, #050508 100%)',
    }}>
      {/* Dot grid wallpaper */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      <MacOSMenuBar activeStage={activeStage} />

      {/* App windows */}
      <AppWindow state={states.notion}>
        <NotionApp isActive={activeStage === 0} />
      </AppWindow>
      <AppWindow state={states.figma}>
        <FigmaApp isActive={activeStage === 1} />
      </AppWindow>
      <AppWindow state={states.vscode}>
        <VSCodeApp isActive={activeStage === 2 || activeStage === 3} variant={activeStage <= 2 ? 'design' : 'dev'} />
      </AppWindow>
      <AppWindow state={states.terminal}>
        <TerminalApp isActive={activeStage === 3 || activeStage === 4} variant={activeStage <= 3 ? 'dev' : 'test'} />
      </AppWindow>
      <AppWindow state={states.chrome}>
        <ChromeApp isActive={activeStage === 5 || activeStage === 6} />
      </AppWindow>
      <AppWindow state={states.slack}>
        <SlackApp isActive={activeStage === 6} />
      </AppWindow>

      {/* macOS Dock — cosine magnification */}
      <div style={{
        position: 'absolute',
        bottom: 6,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}>
        <MacOSDock
          apps={DOCK_APPS}
          onAppClick={() => {}}
          openApps={openApps}
          sizeOverride={{ baseIconSize: 36, maxScale: 1.5, effectWidth: 180 }}
        />
      </div>
    </div>
  )
}
