import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useHub, HubLogo, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function PaymentCallback() {
  const { hubConfig, currentHub } = useHub()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id')
    const canceled = searchParams.get('canceled')
    
    if (canceled === 'true') {
      setStatus('error')
      setMessage('Payment was canceled. Redirecting to your dashboard...')
      // Still redirect to dashboard - they have an account now
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      return
    }

    if (!sessionId) {
      setStatus('error')
      setMessage('Invalid payment session. Please try again.')
      return
    }

    // Payment successful (webhook will handle the database updates)
    setStatus('success')
    setMessage('Payment successful! Setting up your account...')
    toast.success('Payment completed successfully!')
    
    // Clear any payment required flags
    sessionStorage.removeItem('payment_required')
    
    // Redirect to dashboard after a brief delay
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <HubLogo hubType={currentHub} variant="full" size="lg" className="mx-auto mb-4" />
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your payment...'}
            {status === 'success' && 'Payment successful!'}
            {status === 'error' && 'Payment verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin hub-text-primary" />
              <p className="text-sm text-muted-foreground">Please wait while we verify your payment...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}