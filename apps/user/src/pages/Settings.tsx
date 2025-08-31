import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Separator } from '@sms-hub/ui'
import { User, Building, Phone, CreditCard, Bell, Shield, Key } from 'lucide-react'
import { useUserProfile, useCompany, usePhoneNumbers } from '@sms-hub/supabase'

export function Settings() {
  useHub() // Initialize hub context
  const { data: userProfile } = useUserProfile()
  const { data: company } = useCompany()
  const { data: phoneNumbers = [] } = usePhoneNumbers()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'phone', label: 'Phone Numbers', icon: Phone },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  defaultValue={userProfile?.first_name || ''}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  defaultValue={userProfile?.last_name || ''}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={userProfile?.email || ''}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={userProfile?.mobile_phone_number || ''}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Badge variant="secondary" className="ml-2">
                {userProfile?.role}
              </Badge>
            </div>
            <Button className="hub-bg-primary">
              Save Changes
            </Button>
          </div>
        )

      case 'company':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                defaultValue={company?.public_name || ''}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={company?.company_account_number || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select defaultValue={company?.industry || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company-size">Company Size</Label>
                <Select defaultValue={company?.size || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="hub-bg-primary">
              Save Changes
            </Button>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Phone Numbers</h3>
                <p className="text-muted-foreground">Manage your SMS sending numbers</p>
              </div>
              <Button className="hub-bg-primary">
                <Phone className="h-4 w-4 mr-2" />
                Add Number
              </Button>
            </div>

            {phoneNumbers.length > 0 ? (
              <div className="space-y-4">
                {phoneNumbers.map((phone) => (
                  <Card key={phone.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-lg">{phone.phone_number}</div>
                          <div className="text-sm text-muted-foreground">
                            {phone.assigned_to_campaign ? 'Assigned to campaign' : 'Available'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={phone.is_active ? 'default' : 'secondary'}
                            className={phone.is_active ? 'hub-bg-primary' : ''}
                          >
                            {phone.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No phone numbers</h3>
                  <p className="text-muted-foreground mb-4">
                    Add a phone number to start sending SMS messages
                  </p>
                  <Button className="hub-bg-primary">
                    <Phone className="h-4 w-4 mr-2" />
                    Get Your First Number
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Billing Information</h3>
              <p className="text-muted-foreground">Manage your payment methods and billing</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Starter Plan</div>
                    <div className="text-sm text-muted-foreground">
                      1,000 messages/month • $0.01 per additional message
                    </div>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Your current usage and remaining credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Messages sent</span>
                    <span className="font-medium">247 / 1,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="hub-bg-primary h-2 rounded-full" style={{ width: '24.7%' }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    753 messages remaining in your plan
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <p className="text-muted-foreground">Choose what notifications you want to receive</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Receive updates via email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="campaign-updates">Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when campaigns complete
                    </p>
                  </div>
                  <Switch id="campaign-updates" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="delivery-reports">Delivery Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Daily summary of message delivery
                    </p>
                  </div>
                  <Switch id="delivery-reports" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="billing-alerts">Billing Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about usage and billing
                    </p>
                  </div>
                  <Switch id="billing-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Button className="hub-bg-primary">
              Save Preferences
            </Button>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p className="text-muted-foreground">Manage your account security</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="hub-bg-primary">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Receive verification codes via SMS
                    </div>
                  </div>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-muted-foreground">Manage API keys for programmatic access</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Generate and manage API keys for integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Production Key</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        sk_prod_••••••••••••••••
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Active</Badge>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="hub-bg-primary">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhooks for real-time events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhooks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Events</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="message-delivered" />
                        <Label htmlFor="message-delivered">Message Delivered</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="message-failed" />
                        <Label htmlFor="message-failed">Message Failed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="campaign-completed" />
                        <Label htmlFor="campaign-completed">Campaign Completed</Label>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    Save Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          Manage your account preferences and configuration
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