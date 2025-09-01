import { CreditCard, AlertCircle, CheckCircle, XCircle, ArrowRight, ExternalLink, Building, User } from 'lucide-react'
import styled from 'styled-components'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@sms-hub/ui'
import { useCurrentCustomer, useCreateCustomerPortalSession } from '@sms-hub/supabase'
import { toast } from 'sonner'

const StatusCard = styled(Card)<{ $status: string }>`
  border: 2px solid ${props => {
    switch (props.$status) {
      case 'active': return '#22c55e'
      case 'past_due': return '#f59e0b'
      case 'canceled': return '#ef4444'
      case 'trialing': return '#3b82f6'
      default: return '#e5e7eb'
    }
  }};
  background: ${props => {
    switch (props.$status) {
      case 'active': return '#f0fdf4'
      case 'past_due': return '#fffbeb'
      case 'canceled': return '#fef2f2'
      case 'trialing': return '#eff6ff'
      default: return '#f9fafb'
    }
  }};
`

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'active': return '#22c55e'
      case 'past_due': return '#f59e0b'
      case 'canceled': return '#ef4444'
      case 'trialing': return '#3b82f6'
      default: return '#6b7280'
    }
  }};
  color: white;
`

const PlanInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const PlanName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

const PlanPrice = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  
  span {
    font-size: 1rem;
    font-weight: 400;
    color: #6b7280;
  }
`

const BillingInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    font-size: 0.875rem;
    color: #374151;
    margin: 0.25rem 0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

export function SubscriptionStatus() {
  const { data: customer, isLoading: customerLoading } = useCurrentCustomer()
  const createPortalSession = useCreateCustomerPortalSession()

  const handleManageSubscription = async () => {
    if (!customer?.id || !customer?.stripe_customer_id) {
      toast.error('Subscription information not found')
      return
    }

    try {
      const { url } = await createPortalSession.mutateAsync({
        customerId: customer.id,
        stripeCustomerId: customer.stripe_customer_id,
        returnUrl: window.location.href
      })

      if (url) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      toast.error('Failed to open billing portal')
    }
  }

  if (customerLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Loading subscription information...</p>
        </CardContent>
      </Card>
    )
  }

  if (!customer || !customer.stripe_subscription_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-gray-600 mb-6">
              Start your subscription to access all features
            </p>
            <Button 
              onClick={() => window.location.href = '/onboarding'}
              className="hub-bg-primary hover:hub-bg-primary/90"
            >
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return <CheckCircle className="w-5 h-5" />
      case 'past_due':
        return <AlertCircle className="w-5 h-5" />
      case 'canceled':
        return <XCircle className="w-5 h-5" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'past_due': return 'Past Due'
      case 'canceled': return 'Canceled'
      case 'trialing': return 'Trial'
      default: return status
    }
  }

  const getPlanDisplayName = (tier: string) => {
    switch (tier) {
      case 'starter': return 'Starter Plan'
      case 'professional': return 'Professional Plan'
      case 'enterprise': return 'Enterprise Plan'
      default: return 'Custom Plan'
    }
  }

  const getPlanPrice = (tier: string) => {
    switch (tier) {
      case 'starter': return '$49'
      case 'professional': return '$199'
      case 'enterprise': return '$499'
      default: return 'Custom'
    }
  }

  return (
    <StatusCard $status={customer.subscription_status || 'active'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
            {customer.customer_type === 'individual' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <User className="w-3 h-3" />
                Personal
              </span>
            )}
            {customer.customer_type === 'company' && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Building className="w-3 h-3" />
                Business
              </span>
            )}
          </CardTitle>
          <StatusBadge $status={customer.subscription_status || 'active'}>
            {getStatusIcon(customer.subscription_status || 'active')}
            {getStatusLabel(customer.subscription_status || 'active')}
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent>
        <PlanInfo>
          <div>
            <PlanName>{getPlanDisplayName(customer.subscription_tier || 'starter')}</PlanName>
            <p className="text-sm text-gray-600 mt-1">
              Billed monthly
            </p>
          </div>
          <PlanPrice>
            {getPlanPrice(customer.subscription_tier || 'starter')}
            <span>/month</span>
          </PlanPrice>
        </PlanInfo>

        {customer.billing_email && (
          <BillingInfo>
            <h4>Billing Email</h4>
            <p>{customer.billing_email}</p>
          </BillingInfo>
        )}

        <ActionButtons>
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={createPortalSession.isPending}
            className="flex-1"
          >
            Manage Subscription
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          {customer.subscription_status === 'past_due' && (
            <Button
              onClick={handleManageSubscription}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              Update Payment Method
              <CreditCard className="w-4 h-4 ml-2" />
            </Button>
          )}
        </ActionButtons>
      </CardContent>
    </StatusCard>
  )
}