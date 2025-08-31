'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HubProvider, StyledHubProvider } from '@sms-hub/ui'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <HubProvider enableHubSwitcher={true}>
        <StyledHubProvider>
          {children}
        </StyledHubProvider>
      </HubProvider>
    </QueryClientProvider>
  )
}