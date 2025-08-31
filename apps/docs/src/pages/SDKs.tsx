import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Code, Copy, Download, ExternalLink, Github } from 'lucide-react'

export function SDKs() {
  const { hubConfig, currentHub } = useHub()
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

  const sdks = [
    {
      id: 'javascript',
      name: 'JavaScript/Node.js',
      version: '2.1.0',
      description: 'Official JavaScript SDK for Node.js and browser environments',
      install: `npm install @${currentHub}/sdk`,
      example: `import { SMSClient } from '@${currentHub}/sdk'

const client = new SMSClient({
  apiKey: 'your-api-key',
  hub: '${currentHub}'
})

const message = await client.messages.create({
  to: '+1234567890',
  body: 'Hello from ${hubConfig.displayName}!',
  from: '+1987654321'
})

console.log('Message sent:', message.id)`,
      features: ['Promise-based API', 'TypeScript support', 'Automatic retries', 'Built-in validation'],
      docs: '/docs/sdks/javascript',
      github: `https://github.com/${currentHub}/sdk-javascript`,
    },
    {
      id: 'python',
      name: 'Python',
      version: '1.8.0',
      description: 'Official Python SDK with async support',
      install: `pip install ${currentHub}-sdk`,
      example: `from ${currentHub} import Client

client = Client(
    api_key='your-api-key',
    hub='${currentHub}'
)

message = client.messages.create(
    to='+1234567890',
    body='Hello from ${hubConfig.displayName}!',
    from_='+1987654321'
)

print(f'Message sent: {message.id}')`,
      features: ['Async/await support', 'Type hints', 'Automatic pagination', 'Exception handling'],
      docs: '/docs/sdks/python',
      github: `https://github.com/${currentHub}/sdk-python`,
    },
    {
      id: 'php',
      name: 'PHP',
      version: '1.5.2',
      description: 'Official PHP SDK with Laravel integration',
      install: `composer require ${currentHub}/sdk`,
      example: `<?php
use ${hubConfig.displayName}\\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'hub' => '${currentHub}'
]);

$message = $client->messages->create([
    'to' => '+1234567890',
    'body' => 'Hello from ${hubConfig.displayName}!',
    'from' => '+1987654321'
]);

echo 'Message sent: ' . $message->id;`,
      features: ['Laravel service provider', 'Guzzle HTTP client', 'PSR-4 autoloading', 'Comprehensive testing'],
      docs: '/docs/sdks/php',
      github: `https://github.com/${currentHub}/sdk-php`,
    },
    {
      id: 'ruby',
      name: 'Ruby',
      version: '1.3.1',
      description: 'Official Ruby SDK with Rails integration',
      install: `gem install ${currentHub}`,
      example: `require '${currentHub}'

client = ${hubConfig.displayName}::Client.new(
  api_key: 'your-api-key',
  hub: '${currentHub}'
)

message = client.messages.create(
  to: '+1234567890',
  body: 'Hello from ${hubConfig.displayName}!',
  from: '+1987654321'
)

puts "Message sent: #{message.id}"`,
      features: ['Rails generators', 'ActiveRecord integration', 'Faraday HTTP client', 'RSpec testing'],
      docs: '/docs/sdks/ruby',
      github: `https://github.com/${currentHub}/sdk-ruby`,
    },
    {
      id: 'go',
      name: 'Go',
      version: '1.2.0',
      description: 'Official Go SDK with context support',
      install: `go get github.com/${currentHub}/sdk-go`,
      example: `package main

import (
    "context"
    "fmt"
    "${currentHub}/sdk-go"
)

func main() {
    client := ${currentHub}.NewClient("your-api-key", "${currentHub}")
    
    message, err := client.Messages.Create(context.Background(), &${currentHub}.MessageRequest{
        To:   "+1234567890",
        Body: "Hello from ${hubConfig.displayName}!",
        From: "+1987654321",
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Message sent: %s\\n", message.ID)
}`,
      features: ['Context support', 'Structured logging', 'Built-in retries', 'Comprehensive tests'],
      docs: '/docs/sdks/go',
      github: `https://github.com/${currentHub}/sdk-go`,
    },
    {
      id: 'csharp',
      name: 'C#/.NET',
      version: '1.1.0',
      description: 'Official .NET SDK with async/await support',
      install: `dotnet add package ${hubConfig.displayName}.SDK`,
      example: `using ${hubConfig.displayName}.SDK;

var client = new SMSClient("your-api-key", "${currentHub}");

var message = await client.Messages.CreateAsync(new MessageRequest
{
    To = "+1234567890",
    Body = "Hello from ${hubConfig.displayName}!",
    From = "+1987654321"
});

Console.WriteLine($"Message sent: {message.Id}");`,
      features: ['Async/await support', '.NET Standard 2.0', 'Dependency injection', 'NUnit testing'],
      docs: '/docs/sdks/csharp',
      github: `https://github.com/${currentHub}/sdk-csharp`,
    },
  ]

  const selectedSdk = sdks.find(sdk => sdk.id === selectedLanguage) || sdks[0]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            SDKs & Libraries
          </Badge>
          <h1 className="text-4xl font-bold hub-text-primary mb-6">
            Official SDKs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use our official SDKs to integrate {hubConfig.displayName} SMS into your applications. 
            Available for all popular programming languages.
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-8 flex justify-center">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a programming language" />
            </SelectTrigger>
            <SelectContent>
              {sdks.map((sdk) => (
                <SelectItem key={sdk.id} value={sdk.id}>
                  {sdk.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected SDK Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* SDK Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{selectedSdk.name}</CardTitle>
                <Badge variant="outline">v{selectedSdk.version}</Badge>
              </div>
              <CardDescription className="text-base">
                {selectedSdk.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Installation */}
                <div>
                  <h3 className="font-semibold mb-3">Installation</h3>
                  <div className="relative">
                    <div className="bg-gray-900 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Terminal</span>
                        <button
                          onClick={() => copyToClipboard(selectedSdk.install)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <pre className="text-sm">
                        <code>{selectedSdk.install}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {selectedSdk.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full hub-bg-primary mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Example</CardTitle>
              <CardDescription>
                Get started with this simple example
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="bg-gray-900 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{selectedSdk.name}</span>
                    <button
                      onClick={() => copyToClipboard(selectedSdk.example)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{selectedSdk.example}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All SDKs Overview */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold hub-text-primary mb-8 text-center">
            All Available SDKs
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sdks.map((sdk) => (
              <Card key={sdk.id} className={`transition-all ${selectedLanguage === sdk.id ? 'ring-2 hub-ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sdk.name}</CardTitle>
                    <Badge variant="outline">v{sdk.version}</Badge>
                  </div>
                  <CardDescription>{sdk.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button 
                      variant={selectedLanguage === sdk.id ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedLanguage(sdk.id)}
                      className={selectedLanguage === sdk.id ? 'hub-bg-primary' : ''}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      View Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community SDKs */}
        <section className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Community SDKs</CardTitle>
              <CardDescription>
                SDKs built and maintained by our developer community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Community-contributed SDKs for additional languages and frameworks
                </p>
                <Button variant="outline">
                  <Github className="h-4 w-4 mr-2" />
                  Contribute on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}