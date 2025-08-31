import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HubProvider, StyledHubProvider } from '@sms-hub/ui'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HubProvider enableHubSwitcher={true}>
      <StyledHubProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StyledHubProvider>
    </HubProvider>
  </StrictMode>,
)