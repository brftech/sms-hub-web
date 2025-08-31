'use client'

import { useHub, HubLogo, HubSwitcher, Button } from '@sms-hub/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import Link from 'next/link'

export default function HomePage() {
  const { hubConfig, currentHub } = useHub()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <HubLogo hubType={currentHub} variant="full" size="lg" />
          <HubSwitcher />
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 hub-text-primary">
              {hubConfig.content.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {hubConfig.content.heroSubtitle}
            </p>
            <Button asChild className="hub-bg-primary hover:hub-bg-primary/90">
              <a href={`${process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3004'}/signup`}>{hubConfig.content.ctaText}</a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {hubConfig.content.features.map((feature, index) => (
              <Card key={index} className="hub-border-primary/20">
                <CardHeader>
                  <CardTitle className="hub-text-primary">{feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Experience the power of {feature.toLowerCase()} with {hubConfig.displayName}.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Ready to start your SMS journey with {hubConfig.displayName}?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full hub-bg-primary">
                  <a href={`${process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3004'}/signup`}>Create Account</a>
                </Button>
                <Button asChild variant="outline" className="w-full hub-border-primary hub-text-primary">
                  <Link href="/verify">Request Demo</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learn More</CardTitle>
                <CardDescription>
                  Explore our documentation and support resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs">Documentation</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}