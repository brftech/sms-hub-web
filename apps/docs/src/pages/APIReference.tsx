import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Code, Copy, ArrowRight } from 'lucide-react'

export function APIReference() {
  const { hubConfig, currentHub } = useHub()
  const [selectedEndpoint, setSelectedEndpoint] = useState('send-message')

  const endpoints = [
    {
      id: 'send-message',
      category: 'Messages',
      method: 'POST',
      path: '/v1/messages',
      title: 'Send Message',
      description: 'Send a single SMS message',
    },
    {
      id: 'get-message',
      category: 'Messages',
      method: 'GET',
      path: '/v1/messages/{id}',
      title: 'Get Message',
      description: 'Retrieve a specific message by ID',
    },
    {
      id: 'list-messages',
      category: 'Messages',
      method: 'GET',
      path: '/v1/messages',
      title: 'List Messages',
      description: 'List all messages with pagination',
    },
    {
      id: 'create-campaign',
      category: 'Campaigns',
      method: 'POST',
      path: '/v1/campaigns',
      title: 'Create Campaign',
      description: 'Create a new SMS campaign',
    },
    {
      id: 'list-campaigns',
      category: 'Campaigns',
      method: 'GET',
      path: '/v1/campaigns',
      title: 'List Campaigns',
      description: 'List all campaigns',
    },
    {
      id: 'list-contacts',
      category: 'Contacts',
      method: 'GET',
      path: '/v1/contacts',
      title: 'List Contacts',
      description: 'List all contacts',
    },
    {
      id: 'create-contact',
      category: 'Contacts',
      method: 'POST',
      path: '/v1/contacts',
      title: 'Create Contact',
      description: 'Add a new contact',
    },
  ]

  const categories = [...new Set(endpoints.map(e => e.category))]
  
  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint)

  const getEndpointExample = (endpointId: string) => {
    switch (endpointId) {
      case 'send-message':
        return {
          request: `curl -X POST "https://api.${currentHub}.com/v1/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "body": "Hello from ${hubConfig.displayName}!",
    "from": "+1987654321"
  }'`,
          response: `{
  "id": "msg_123abc456def",
  "to": "+1234567890",
  "from": "+1987654321",
  "body": "Hello from ${hubConfig.displayName}!",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "cost": 0.0075
}`
        }
      case 'get-message':
        return {
          request: `curl -X GET "https://api.${currentHub}.com/v1/messages/msg_123abc456def" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          response: `{
  "id": "msg_123abc456def",
  "to": "+1234567890",
  "from": "+1987654321",
  "body": "Hello from ${hubConfig.displayName}!",
  "status": "delivered",
  "sent_at": "2024-01-15T10:30:00Z",
  "delivered_at": "2024-01-15T10:30:05Z",
  "cost": 0.0075
}`
        }
      default:
        return {
          request: `curl -X ${selectedEndpointData?.method} "https://api.${currentHub}.com${selectedEndpointData?.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          response: `{
  "message": "API documentation coming soon"
}`
        }
    }
  }

  const example = getEndpointExample(selectedEndpoint)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            API Reference
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            {hubConfig.displayName} API
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete reference for the {hubConfig.displayName} SMS API. 
            Send messages, manage campaigns, and track delivery programmatically.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
                <CardDescription>Browse API endpoints by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {endpoints
                          .filter(e => e.category === category)
                          .map((endpoint) => (
                            <button
                              key={endpoint.id}
                              onClick={() => setSelectedEndpoint(endpoint.id)}
                              className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                selectedEndpoint === endpoint.id
                                  ? 'hub-bg-primary text-white'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                    endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {endpoint.method}
                                </Badge>
                                <span className="truncate">{endpoint.title}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {selectedEndpointData && (
              <div className="space-y-6">
                {/* Endpoint Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={`${
                          selectedEndpointData.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          selectedEndpointData.method === 'POST' ? 'bg-green-100 text-green-800' :
                          selectedEndpointData.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedEndpointData.method}
                      </Badge>
                      <CardTitle className="text-2xl">{selectedEndpointData.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {selectedEndpointData.description}
                    </CardDescription>
                    <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                      https://api.{currentHub}.com{selectedEndpointData.path}
                    </div>
                  </CardHeader>
                </Card>

                {/* Request Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Request Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="bg-gray-900 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">curl</span>
                          <button
                            onClick={() => copyToClipboard(example.request)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <pre className="text-sm overflow-x-auto">
                          <code>{example.request}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Example */}
                <Card>
                  <CardHeader>
                    <CardTitle>Response Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="bg-gray-900 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">200 OK</span>
                          <button
                            onClick={() => copyToClipboard(example.response)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <pre className="text-sm overflow-x-auto">
                          <code>{example.response}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parameters (if applicable) */}
                {selectedEndpoint === 'send-message' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium border-b pb-2">
                          <div className="col-span-3">Parameter</div>
                          <div className="col-span-2">Type</div>
                          <div className="col-span-2">Required</div>
                          <div className="col-span-5">Description</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-sm py-2">
                          <div className="col-span-3 font-mono">to</div>
                          <div className="col-span-2">string</div>
                          <div className="col-span-2">Yes</div>
                          <div className="col-span-5">Recipient phone number in E.164 format</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-sm py-2">
                          <div className="col-span-3 font-mono">body</div>
                          <div className="col-span-2">string</div>
                          <div className="col-span-2">Yes</div>
                          <div className="col-span-5">Message content (max 1600 characters)</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-sm py-2">
                          <div className="col-span-3 font-mono">from</div>
                          <div className="col-span-2">string</div>
                          <div className="col-span-2">Yes</div>
                          <div className="col-span-5">Sender phone number</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-sm py-2">
                          <div className="col-span-3 font-mono">campaign_id</div>
                          <div className="col-span-2">string</div>
                          <div className="col-span-2">No</div>
                          <div className="col-span-5">Associate message with a campaign</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Authentication Info */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              All API requests require authentication using your API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="text-sm text-gray-400 mb-2">Authorization Header</div>
              <pre className="text-sm">
                <code>Authorization: Bearer YOUR_API_KEY</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              You can find your API keys in your dashboard under Settings → API Keys.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}