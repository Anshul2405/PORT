import { HOW_I_BUILD_STAGES } from '@/lib/how-i-build-stages'

export const SCREEN_W = 1600
export const SCREEN_H = 1000
export const TEX_SCALE = 2

const W = SCREEN_W
const H = SCREEN_H

/** Matches the floating MacBook preview to the active How I build stage (same copy as the section). */
function drawHowIBuildStageRibbon(ctx: CanvasRenderingContext2D, stageIndex: number) {
  const meta = HOW_I_BUILD_STAGES[stageIndex]
  if (!meta) return
  const pillW = Math.min(420, W - 72)
  const x = W - pillW - 36
  const y = 74
  ctx.save()
  roundRect(ctx, x, y, pillW, 54, 10)
  ctx.fillStyle = 'rgba(8,8,8,0.94)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201,168,76,0.45)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = '#C9A84C'
  ctx.font = 'bold 10px ui-monospace, JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(meta.label, x + 14, y + 22)
  ctx.fillStyle = 'rgba(238,238,232,0.92)'
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, sans-serif'
  const title =
    meta.title.length > 82 ? `${meta.title.slice(0, 79)}…` : meta.title
  ctx.fillText(title, x + 14, y + 42)
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

/* ═══════════  Dock Icons  ═══════════ */

function drawDockIcon_Finder(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  const g = ctx.createLinearGradient(x, y, x, y + s)
  g.addColorStop(0, '#6DC5FB'); g.addColorStop(1, '#1B9CFC')
  ctx.fillStyle = g; ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${s * 0.55}px -apple-system`
  ctx.textAlign = 'center'
  ctx.fillText('☺', x + s / 2, y + s * 0.66)
}

function drawDockIcon_VSCode(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  const g = ctx.createLinearGradient(x, y, x + s, y + s)
  g.addColorStop(0, '#2BA1F1'); g.addColorStop(1, '#0065A9')
  ctx.fillStyle = g; ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y + s * 0.25)
  ctx.lineTo(x + s * 0.65, y + s * 0.12)
  ctx.lineTo(x + s * 0.65, y + s * 0.88)
  ctx.lineTo(x + s * 0.3, y + s * 0.75)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y + s * 0.25)
  ctx.lineTo(x + s * 0.55, y + s * 0.5)
  ctx.lineTo(x + s * 0.3, y + s * 0.75)
  ctx.stroke()
}

function drawDockIcon_Terminal(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  ctx.fillStyle = '#1C1C1E'; ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.strokeStyle = '#28c940'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x + s * 0.22, y + s * 0.30)
  ctx.lineTo(x + s * 0.48, y + s * 0.50)
  ctx.lineTo(x + s * 0.22, y + s * 0.70)
  ctx.stroke()
  ctx.strokeStyle = '#28c940'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x + s * 0.52, y + s * 0.72)
  ctx.lineTo(x + s * 0.78, y + s * 0.72)
  ctx.stroke()
}

function drawDockIcon_Figma(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  ctx.fillStyle = '#2C2C2C'; ctx.fill()
  const cs = s * 0.16, cx = x + s / 2, cy = y + s / 2
  const colors = ['#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83']
  const positions: [number, number][] = [
    [cx - cs, cy - cs], [cx + cs, cy - cs],
    [cx - cs, cy], [cx + cs, cy],
    [cx - cs, cy + cs],
  ]
  positions.forEach(([px, py], i) => {
    ctx.beginPath(); ctx.arc(px, py, cs * 0.85, 0, Math.PI * 2)
    ctx.fillStyle = colors[i]; ctx.fill()
  })
}

function drawDockIcon_Chrome(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  ctx.fillStyle = '#ffffff'; ctx.fill()
  const cx = x + s / 2, cy = y + s / 2, r = s * 0.36
  const slices = [
    { start: -0.5, end: 0.5, color: '#EA4335' },
    { start: 0.5, end: 1.5, color: '#FBBC04' },
    { start: 1.5, end: 2.5, color: '#34A853' },
  ]
  slices.forEach(sl => {
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, sl.start * Math.PI / 1.5, sl.end * Math.PI / 1.5)
    ctx.closePath()
    ctx.fillStyle = sl.color; ctx.fill()
  })
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'; ctx.fill()
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2)
  ctx.fillStyle = '#4285F4'; ctx.fill()
}

function drawDockIcon_Slack(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  ctx.fillStyle = '#4A154B'; ctx.fill()
  const cx = x + s / 2, cy = y + s / 2, d = s * 0.11
  const pairs: [string, number, number, boolean][] = [
    ['#36C5F0', cx - d, cy - d * 2.2, false],
    ['#2EB67D', cx + d, cy - d * 2.2, false],
    ['#ECB22E', cx - d * 2.2, cy + d, true],
    ['#E01E5A', cx - d * 2.2, cy - d, true],
  ]
  pairs.forEach(([color, px, py, horiz]) => {
    roundRect(ctx, px - d * 0.7, py - d * 0.7, horiz ? d * 3.8 : d * 1.4, horiz ? d * 1.4 : d * 3.8, d * 0.5)
    ctx.fillStyle = color; ctx.fill()
  })
}

function drawDockIcon_Notion(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  roundRect(ctx, x, y, s, s, s * 0.22)
  ctx.fillStyle = '#ffffff'; ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.font = `bold ${s * 0.52}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.fillText('N', x + s / 2, y + s * 0.65)
}

/* ═══════════  Shared UI Helpers  ═══════════ */

function drawDock(ctx: CanvasRenderingContext2D) {
  ctx.save()
  const dockW = 460, dockH = 54, iconS = 40
  const dockX = W / 2 - dockW / 2, dockY = H - 64

  roundRect(ctx, dockX, dockY, dockW, dockH, 16)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  const drawers = [
    drawDockIcon_Finder, drawDockIcon_VSCode, drawDockIcon_Terminal,
    drawDockIcon_Figma, drawDockIcon_Chrome, drawDockIcon_Slack, drawDockIcon_Notion,
  ]
  const totalIcons = drawers.length
  const gap = (dockW - totalIcons * iconS) / (totalIcons + 1)
  drawers.forEach((draw, i) => {
    const ix = dockX + gap + i * (iconS + gap)
    const iy = dockY + (dockH - iconS) / 2
    draw(ctx, ix, iy, iconS)
  })

  ctx.restore()
  ctx.textAlign = 'left'
}

function drawMenuBar(ctx: CanvasRenderingContext2D, appName: string) {
  ctx.fillStyle = 'rgba(30,30,30,0.95)'
  ctx.fillRect(0, 0, W, 28)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '14px -apple-system'
  ctx.textAlign = 'left'
  ctx.fillText('\uF8FF', 14, 19)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = 'bold 13px -apple-system, sans-serif'
  ctx.fillText(appName, 36, 19)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '13px -apple-system, sans-serif'
  const menus = ['File', 'Edit', 'View', 'Window', 'Help']
  menus.forEach((m, i) => { ctx.fillText(m, 120 + i * 54, 19) })
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '13px -apple-system, sans-serif'
  ctx.fillText(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), W - 20, 19)
  ctx.fillText('100%   WiFi', W - 100, 19)
  ctx.textAlign = 'left'
}

function drawWindowChrome(ctx: CanvasRenderingContext2D, title: string, y = 32) {
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(0, y, W, 38)
  const lights = ['#ff5f57', '#ffbd2e', '#28c940']
  lights.forEach((color, i) => {
    ctx.beginPath()
    ctx.arc(24 + i * 24, y + 19, 7, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '13px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, W / 2, y + 24)
  ctx.textAlign = 'left'
}

/* ═══════════  Hero Screen  ═══════════ */

function drawHeroRightPanel(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(200,169,110,0.12)'
  ctx.fillRect(818, 56, 1, 920)

  /* Badge — mirrors live Hero “AVAILABLE FOR WORK” */
  roundRect(ctx, 860, 112, 236, 30, 8)
  ctx.fillStyle = 'rgba(201,168,76,0.14)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201,168,76,0.42)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = '#C9A84C'
  ctx.beginPath()
  ctx.arc(878, 127, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = 'bold 10px ui-monospace, JetBrains Mono, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('AVAILABLE FOR WORK', 892, 132)

  ctx.fillStyle = '#EEEEE8'
  ctx.font = '700 52px Syne, ui-sans-serif, sans-serif'
  ctx.fillText('ANSHUL', 860, 218)
  ctx.fillStyle = '#C8A96E'
  ctx.fillText('RAIBOLE', 860, 278)

  ctx.fillStyle = '#C8A96E'
  ctx.fillRect(860, 294, 480, 2)

  ctx.fillStyle = 'rgba(238,238,232,0.45)'
  ctx.font = '500 17px ui-monospace, monospace'
  ctx.fillText('Full-Stack Engineer', 860, 338)
  ctx.fillText('AI & Data Science', 860, 366)

  ctx.fillStyle = 'rgba(238,238,232,0.52)'
  ctx.font = '400 14px Plus Jakarta Sans, ui-sans-serif, sans-serif'
  ctx.fillText('Engineering intelligence. Building systems that matter.', 860, 408)
  ctx.fillText('Leading development at KCC Infra, Pune.', 860, 432)

  ctx.fillStyle = 'rgba(200,169,110,0.1)'
  ctx.fillRect(860, 458, 600, 1)

  /* CTA pills — echoes Hero buttons */
  roundRect(ctx, 860, 478, 148, 36, 8)
  ctx.fillStyle = 'rgba(201,168,76,0.18)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(201,168,76,0.45)'
  ctx.stroke()
  ctx.fillStyle = '#C9A84C'
  ctx.font = 'bold 11px ui-monospace, monospace'
  ctx.fillText('VIEW WORK →', 878, 502)
  roundRect(ctx, 1022, 478, 158, 36, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.stroke()
  ctx.fillStyle = 'rgba(238,238,232,0.85)'
  ctx.fillText('DOWNLOAD CV ↓', 1042, 502)

  ctx.fillStyle = 'rgba(200,169,110,0.1)'
  ctx.fillRect(860, 538, 600, 1)

  const stats = [
    { num: '2+', label: 'YRS EXP' },
    { num: '10+', label: 'PROJECTS' },
    { num: 'N3', label: '日本語' },
    { num: 'AIML', label: 'SPECIALIZATION' },
  ]
  stats.forEach((s, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 860 + col * 300
    const y = 568 + row * 185

    ctx.fillStyle = 'rgba(200,169,110,0.035)'
    ctx.fillRect(x, y, 275, 160)
    ctx.fillStyle = '#C8A96E'
    ctx.fillRect(x, y, 3, 160)
    ctx.font = '700 58px sans-serif'
    ctx.fillText(s.num, x + 18, y + 68)
    ctx.fillStyle = 'rgba(238,238,232,0.35)'
    ctx.font = '500 15px monospace'
    ctx.fillText(s.label, x + 18, y + 96)
  })

  ctx.fillStyle = 'rgba(200,169,110,0.2)'
  ctx.fillRect(860, 920, 600, 1)
  ctx.fillStyle = 'rgba(200,169,110,0.35)'
  ctx.font = '400 13px monospace'
  ctx.fillText('MONOZUKURI — 物作り', 860, 955)
}

export function buildHeroScreenCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = W * TEX_SCALE
  canvas.height = H * TEX_SCALE
  const ctx = canvas.getContext('2d')!
  ctx.scale(TEX_SCALE, TEX_SCALE)

  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(200,169,110,0.035)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  ctx.fillStyle = 'rgba(200,169,110,0.08)'
  ctx.fillRect(0, 0, W, 48)
  const dots: [string, number][] = [['#FF5F57', 28], ['#FFBD2E', 54], ['#28CA41', 80]]
  dots.forEach(([c, x]) => {
    ctx.fillStyle = c
    ctx.beginPath(); ctx.arc(x, 24, 7, 0, Math.PI * 2); ctx.fill()
  })
  ctx.fillStyle = 'rgba(200,169,110,0.5)'
  ctx.font = '500 14px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('anshulraibole.dev', W / 2, 28)
  ctx.textAlign = 'left'

  drawHeroRightPanel(ctx)

  return canvas
}

export function drawHeroPhoto(canvas: HTMLCanvasElement, img: HTMLImageElement): void {
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(TEX_SCALE, 0, 0, TEX_SCALE, 0, 0)

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 48, 800, 952)
  ctx.clip()
  const aspect = img.naturalWidth / img.naturalHeight
  let drawW = 800, drawH = drawW / aspect
  if (drawH < 952) { drawH = 952; drawW = drawH * aspect }
  ctx.drawImage(img, (800 - drawW) / 2, 48 + (952 - drawH) / 2, drawW, drawH)
  const grad = ctx.createLinearGradient(620, 0, 810, 0)
  grad.addColorStop(0, 'rgba(8,8,8,0)')
  grad.addColorStop(1, 'rgba(8,8,8,0.85)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 48, 810, 952)
  ctx.restore()
}

/* ═══════════  Stage Screens  ═══════════ */

function drawNotion(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#191919'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Notion')
  drawWindowChrome(ctx, 'requirements.md — Notion')

  ctx.fillStyle = '#1f1f1f'
  ctx.fillRect(0, 70, 320, H - 70)
  const sideItems = [
    { label: '📋 Project Brief', active: false },
    { label: '✅ Requirements', active: true },
    { label: '🗂 User Flows', active: false },
    { label: '💰 Budget & Timeline', active: false },
  ]
  sideItems.forEach((item, i) => {
    if (item.active) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(8, 90 + i * 36, 304, 30)
    }
    ctx.fillStyle = item.active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'
    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillText(item.label, 20, 112 + i * 36)
  })

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px -apple-system, sans-serif'
  ctx.fillText('Requirements Document', 370, 130)
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '13px -apple-system, sans-serif'
  ctx.fillText('Last edited just now · Anshul Raibole', 370, 155)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(370, 170); ctx.lineTo(W - 60, 170); ctx.stroke()

  const checks = [
    { text: 'Client goals & success metrics defined', done: true },
    { text: 'User persona mapped', done: true },
    { text: 'Technical stack decided', done: true },
    { text: 'Timeline & milestones agreed', done: true },
    { text: 'Scope locked', done: true },
    { text: 'Budget confirmed', done: false },
  ]
  checks.forEach((item, i) => {
    const cy = 200 + i * 34
    roundRect(ctx, 370, cy - 13, 18, 18, 4)
    if (item.done) {
      ctx.fillStyle = '#4f9eff'
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px sans-serif'
      ctx.fillText('✓', 373, cy + 1)
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.fillStyle = item.done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)'
    ctx.font = '15px -apple-system, sans-serif'
    ctx.fillText(item.text, 400, cy + 1)
  })

  const tableY = 430
  roundRect(ctx, 370, tableY, 1160, 200, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = 'bold 13px -apple-system, sans-serif'
  ctx.fillText('REQUIREMENT', 400, tableY + 24)
  ctx.fillText('SOLUTION', 900, tableY + 24)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.beginPath(); ctx.moveTo(370, tableY + 34); ctx.lineTo(1530, tableY + 34); ctx.stroke()
  const rows = [
    ['Real-time data', 'WebSocket + Redis'],
    ['AI features', 'FastAPI + PyTorch'],
    ['Auth system', 'NextAuth + JWT'],
    ['Deployment', 'AWS + Docker'],
  ]
  rows.forEach((row, i) => {
    const ry = tableY + 60 + i * 38
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.font = '14px -apple-system, sans-serif'
    ctx.fillText(row[0], 400, ry)
    ctx.fillStyle = '#4f9eff'
    ctx.fillText(row[1], 900, ry)
    if (i < rows.length - 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.beginPath(); ctx.moveTo(370, ry + 16); ctx.lineTo(1530, ry + 16);       ctx.stroke()
    }
  })
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawFigma(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Figma')
  drawWindowChrome(ctx, 'system-architecture — Figma')

  ctx.fillStyle = '#2c2c2c'
  ctx.fillRect(0, 70, 260, H - 70)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = 'bold 12px -apple-system'
  ctx.fillText('LAYERS', 16, 94)
  const layers = ['Frame 1', '  → Header', '  → Hero', '  → Services', '  → Footer', 'Components', '  → Button']
  layers.forEach((l, i) => {
    ctx.fillStyle = i === 2 ? '#4f9eff' : 'rgba(255,255,255,0.55)'
    ctx.font = '12px -apple-system'
    ctx.fillText(l, 16, 120 + i * 24)
  })

  ctx.fillStyle = '#323232'
  ctx.fillRect(260, 70, 1080, H - 70)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let gx = 280; gx < 1340; gx += 24) {
    for (let gy = 90; gy < H - 80; gy += 24) {
      ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill()
    }
  }

  roundRect(ctx, 440, 180, 200, 80, 8)
  ctx.fillStyle = 'rgba(79,158,255,0.15)'; ctx.fill()
  ctx.strokeStyle = '#4f9eff'; ctx.lineWidth = 2; ctx.stroke()
  ctx.fillStyle = '#4f9eff'
  ctx.font = 'bold 14px -apple-system'
  ctx.textAlign = 'center'
  ctx.fillText('Next.js Client', 540, 215)
  ctx.font = '12px -apple-system'
  ctx.fillText('React + TypeScript', 540, 238)

  roundRect(ctx, 780, 180, 200, 80, 8)
  ctx.fillStyle = 'rgba(201,168,76,0.15)'; ctx.fill()
  ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 2; ctx.stroke()
  ctx.fillStyle = '#C9A84C'
  ctx.font = 'bold 14px -apple-system'
  ctx.fillText('FastAPI', 880, 215)
  ctx.font = '12px -apple-system'
  ctx.fillText('Python Backend', 880, 238)

  roundRect(ctx, 610, 360, 200, 80, 8)
  ctx.fillStyle = 'rgba(40,201,64,0.15)'; ctx.fill()
  ctx.strokeStyle = '#28c940'; ctx.lineWidth = 2; ctx.stroke()
  ctx.fillStyle = '#28c940'
  ctx.font = 'bold 14px -apple-system'
  ctx.fillText('PostgreSQL', 710, 395)
  ctx.font = '12px -apple-system'
  ctx.fillText('+ Redis Cache', 710, 418)
  ctx.textAlign = 'left'

  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  ctx.beginPath(); ctx.moveTo(640, 220); ctx.lineTo(780, 220); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(880, 260); ctx.lineTo(880, 320); ctx.lineTo(810, 360); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(540, 260); ctx.lineTo(540, 320); ctx.lineTo(620, 360); ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#2c2c2c'
  ctx.fillRect(1340, 70, 260, H - 70)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = 'bold 12px -apple-system'
  ctx.fillText('DESIGN', 1356, 94)
  const props = ['Fill: #4f9eff', 'Opacity: 85%', 'Corner: 8px', 'W: 200  H: 80', 'Stroke: 2px']
  props.forEach((p, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '12px -apple-system'
    ctx.fillText(p, 1356, 122 + i * 24)
  })
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawVSCodeTokens(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Code')
  drawWindowChrome(ctx, 'tokens.css — Visual Studio Code')

  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 70, 48, H - 70)
  ctx.fillStyle = '#252526'
  ctx.fillRect(48, 70, 240, H - 70)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = 'bold 11px -apple-system'
  ctx.fillText('EXPLORER', 60, 92)

  const files: { name: string; folder: boolean; depth: number; active?: boolean }[] = [
    { name: 'PORTFOLIO', folder: true, depth: 0 },
    { name: 'components', folder: true, depth: 1 },
    { name: 'Hero.tsx', folder: false, depth: 2 },
    { name: 'styles', folder: true, depth: 1 },
    { name: 'tokens.css', folder: false, depth: 2, active: true },
    { name: 'globals.css', folder: false, depth: 2 },
  ]
  files.forEach((f, i) => {
    if (f.active) {
      ctx.fillStyle = 'rgba(79,158,255,0.2)'
      ctx.fillRect(48, 102 + i * 24, 240, 22)
    }
    ctx.fillStyle = f.active ? '#ffffff' : f.folder ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.55)'
    ctx.font = f.folder ? 'bold 12px monospace' : '12px monospace'
    ctx.fillText((f.folder ? '▾ ' : '  ') + f.name, 60 + f.depth * 14, 118 + i * 24)
  })

  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(288, 70, W - 288, H - 70)
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(288, 70, W - 288, 30)
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(288, 70, 140, 30)
  ctx.fillStyle = '#ffffff'
  ctx.font = '13px monospace'
  ctx.fillText('tokens.css', 300, 90)

  type Tok = { t: string; c: string }
  const lines: { ln: number; tokens: Tok[] }[] = [
    { ln: 1,  tokens: [{ t: ':root {', c: '#d4d4d4' }] },
    { ln: 2,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--bg', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#0D0C0B', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 3,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--bg-secondary', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#111009', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 4,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--gold', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#C9A84C', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 5,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--gold-light', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#E8C97A', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 6,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--white', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#F5F3EE', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 7,  tokens: [{ t: '  ', c: '#d4d4d4' }, { t: '--muted', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '#6B6860', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 8,  tokens: [{ t: '}', c: '#d4d4d4' }] },
    { ln: 9,  tokens: [{ t: '', c: '#d4d4d4' }] },
    { ln: 10, tokens: [{ t: '/* Typography */', c: '#6a9955' }] },
    { ln: 11, tokens: [{ t: '.heading {', c: '#d4d4d4' }] },
    { ln: 12, tokens: [{ t: '  ', c: '#d4d4d4' }, { t: 'font-family', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: "'Space Grotesk'", c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 13, tokens: [{ t: '  ', c: '#d4d4d4' }, { t: 'font-weight', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: '700', c: '#b5cea8' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 14, tokens: [{ t: '  ', c: '#d4d4d4' }, { t: 'color', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: 'var(--gold)', c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
    { ln: 15, tokens: [{ t: '}', c: '#d4d4d4' }] },
  ]
  lines.forEach((line, i) => {
    const ly = 128 + i * 28
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '13px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(String(line.ln), 340, ly)
    ctx.textAlign = 'left'
    if (i === 3) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(350, ly - 18, W - 350, 24)
    }
    let tx = 360
    line.tokens.forEach(token => {
      ctx.fillStyle = token.c
      ctx.font = '13px monospace'
      ctx.fillText(token.t, tx, ly)
      tx += ctx.measureText(token.t).width
    })
  })

  ctx.fillStyle = '#007ACC'
  ctx.fillRect(288, H - 26, W - 288, 26)
  ctx.fillStyle = '#ffffff'
  ctx.font = '12px -apple-system'
  ctx.fillText('  main    0 errors    CSS', 300, H - 10)
  ctx.textAlign = 'right'
  ctx.fillText('UTF-8   Ln 4, Col 18  ', W - 20, H - 10)
  ctx.textAlign = 'left'
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawVSCodeSplit(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Code')
  drawWindowChrome(ctx, 'HowIBuild.tsx — Visual Studio Code')

  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 70, 48, H - 70)
  ctx.fillStyle = '#252526'
  ctx.fillRect(48, 70, 240, H - 70)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = 'bold 11px -apple-system'
  ctx.fillText('EXPLORER', 60, 92)
  const files2 = ['Hero.tsx', 'HowIBuild.tsx', 'About.tsx', 'Projects.tsx']
  files2.forEach((f, i) => {
    ctx.fillStyle = i === 1 ? '#4f9eff' : 'rgba(255,255,255,0.5)'
    ctx.font = '12px monospace'
    ctx.fillText(f, 66, 120 + i * 24)
  })

  const editorX = 288
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(editorX, 70, W - editorX, 440)
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(editorX, 70, W - editorX, 30)
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(editorX, 70, 170, 30)
  ctx.fillStyle = '#fff'
  ctx.font = '13px monospace'
  ctx.fillText('HowIBuild.tsx', editorX + 12, 90)

  type Tok = { t: string; c: string }
  const codeLines: Tok[][] = [
    [{ t: 'import', c: '#c586c0' }, { t: ' { useEffect, useRef }', c: '#d4d4d4' }, { t: ' from', c: '#c586c0' }, { t: " 'react'", c: '#ce9178' }],
    [{ t: 'import', c: '#c586c0' }, { t: ' { gsap }', c: '#d4d4d4' }, { t: ' from', c: '#c586c0' }, { t: " 'gsap'", c: '#ce9178' }],
    [{ t: '', c: '' }],
    [{ t: 'interface', c: '#c586c0' }, { t: ' Props {', c: '#d4d4d4' }],
    [{ t: '  stage', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: 'number', c: '#4ec9b0' }],
    [{ t: '  isActive', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: 'boolean', c: '#4ec9b0' }],
    [{ t: '}', c: '#d4d4d4' }],
    [{ t: '', c: '' }],
    [{ t: 'export const', c: '#c586c0' }, { t: ' StageScene ', c: '#dcdcaa' }, { t: '= ({', c: '#d4d4d4' }],
    [{ t: '  stage, isActive', c: '#9cdcfe' }],
    [{ t: '}: Props) => {', c: '#d4d4d4' }],
    [{ t: '  const', c: '#c586c0' }, { t: ' ref ', c: '#9cdcfe' }, { t: '= ', c: '#d4d4d4' }, { t: 'useRef', c: '#dcdcaa' }, { t: '<HTMLDivElement>()', c: '#d4d4d4' }],
  ]
  codeLines.forEach((tokens, i) => {
    const ly = 128 + i * 28
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '13px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(String(i + 1), 340, ly)
    ctx.textAlign = 'left'
    let tx = 360
    tokens.forEach(tok => {
      if (!tok.t) return
      ctx.fillStyle = tok.c
      ctx.font = '13px monospace'
      ctx.fillText(tok.t, tx, ly)
      tx += ctx.measureText(tok.t).width
    })
  })

  const termTop = 514
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(editorX, termTop, W - editorX, H - termTop)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(editorX, termTop, W - editorX, 28)
  ctx.fillStyle = '#ffffff'
  ctx.font = '12px monospace'
  ctx.fillText('TERMINAL', editorX + 12, termTop + 19)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillText('PROBLEMS  OUTPUT', editorX + 120, termTop + 19)

  const termLines = [
    { text: 'anshul@MacBook-Pro % git checkout -b feat/how-i-build', color: '#cccccc' },
    { text: "Switched to a new branch 'feat/how-i-build'", color: '#6a9955' },
    { text: '', color: '' },
    { text: 'anshul@MacBook-Pro % npm run dev', color: '#cccccc' },
    { text: '', color: '' },
    { text: '▲ Next.js 15.0.0', color: '#4f9eff' },
    { text: '- Local: http://localhost:3000', color: '#cccccc' },
    { text: '✓ Ready in 847ms', color: '#28c940' },
    { text: '', color: '' },
    { text: 'anshul@MacBook-Pro % git add . && git commit -m "feat: scroll animations"', color: '#cccccc' },
    { text: '[feat/how-i-build a3f9d2c] feat: scroll animations', color: '#6a9955' },
    { text: 'anshul@MacBook-Pro % █', color: '#cccccc' },
  ]
  termLines.forEach((line, i) => {
    if (!line.text) return
    ctx.fillStyle = line.color
    ctx.font = '13px monospace'
    ctx.fillText(line.text, editorX + 14, termTop + 54 + i * 24)
  })

  ctx.fillStyle = '#007ACC'
  ctx.fillRect(editorX, H - 26, W - editorX, 26)
  ctx.fillStyle = '#ffffff'
  ctx.font = '12px -apple-system'
  ctx.fillText('  main    0 errors    TypeScript', editorX + 12, H - 10)
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawTerminalVitest(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Terminal')
  drawWindowChrome(ctx, 'vitest — zsh — 120×40')

  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '14px monospace'
  ctx.fillText('anshul@MacBook-Pro % npx vitest run', 30, 110)

  const tests = [
    'Hero renders correctly', 'HowIBuild stages update', 'ScrollTrigger pins correctly',
    'Magnetic button hover works', 'Terminal overlay opens', 'Keyboard SUDO easter egg',
    'Contact form validation', 'API rate limiting works', 'Docker container health',
    'AWS deployment pipeline', 'Lenis smooth scroll sync', 'GSAP context cleanup',
  ]
  const durations = [12, 8, 23, 6, 14, 9, 31, 18, 42, 37, 11, 5]
  tests.forEach((name, i) => {
    const ty = 150 + i * 30
    ctx.fillStyle = '#28c940'
    ctx.font = 'bold 14px monospace'
    ctx.fillText('✓', 30, ty)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.font = '14px monospace'
    ctx.fillText(name, 54, ty)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.textAlign = 'right'
    ctx.fillText(`${durations[i]}ms`, W - 40, ty)
    ctx.textAlign = 'left'
  })

  const sumY = 530
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(30, sumY, W - 60, 70)
  ctx.fillStyle = '#28c940'
  ctx.font = 'bold 16px monospace'
  ctx.fillText('Tests  12 passed', 50, sumY + 28)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '13px monospace'
  ctx.fillText('Duration  1.42s', 50, sumY + 52)
  ctx.fillText('Start at  10:32:17 AM', 340, sumY + 52)

  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '14px monospace'
  ctx.fillText('anshul@MacBook-Pro % █', 30, 640)
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawVercel(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#171717'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Chrome')
  drawWindowChrome(ctx, 'Deployments — Vercel')

  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(0, 70, W, 42)
  roundRect(ctx, W / 2 - 340, 78, 680, 28, 14)
  ctx.fillStyle = '#3a3a3a'; ctx.fill()
  ctx.fillStyle = '#28c940'
  ctx.font = '12px -apple-system'
  ctx.fillText('🔒', W / 2 - 320, 97)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '13px -apple-system'
  ctx.fillText('vercel.com/anshul/portfolio/deployments', W / 2 - 298, 97)

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 112, 280, H - 112)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px -apple-system'
  ctx.fillText('▲ Vercel', 24, 146)
  const navItems = ['Overview', 'Deployments', 'Analytics', 'Settings']
  navItems.forEach((item, i) => {
    ctx.fillStyle = i === 1 ? '#ffffff' : 'rgba(255,255,255,0.45)'
    ctx.font = i === 1 ? 'bold 13px -apple-system' : '13px -apple-system'
    ctx.fillText(item, 24, 184 + i * 34)
  })

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(280, 112, W - 280, H - 112)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px -apple-system'
  ctx.fillText('Deploying to Production', 320, 166)

  const steps = [
    { text: 'Build completed', time: '0:42' },
    { text: 'Checks passed', time: '0:08' },
    { text: 'Edge Network deployed', time: '0:03' },
    { text: 'Assigning domain...', time: '0:02' },
    { text: 'SSL certificate issued', time: '0:01' },
  ]
  steps.forEach((step, i) => {
    const sy = 210 + i * 42
    ctx.fillStyle = '#28c940'
    ctx.font = '16px monospace'
    ctx.fillText('✓', 320, sy)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '15px -apple-system'
    ctx.fillText(step.text, 348, sy)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'right'
    ctx.fillText(step.time, W - 40, sy)
    ctx.textAlign = 'left'
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(320, sy + 18); ctx.lineTo(W - 40, sy + 18); ctx.stroke()
  })

  const scoreY = 450
  roundRect(ctx, 320, scoreY, 1200, 110, 10)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1; ctx.stroke()
  const scores = [
    { label: 'Performance', value: 98, color: '#28c940' },
    { label: 'Accessibility', value: 100, color: '#28c940' },
    { label: 'SEO', value: 95, color: '#28c940' },
  ]
  scores.forEach((score, i) => {
    const sx = 520 + i * 380
    ctx.fillStyle = score.color
    ctx.font = 'bold 36px -apple-system'
    ctx.textAlign = 'center'
    ctx.fillText(String(score.value), sx, scoreY + 56)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '13px -apple-system'
    ctx.fillText(score.label, sx, scoreY + 82)
  })
  ctx.textAlign = 'left'
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

function drawSlack(ctx: CanvasRenderingContext2D, stage: number) {
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, W, H)
  drawMenuBar(ctx, 'Slack')
  drawWindowChrome(ctx, 'general — Slack')

  ctx.fillStyle = '#19171d'
  ctx.fillRect(0, 70, 320, H - 70)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px -apple-system'
  ctx.fillText("Anshul's Team", 20, 100)

  const channels = [
    { name: '# general', active: true, unread: false },
    { name: '# dev-updates', active: false, unread: true },
    { name: '# design', active: false, unread: false },
    { name: '# deployment', active: false, unread: true },
    { name: '@ Client', active: false, unread: false },
  ]
  channels.forEach((ch, i) => {
    if (ch.active) {
      roundRect(ctx, 10, 116 + i * 34, 300, 28, 5)
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill()
    }
    ctx.fillStyle = ch.active ? '#ffffff' : ch.unread ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'
    ctx.font = ch.unread ? 'bold 14px -apple-system' : '14px -apple-system'
    ctx.fillText(ch.name, 22, 136 + i * 34)
    if (ch.unread) {
      ctx.beginPath(); ctx.arc(296, 132 + i * 34, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'; ctx.fill()
    }
  })

  ctx.fillStyle = '#222222'
  ctx.fillRect(320, 70, W - 320, H - 70)
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(320, 70, W - 320, 48)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px -apple-system'
  ctx.fillText('# general', 340, 100)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '13px -apple-system'
  ctx.fillText('Company-wide updates and news', 500, 100)

  const messages = [
    { user: 'Client', avatar: '#4f9eff', time: '9:41 AM', text: "Just checked the deployment — the animations are smooth" },
    { user: 'Client', avatar: '#4f9eff', time: '9:41 AM', text: 'Really impressed with the gold palette! 🔥' },
    { user: 'Anshul', avatar: '#C9A84C', time: '9:43 AM', text: 'Thanks! Used GSAP + Lenis for scroll-driven effects.' },
    { user: 'Anshul', avatar: '#C9A84C', time: '9:43 AM', text: 'Performance score is 98/100 on Lighthouse.' },
    { user: 'Client', avatar: '#4f9eff', time: '9:45 AM', text: 'Can we add one more page for the blog section?' },
    { user: 'Anshul', avatar: '#C9A84C', time: '9:46 AM', text: 'Absolutely — will create a ticket now.' },
  ]
  messages.forEach((msg, i) => {
    const my = 148 + i * 62
    ctx.beginPath(); ctx.arc(356, my + 14, 18, 0, Math.PI * 2)
    ctx.fillStyle = msg.avatar; ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px -apple-system'
    ctx.textAlign = 'center'
    ctx.fillText(msg.user.slice(0, 2).toUpperCase(), 356, my + 18)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px -apple-system'
    ctx.fillText(msg.user, 386, my + 10)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '12px -apple-system'
    ctx.fillText(msg.time, 386 + ctx.measureText(msg.user).width + 10, my + 10)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = '14px -apple-system'
    ctx.fillText(msg.text, 386, my + 32)
  })
  drawHowIBuildStageRibbon(ctx, stage)
  drawDock(ctx)
}

export function buildStageCanvas(stage: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W * TEX_SCALE
  canvas.height = SCREEN_H * TEX_SCALE
  const ctx = canvas.getContext('2d')!
  ctx.scale(TEX_SCALE, TEX_SCALE)

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  const S = 0.97
  ctx.save()
  ctx.translate(SCREEN_W * (1 - S) / 2, SCREEN_H * (1 - S) / 2)
  ctx.scale(S, S)

  switch (stage) {
    case 0:  drawNotion(ctx, stage);         break
    case 1:  drawFigma(ctx, stage);          break
    case 2:  drawVSCodeTokens(ctx, stage);   break
    case 3:  drawVSCodeSplit(ctx, stage);    break
    case 4:  drawTerminalVitest(ctx, stage); break
    case 5:  drawVercel(ctx, stage);         break
    case 6:  drawSlack(ctx, stage);          break
    default: drawNotion(ctx, stage)
  }

  ctx.restore()
  return canvas
}
