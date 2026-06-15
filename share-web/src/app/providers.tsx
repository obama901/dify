'use client'

import type { PropsWithChildren } from 'react'
import { ToastHost } from '@langgenius/dify-ui/toast'
import { TooltipProvider } from '@langgenius/dify-ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import common from '@/i18n/en-US/common.json'
import share from '@/i18n/en-US/share.json'
import { createI18nextInstance } from '@/i18n-config/client'

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())
  const [i18n] = useState(() => createI18nextInstance('en-US', {
    'en-US': {
      common,
      share,
    },
  }))

  return (
    <JotaiProvider>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <ToastHost timeout={5000} limit={3} />
              <TooltipProvider delay={300} closeDelay={200}>
                {children}
              </TooltipProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </JotaiProvider>
  )
}

export default Providers
