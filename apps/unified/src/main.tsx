import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, SonnerToaster, TooltipProvider } from '@sms-hub/ui'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@sms-hub/auth'
import { getSupabaseClient } from './lib/supabaseSingleton'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()
const supabase = getSupabaseClient()

console.log("[UNIFIED APP] Starting unified app...");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <AuthProvider 
            supabase={supabase as any}
            config={{
              redirectUrl: '/dashboard',
              debug: true
            }}
          >
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <App />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
