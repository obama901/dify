import type { Metadata, Viewport } from 'next'
import { getDatasetMap } from '@/env'
import Providers from './providers'
import './styles/globals.css'
import './styles/markdown.css'

export const metadata: Metadata = {
  title: 'Dify',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const datasetMap = getDatasetMap()

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1C64F2" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dify" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
      </head>
      <body
        className="h-full"
        {...datasetMap}
      >
        <div className="isolate h-full">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
