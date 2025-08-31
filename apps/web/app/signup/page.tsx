'use client'

import { useEffect } from 'react'
import { useHub, HubLogo } from '@sms-hub/ui'

export default function SignupRedirect() {
  const { currentHub } = useHub()

  useEffect(() => {
    // Redirect to user app signup
    const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3004'
    window.location.href = `${userAppUrl}/signup`
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <HubLogo hubType={currentHub} variant="full" size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecting to signup...</p>
      </div>
    </div>
  )
}