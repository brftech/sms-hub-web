import { Link } from 'react-router-dom'
import { useHub, Button, Card, CardContent, Badge } from '@sms-hub/ui'
import { MessageSquare, Zap, Shield, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function Home() {
  const { hubConfig, currentHub } = useHub()

  const features = [
    {
      icon: MessageSquare,
      title: 'Enterprise SMS',
      description: 'Send bulk SMS messages with 99.9% delivery rates and real-time tracking.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Send thousands of messages per minute with our optimized infrastructure.',
    },
    {
      icon: Shield,
      title: 'TCPA Compliant',
      description: 'Built-in compliance tools to ensure your campaigns meet regulatory requirements.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed reporting and insights to optimize your messaging campaigns.',
    },
  ]

  const benefits = [
    'Multi-hub management for different brands',
    'Real-time delivery tracking and analytics',
    'TCPA and regulatory compliance built-in',
    'Enterprise-grade security and reliability',
    'Developer-friendly APIs and webhooks',
    '24/7 customer support',
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Powered by {hubConfig.displayName}
            </Badge>
            <h1 className="text-5xl font-bold hub-text-primary mb-6">
              Enterprise SMS Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Send, track, and optimize your SMS campaigns with our powerful, 
              compliant messaging platform designed for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="hub-bg-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/features">View Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold hub-text-primary mb-4">
              Everything you need for SMS success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to run 
              successful SMS campaigns at enterprise scale.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-full mb-4 hub-bg-primary/10`}>
                      <feature.icon className={`h-6 w-6 hub-text-primary`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold hub-text-primary mb-6">
                Why choose {hubConfig.displayName}?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our SMS platform is designed for businesses that need reliable, 
                scalable, and compliant messaging solutions.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 hub-text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-gray-900 rounded-lg p-6 text-white">
                <div className="text-sm text-gray-400 mb-2">// Sample API Response</div>
                <pre className="text-sm overflow-x-auto">
{`{
  "message_id": "msg_123abc",
  "status": "delivered",
  "to": "+1234567890",
  "delivery_time": "2024-01-15T10:30:00Z",
  "cost": 0.0075
}`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hub-bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of businesses using {hubConfig.displayName} to power their SMS campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}