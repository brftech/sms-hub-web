'use client'

import { useEffect } from 'react'
import { useHub, HubLogo } from '@sms-hub/ui'

export default function DocsRedirect() {
  const { currentHub } = useHub()

  useEffect(() => {
    // Redirect to docs app
    window.location.href = 'http://localhost:3003'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <HubLogo hubType={currentHub} variant="full" size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecting to documentation...</p>
      </div>
    </div>
  )
}