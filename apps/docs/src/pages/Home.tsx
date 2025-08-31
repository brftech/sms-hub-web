import { Link } from 'react-router-dom'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@sms-hub/ui'
import { ArrowRight, Book, Code, Zap, MessageSquare, Users, Shield } from 'lucide-react'

export function Home() {
  const { hubConfig, currentHub } = useHub()

  const quickStart = [
    {
      title: '1. Get API Keys',
      description: 'Sign up and generate your API credentials',
      href: '/getting-started#api-keys',
    },
    {
      title: '2. Install SDK',
      description: 'Install our SDK in your preferred language',
      href: '/sdks',
    },
    {
      title: '3. Send First SMS',
      description: 'Send your first message in minutes',
      href: '/getting-started#first-message',
    },
  ]

  const popularGuides = [
    {
      title: 'Authentication',
      description: 'Learn how to authenticate with our API',
      icon: Shield,
      href: '/guides/authentication',
    },
    {
      title: 'Sending Messages',
      description: 'Send single and bulk SMS messages',
      icon: MessageSquare,
      href: '/guides/sending-messages',
    },
    {
      title: 'Webhooks',
      description: 'Receive real-time delivery updates',
      icon: Zap,
      href: '/guides/webhooks',
    },
    {
      title: 'Contact Management',
      description: 'Manage your contact lists and segments',
      icon: Users,
      href: '/guides/contacts',
    },
  ]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {hubConfig.displayName} Documentation
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Developer Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to integrate SMS messaging into your applications. 
            From quick start guides to comprehensive API references.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hub-bg-primary" asChild>
              <Link to="/getting-started">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/api">
                <Code className="mr-2 h-4 w-4" />
                API Reference
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold hub-text-primary mb-8 text-center">
            Quick Start Guide
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {quickStart.map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full hub-bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <CardTitle className="text-lg pr-12">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={step.href}>
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Guides */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold hub-text-primary mb-8 text-center">
            Popular Guides
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {popularGuides.map((guide) => (
              <Card key={guide.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg hub-bg-primary/10`}>
                      <guide.icon className={`h-5 w-5 hub-text-primary`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" asChild className="p-0 h-auto font-medium hub-text-primary">
                    <Link to={guide.href}>
                      Read Guide
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Send SMS in seconds</CardTitle>
              <CardDescription>
                Simple, powerful API that gets you sending messages immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-6 text-white">
                <div className="text-sm text-gray-400 mb-2">// Send an SMS message</div>
                <pre className="text-sm overflow-x-auto">
{`curl -X POST "https://api.${currentHub}.com/v1/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "body": "Hello from ${hubConfig.displayName}!",
    "from": "+1987654321"
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-2xl font-bold hub-text-primary mb-8 text-center">
            Additional Resources
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2 hub-text-primary" />
                  Tutorials
                </CardTitle>
                <CardDescription>
                  Step-by-step guides for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/guides">
                    Browse Tutorials
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 hub-text-primary" />
                  Code Examples
                </CardTitle>
                <CardDescription>
                  Ready-to-use code samples and snippets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  View Examples
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 hub-text-primary" />
                  Community
                </CardTitle>
                <CardDescription>
                  Get help from our developer community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  Join Community
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}