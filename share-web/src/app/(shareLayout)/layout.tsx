import type { FC, PropsWithChildren } from 'react'
import { Suspense } from 'react'
import WebAppStoreProvider from '@/context/web-app-context'
import Splash from './components/splash'

export const dynamic = 'force-dynamic'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-full min-w-[300px] pb-[env(safe-area-inset-bottom)]">
      <WebAppStoreProvider>
        <Suspense fallback={null}>
          <Splash>
            {children}
          </Splash>
        </Suspense>
      </WebAppStoreProvider>
    </div>
  )
}

export default Layout
