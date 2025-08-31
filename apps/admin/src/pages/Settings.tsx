import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Separator } from '@sms-hub/ui'
import { Settings as SettingsIcon, Database, Mail, Phone, Key, Shield, Bell } from 'lucide-react'
import { useAdminSettings } from '@sms-hub/supabase'

export function Settings() {
  const { hubConfig } = useHub()
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const { data: settings } = useAdminSettings(hubConfig.hubNumber)

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'sms', label: 'SMS Config', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API', icon: Key },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hub-name">Hub Display Name</Label>
              <Input
                id="hub-name"
                defaultValue={hubConfig.displayName}
                placeholder="Hub display name"
              />
            </div>
            <div>
              <Label htmlFor="hub-description">Hub Description</Label>
              <Input
                id="hub-description"
                defaultValue={settings?.description || ''}
                placeholder="Hub description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input
                  id="primary-color"
                  type="color"
                  defaultValue={hubConfig.primaryColor}
                />
              </div>
              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input
                  id="secondary-color"
                  type="color"
                  defaultValue={hubConfig.secondaryColor}
                />
              </div>
            </div>
            <Button className="hub-bg-primary">
              Save Changes
            </Button>
          </div>
        )

      case 'sms':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">SMS Gateway Configuration</h3>
              <p className="text-muted-foreground">Manage SMS provider settings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bandwidth Settings</CardTitle>
                <CardDescription>Configure Bandwidth API credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bandwidth-user-id">User ID</Label>
                  <Input
                    id="bandwidth-user-id"
                    defaultValue={settings?.bandwidth_user_id || ''}
                    placeholder="Bandwidth User ID"
                  />
                </div>
                <div>
                  <Label htmlFor="bandwidth-api-token">API Token</Label>
                  <Input
                    id="bandwidth-api-token"
                    type="password"
                    defaultValue={settings?.bandwidth_api_token ? '••••••••' : ''}
                    placeholder="Bandwidth API Token"
                  />
                </div>
                <div>
                  <Label htmlFor="bandwidth-api-secret">API Secret</Label>
                  <Input
                    id="bandwidth-api-secret"
                    type="password"
                    defaultValue={settings?.bandwidth_api_secret ? '••••••••' : ''}
                    placeholder="Bandwidth API Secret"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Limits</CardTitle>
                <CardDescription>Configure sending limits and throttling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-limit">Daily Message Limit</Label>
                    <Input
                      id="daily-limit"
                      type="number"
                      defaultValue={settings?.daily_message_limit || 10000}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      defaultValue={settings?.rate_limit_per_minute || 100}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-retry"
                    defaultChecked={settings?.auto_retry_failed || false}
                  />
                  <Label htmlFor="auto-retry">Auto-retry failed messages</Label>
                </div>
              </CardContent>
            </Card>

            <Button className="hub-bg-primary">
              Save SMS Configuration
            </Button>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p className="text-muted-foreground">Configure platform security policies</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>User authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require-2fa">Require 2FA for Admins</Label>
                    <p className="text-sm text-muted-foreground">
                      Force two-factor authentication for admin users
                    </p>
                  </div>
                  <Switch
                    id="require-2fa"
                    defaultChecked={settings?.require_2fa_admin || false}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Select defaultValue={settings?.session_timeout || '24h'}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all administrative actions
                    </p>
                  </div>
                  <Switch
                    id="audit-logging"
                    defaultChecked={settings?.audit_logging || true}
                  />
                </div>
              </CardContent>
            </Card>

            <Button className="hub-bg-primary">
              Save Security Settings
            </Button>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This section is coming soon
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold hub-text-primary">Settings</h1>
        <p className="text-muted-foreground">
          Configure {hubConfig.displayName} platform settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-64">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'hub-bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}