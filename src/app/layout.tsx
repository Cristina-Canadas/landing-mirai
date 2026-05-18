import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const museoSans = localFont({
  src: [
    { path: '../fonts/MuseoSansRounded100.otf', weight: '100', style: 'normal' },
    { path: '../fonts/MuseoSansRounded300.otf', weight: '300', style: 'normal' },
    { path: '../fonts/MuseoSansRounded500.otf', weight: '500', style: 'normal' },
    { path: '../fonts/MuseoSansRounded700.otf', weight: '700', style: 'normal' },
    { path: '../fonts/MuseoSansRounded900.otf', weight: '900', style: 'normal' },
    { path: '../fonts/MuseoSansRounded1000.otf', weight: '1000', style: 'normal' },
  ],
  variable: '--font-museo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mirai Suite | Portal de Herramientas',
  description: 'Acceso centralizado a todas las herramientas internas de Front Mirai: Core, SEO, Layout y Contenido.',
  icons: {
    icon: '/mirai.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={museoSans.variable}>
      <body>{children}</body>
    </html>
  )
}
