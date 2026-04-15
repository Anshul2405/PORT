import { NextResponse } from 'next/server'

/**
 * Web3Forms: free plan typically rejects server-side POSTs (requires paid + IP whitelist).
 * Prefer `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` + browser submit in `Contact.tsx`.
 */
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

function validEmail(s: string): boolean {
  return s.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(req: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) {
    return NextResponse.json({ ok: false as const, fallback: 'mailto' as const }, { status: 501 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false as const, message: 'Invalid request body.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false as const, message: 'Invalid request body.' }, { status: 400 })
  }

  const { name, contact, transmission } = body as Record<string, unknown>
  const nameStr = typeof name === 'string' ? name.trim() : ''
  const emailStr = typeof contact === 'string' ? contact.trim() : ''
  const msgStr = typeof transmission === 'string' ? transmission.trim() : ''

  if (nameStr.length < 2) {
    return NextResponse.json({ ok: false as const, message: 'Please enter your name.' }, { status: 400 })
  }
  if (!validEmail(emailStr)) {
    return NextResponse.json({ ok: false as const, message: 'Please enter a valid email.' }, { status: 400 })
  }
  if (msgStr.length < 8) {
    return NextResponse.json({ ok: false as const, message: 'Message is too short.' }, { status: 400 })
  }

  const upstream = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Portfolio contact from ${nameStr}`,
      name: nameStr,
      email: emailStr,
      message: msgStr,
      from_name: nameStr,
      replyto: emailStr,
    }),
  })

  const data = (await upstream.json().catch(() => ({}))) as {
    success?: boolean
    message?: string
    body?: { message?: string }
  }

  if (!upstream.ok || data.success !== true) {
    const upstreamMsg =
      (typeof data.message === 'string' && data.message.length > 0 ? data.message : undefined) ??
      (typeof data.body?.message === 'string' && data.body.message.length > 0 ? data.body.message : undefined)
    const msg =
      upstreamMsg ??
      'Web3Forms blocked this server request. Use NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local and submit from the browser (see Contact form).'
    return NextResponse.json({ ok: false as const, message: msg }, { status: 502 })
  }

  return NextResponse.json({ ok: true as const })
}
