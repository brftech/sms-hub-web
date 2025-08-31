import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@sms-hub/ui'
import { Check, Zap, Crown, Building, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function Pricing() {
  const { hubConfig } = useHub()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with SMS',
      icon: Zap,
      price: { monthly: 29, annual: 24 },
      features: [
        '1,000 messages/month included',
        'Basic analytics and reporting',
        'Email support',
        'TCPA compliance tools',
        'Single phone number',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For growing businesses with higher volume needs',
      icon: Crown,
      price: { monthly: 99, annual: 82 },
      features: [
        '10,000 messages/month included',
        'Advanced analytics and insights',
        'Priority phone & chat support',
        'Multiple phone numbers (up to 5)',
        'Campaign automation',
        'Custom webhooks',
        'Dedicated account manager',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom requirements',
      icon: Building,
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Custom message volume',
        'White-label branding',
        'Dedicated infrastructure',
        'SLA guarantees',
        '24/7 phone support',
        'Custom integrations',
        'Advanced security features',
        'Compliance consulting',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const additionalPricing = [
    { item: 'Additional messages', price: '$0.0075 per message' },
    { item: 'Extra phone numbers', price: '$5 per number/month' },
    { item: 'Premium support', price: '$50 per month' },
    { item: 'Custom integrations', price: 'Contact for pricing' },
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
            {hubConfig.displayName} Pricing
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business needs. All plans include our core SMS features 
            with no hidden fees or setup costs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'hub-bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'annual' ? 'font-medium' : 'text-muted-foreground'}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={plan.popular ? 'relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="hub-bg-primary">Most Popular</Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'ring-2 hub-ring-primary shadow-lg' : ''}`}>
                <CardHeader className="text-center">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    plan.popular ? 'hub-bg-primary' : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`h-6 w-6 ${
                      plan.popular ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold hub-text-primary">
                      {typeof plan.price[billingCycle] === 'string' 
                        ? plan.price[billingCycle] 
                        : `$${plan.price[billingCycle]}`
                      }
                    </div>
                    {typeof plan.price[billingCycle] !== 'string' && (
                      <div className="text-muted-foreground">
                        per month, billed {billingCycle}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 hub-text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular ? 'hub-bg-primary' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Additional Services</CardTitle>
              <CardDescription>
                Expand your capabilities with these optional add-ons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {additionalPricing.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">{item.item}</span>
                    <span className="hub-text-primary font-semibold">{item.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold hub-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 text-left max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my message limit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Additional messages are automatically charged at our standard overage rate. 
                  You can set spending limits to control costs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect on your next billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer volume discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer custom pricing for high-volume senders. 
                  Contact our sales team to discuss your requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No setup fees! All plans include free onboarding and account setup. 
                  You only pay for what you use.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}