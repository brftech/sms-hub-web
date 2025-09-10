import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Checkbox } from '@sms-hub/ui'
import { ScrollArea } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { Shield, ChevronRight } from 'lucide-react'

export function PrivacyTermsStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!privacyAccepted || !termsAccepted) return
    
    setIsSubmitting(true)
    
    try {
      await onComplete({
        privacy_policy_accepted: true,
        terms_of_service_accepted: true,
        accepted_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Privacy/Terms acceptance error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 hub-text-primary" />
          Privacy Policy & Terms of Service
        </CardTitle>
        <CardDescription>
          Please review and accept our privacy policy and terms of service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Policy */}
        <div>
          <h3 className="font-semibold mb-2">Privacy Policy</h3>
          <ScrollArea className="h-40 border rounded p-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                {hubConfig.displayName} is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SMS platform.
              </p>
              <p>
                <strong>Information We Collect:</strong> We collect information you provide directly, usage data, and technical information about your interactions with our platform.
              </p>
              <p>
                <strong>How We Use Information:</strong> We use your information to provide our services, improve our platform, communicate with you, and comply with legal obligations.
              </p>
              <p>
                <strong>Data Security:</strong> We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
          </ScrollArea>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(!!checked)}
            />
            <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and accept the Privacy Policy
            </label>
          </div>
        </div>

        {/* Terms of Service */}
        <div>
          <h3 className="font-semibold mb-2">Terms of Service</h3>
          <ScrollArea className="h-40 border rounded p-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                These Terms of Service govern your use of {hubConfig.displayName}'s SMS platform and services.
              </p>
              <p>
                <strong>Service Usage:</strong> You agree to use our services in compliance with all applicable laws and regulations, including TCPA, CAN-SPAM, and other messaging regulations.
              </p>
              <p>
                <strong>Content Guidelines:</strong> You are responsible for all content sent through our platform and must ensure it complies with messaging regulations and our acceptable use policy.
              </p>
              <p>
                <strong>Account Responsibilities:</strong> You are responsible for maintaining the security of your account and all activities that occur under your account.
              </p>
            </div>
          </ScrollArea>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and accept the Terms of Service
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit}
            className="hub-bg-primary hover:hub-bg-primary/90"
            disabled={!privacyAccepted || !termsAccepted || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Campaign Setup'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}