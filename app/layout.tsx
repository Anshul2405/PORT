import type { Metadata, Viewport } from 'next'
import { Syne, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/SmoothScroll'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

const SITE_URL = 'https://anshulraibole.dev'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Anshul Raibole',
  description: 'Fullstack Software Engineer and AI/Data Science Engineer. Project Lead at KCC Infra. Specializing in Generative AI, Digital Twin Systems, and mission-critical software.',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Anshul Raibole',
    description: 'Engineering Intelligence. Building Systems that Matter.',
    url: SITE_URL,
    siteName: 'Anshul Raibole',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anshul Raibole',
    description: 'Engineering Intelligence. Building Systems that Matter.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anshul Raibole',
    jobTitle: 'Fullstack Engineer & AI/Data Science Engineer',
    url: SITE_URL,
    sameAs: [
      'https://linkedin.com/in/anshulraibole',
      'https://github.com/Anshul2405',
    ],
    knowsLanguage: ['English', 'Japanese', 'Hindi'],
  }

  return (
    <html lang="en">
      <head />
      <body className={`${syne.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} noise`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
