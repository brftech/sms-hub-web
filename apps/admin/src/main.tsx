import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HubProvider, StyledHubProvider } from '@sms-hub/ui'
import { Toaster } from 'sonner'
import { adminEnvironment } from './config/adminEnvironment'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HubProvider environment={adminEnvironment} defaultHub="gnymble">
        <StyledHubProvider>
          <BrowserRouter future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }}>
            <App />
            <Toaster position="top-right" />
          </BrowserRouter>
        </StyledHubProvider>
      </HubProvider>
    </QueryClientProvider>
  </StrictMode>,
)