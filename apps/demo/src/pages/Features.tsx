import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@sms-hub/ui'
import { MessageSquare, Zap, Shield, BarChart3, Users, Phone, Globe, Code } from 'lucide-react'
import { motion } from 'framer-motion'

export function Features() {
  const { hubConfig } = useHub()

  const featureCategories = [
    {
      title: 'Messaging & Delivery',
      features: [
        {
          icon: MessageSquare,
          title: 'Bulk SMS Sending',
          description: 'Send thousands of messages simultaneously with our optimized delivery engine.',
          highlights: ['99.9% delivery rate', 'Global reach', 'Real-time tracking']
        },
        {
          icon: Zap,
          title: 'Lightning Fast Processing',
          description: 'Process and deliver messages at incredible speeds with minimal latency.',
          highlights: ['1000+ messages/minute', 'Sub-second processing', 'Auto-scaling']
        },
        {
          icon: Phone,
          title: 'Multiple Phone Numbers',
          description: 'Manage multiple sending numbers for different campaigns and use cases.',
          highlights: ['Local & toll-free numbers', 'Number pooling', 'Dedicated lines']
        },
      ]
    },
    {
      title: 'Compliance & Security',
      features: [
        {
          icon: Shield,
          title: 'TCPA Compliance',
          description: 'Built-in tools to ensure your campaigns meet all regulatory requirements.',
          highlights: ['Opt-in/opt-out management', 'Consent tracking', 'Compliance reporting']
        },
        {
          icon: Users,
          title: 'Contact Management',
          description: 'Sophisticated contact management with segmentation and consent tracking.',
          highlights: ['Smart segmentation', 'Import/export tools', 'Duplicate detection']
        },
      ]
    },
    {
      title: 'Analytics & Reporting',
      features: [
        {
          icon: BarChart3,
          title: 'Advanced Analytics',
          description: 'Comprehensive reporting and insights to optimize your campaigns.',
          highlights: ['Real-time dashboards', 'Custom reports', 'ROI tracking']
        },
        {
          icon: Globe,
          title: 'Multi-Hub Management',
          description: 'Manage multiple brands and businesses from a single platform.',
          highlights: ['Brand isolation', 'Custom branding', 'Centralized billing']
        },
      ]
    },
    {
      title: 'Developer Tools',
      features: [
        {
          icon: Code,
          title: 'Developer APIs',
          description: 'RESTful APIs and webhooks for seamless integration with your systems.',
          highlights: ['REST & GraphQL APIs', 'Real-time webhooks', 'SDKs available']
        },
      ]
    },
  ]

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            {hubConfig.displayName} Features
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Powerful SMS Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to run successful SMS campaigns at enterprise scale, 
            with the compliance and reliability your business demands.
          </p>
        </motion.div>

        <div className="space-y-16">
          {featureCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              <h2 className="text-2xl font-bold hub-text-primary mb-8 text-center">
                {category.title}
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (categoryIndex * 0.2) + (featureIndex * 0.1) }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`inline-flex p-3 rounded-full mb-4 hub-bg-primary/10`}>
                          <feature.icon className={`h-6 w-6 hub-text-primary`} />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 hub-text-primary mr-2 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24"
        >
          <Card className="hub-border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl hub-text-primary">
                Easy Integration
              </CardTitle>
              <CardDescription className="text-lg">
                Get started with just a few lines of code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-6 text-white">
                <div className="text-sm text-gray-400 mb-2">// Send your first SMS</div>
                <pre className="text-sm overflow-x-auto">
{`import { SMSClient } from '@${currentHub}/sdk'

const client = new SMSClient({
  apiKey: 'your-api-key',
  hub: '${currentHub}'
})

await client.messages.create({
  to: '+1234567890',
  body: 'Hello from ${hubConfig.displayName}!',
  from: '+1987654321'
})`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-24"
        >
          <h2 className="text-3xl font-bold hub-text-primary mb-4">
            Ready to transform your messaging?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your free trial today and see why businesses trust {hubConfig.displayName}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hub-bg-primary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}