import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@sms-hub/ui'
import { CheckCircle, Copy, ArrowRight } from 'lucide-react'

export function GettingStarted() {
  const { hubConfig, currentHub } = useHub()

  const steps = [
    {
      title: 'Create Your Account',
      description: 'Sign up for a free account and complete the onboarding process',
      code: null,
    },
    {
      title: 'Get Your API Keys',
      description: 'Generate API credentials from your dashboard',
      code: null,
    },
    {
      title: 'Install the SDK',
      description: 'Install our SDK for your preferred programming language',
      code: {
        language: 'bash',
        content: `# Node.js
npm install @${currentHub}/sdk

# Python
pip install ${currentHub}-sdk

# PHP
composer require ${currentHub}/sdk`
      },
    },
    {
      title: 'Send Your First Message',
      description: 'Use our API to send your first SMS message',
      code: {
        language: 'javascript',
        content: `import { SMSClient } from '@${currentHub}/sdk'

const client = new SMSClient({
  apiKey: 'your-api-key',
  hub: '${currentHub}'
})

const message = await client.messages.create({
  to: '+1234567890',
  body: 'Hello from ${hubConfig.displayName}!',
  from: '+1987654321'
})

console.log('Message sent:', message.id)`
      },
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Getting Started
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Quick Start Guide
          </h1>
          <p className="text-xl text-muted-foreground">
            Get up and running with {hubConfig.displayName} SMS API in just a few minutes
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full hub-bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {step.description}
                    </CardDescription>
                  </div>
                  <CheckCircle className="h-5 w-5 text-gray-300" />
                </div>
              </CardHeader>
              {step.code && (
                <CardContent>
                  <div className="relative">
                    <div className="bg-gray-900 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{step.code.language}</span>
                        <button
                          onClick={() => copyToClipboard(step.code!.content)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code>{step.code.content}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">What's Next?</CardTitle>
            <CardDescription>
              Now that you've sent your first message, explore these advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Campaign Management</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn how to create and manage SMS campaigns
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/guides/campaigns">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Delivery Tracking</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track message delivery and handle webhooks
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/guides/tracking">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">TCPA Compliance</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ensure your campaigns are compliant
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/guides/compliance">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Advanced Features</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Explore advanced API capabilities
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/guides/advanced">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold hub-text-primary mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you succeed with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">
              Contact Support
            </Button>
            <Button variant="outline">
              Join Community
            </Button>
            <Button variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}