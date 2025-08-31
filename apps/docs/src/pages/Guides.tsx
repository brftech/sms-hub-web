import { Link } from 'react-router-dom'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@sms-hub/ui'
import { ArrowRight, MessageSquare, Users, Shield, Zap, BarChart3, Webhook } from 'lucide-react'

export function Guides() {
  const { hubConfig } = useHub()

  const guideCategories = [
    {
      title: 'Getting Started',
      description: 'Essential guides to get you up and running quickly',
      guides: [
        {
          title: 'Quick Start Guide',
          description: 'Send your first SMS in under 5 minutes',
          icon: Zap,
          href: '/getting-started',
          difficulty: 'Beginner',
          time: '5 min',
        },
        {
          title: 'Authentication',
          description: 'Learn how to authenticate with our API',
          icon: Shield,
          href: '/guides/authentication',
          difficulty: 'Beginner',
          time: '10 min',
        },
        {
          title: 'Error Handling',
          description: 'Handle API errors gracefully in your application',
          icon: MessageSquare,
          href: '/guides/error-handling',
          difficulty: 'Intermediate',
          time: '15 min',
        },
      ],
    },
    {
      title: 'Messaging',
      description: 'Everything about sending and managing SMS messages',
      guides: [
        {
          title: 'Sending Messages',
          description: 'Send single and bulk SMS messages',
          icon: MessageSquare,
          href: '/guides/sending-messages',
          difficulty: 'Beginner',
          time: '10 min',
        },
        {
          title: 'Message Templates',
          description: 'Create reusable message templates',
          icon: MessageSquare,
          href: '/guides/templates',
          difficulty: 'Intermediate',
          time: '20 min',
        },
        {
          title: 'Delivery Tracking',
          description: 'Track message delivery and handle status updates',
          icon: BarChart3,
          href: '/guides/tracking',
          difficulty: 'Intermediate',
          time: '25 min',
        },
      ],
    },
    {
      title: 'Campaign Management',
      description: 'Create and manage SMS campaigns effectively',
      guides: [
        {
          title: 'Creating Campaigns',
          description: 'Set up and launch SMS campaigns',
          icon: Zap,
          href: '/guides/campaigns',
          difficulty: 'Intermediate',
          time: '30 min',
        },
        {
          title: 'Scheduling Messages',
          description: 'Schedule messages for optimal delivery times',
          icon: BarChart3,
          href: '/guides/scheduling',
          difficulty: 'Intermediate',
          time: '20 min',
        },
        {
          title: 'A/B Testing',
          description: 'Test different message variants for better performance',
          icon: BarChart3,
          href: '/guides/ab-testing',
          difficulty: 'Advanced',
          time: '45 min',
        },
      ],
    },
    {
      title: 'Contact Management',
      description: 'Manage your contact lists and ensure compliance',
      guides: [
        {
          title: 'Managing Contacts',
          description: 'Add, update, and organize your contact lists',
          icon: Users,
          href: '/guides/contacts',
          difficulty: 'Beginner',
          time: '15 min',
        },
        {
          title: 'Segmentation',
          description: 'Create targeted segments for better campaigns',
          icon: Users,
          href: '/guides/segmentation',
          difficulty: 'Intermediate',
          time: '25 min',
        },
        {
          title: 'Opt-in/Opt-out Management',
          description: 'Handle subscription preferences and compliance',
          icon: Shield,
          href: '/guides/opt-management',
          difficulty: 'Advanced',
          time: '35 min',
        },
      ],
    },
    {
      title: 'Advanced Features',
      description: 'Advanced features for power users and developers',
      guides: [
        {
          title: 'Webhooks',
          description: 'Receive real-time updates about your messages',
          icon: Webhook,
          href: '/guides/webhooks',
          difficulty: 'Advanced',
          time: '30 min',
        },
        {
          title: 'Rate Limiting',
          description: 'Understand and work with API rate limits',
          icon: Zap,
          href: '/guides/rate-limiting',
          difficulty: 'Advanced',
          time: '20 min',
        },
        {
          title: 'Multi-Hub Setup',
          description: 'Manage multiple hubs and brands',
          icon: Shield,
          href: '/guides/multi-hub',
          difficulty: 'Advanced',
          time: '40 min',
        },
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Developer Guides
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Comprehensive Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Step-by-step tutorials and guides to help you master the {hubConfig.displayName} platform.
            From basic concepts to advanced implementations.
          </p>
        </div>

        <div className="space-y-12">
          {guideCategories.map((category) => (
            <section key={category.title}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold hub-text-primary mb-2">
                  {category.title}
                </h2>
                <p className="text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.guides.map((guide) => (
                  <Card key={guide.title} className="h-full hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg hub-bg-primary/10`}>
                          <guide.icon className={`h-5 w-5 hub-text-primary`} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {guide.time}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:hub-text-primary transition-colors">
                        {guide.title}
                      </CardTitle>
                      <CardDescription>
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link 
                        to={guide.href}
                        className="inline-flex items-center text-sm font-medium hub-text-primary hover:opacity-80 transition-opacity"
                      >
                        Read Guide
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Need More Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help from other developers
                </p>
                <Link to="#" className="text-sm font-medium hub-text-primary hover:opacity-80">
                  Visit Forum →
                </Link>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Support Tickets</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get direct help from our team
                </p>
                <Link to="/contact" className="text-sm font-medium hub-text-primary hover:opacity-80">
                  Contact Support →
                </Link>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Schedule Demo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get a personalized walkthrough
                </p>
                <Link to="#" className="text-sm font-medium hub-text-primary hover:opacity-80">
                  Book Demo →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}