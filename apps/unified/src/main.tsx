import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, SonnerToaster, TooltipProvider } from '@sms-hub/ui'
import { HelmetProvider } from 'react-helmet-async'
import { SupabaseProvider } from './providers/SupabaseProvider'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <SupabaseProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SupabaseProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
