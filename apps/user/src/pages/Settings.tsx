import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Separator } from '@sms-hub/ui'
import { User, Building, Phone, CreditCard, Bell, Shield, Key, ChevronRight } from 'lucide-react'
import { useUserProfile, useCurrentUserCompany, useCurrentUserPhoneNumbers, useBrands, useCurrentUserCampaigns } from '@sms-hub/supabase/react'
import styled from 'styled-components'

const PageContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const SidebarCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  height: fit-content;
  min-width: 260px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const MainCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  flex: 1;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: none;
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4b5563'};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#3b82f6' : '#f3f4f6'};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
`;

const SwitchInfo = styled.div`
  flex: 1;
`;

const SwitchLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.125rem;
`;

const SwitchDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const InfoCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  margin-bottom: 0.75rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
  margin: 0.75rem 0;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background: #3b82f6;
  transition: width 0.3s ease;
`;

export function Settings() {
  useHub() // Initialize hub context
  const { data: userProfile } = useUserProfile()
  const { data: company } = useCurrentUserCompany()
  const { data: phoneNumbers = [] } = useCurrentUserPhoneNumbers()
  const { data: brands = [] } = useBrands(company?.id || '')
  const { data: campaigns = [] } = useCurrentUserCampaigns()
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
          <FormSection>
            <FormRow>
              <FormGroup>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  defaultValue={userProfile?.first_name || ''}
                  placeholder="Enter first name"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  defaultValue={userProfile?.last_name || ''}
                  placeholder="Enter last name"
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={userProfile?.email || ''}
                placeholder="Enter email"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={userProfile?.mobile_phone_number || ''}
                placeholder="Enter phone number"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Account Details</Label>
              <InfoCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Account Number:</span>
                  <Badge variant="secondary">{userProfile?.account_number || 'Not assigned'}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Role:</span>
                  <Badge variant="secondary">{userProfile?.role || 'Member'}</Badge>
                </div>
              </InfoCard>
            </FormGroup>
            
            <Button style={{ background: '#3b82f6', color: 'white', width: 'fit-content' }}>
              Save Changes
            </Button>
          </FormSection>
        )

      case 'company':
        return (
          <FormSection>
            <FormGroup>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                defaultValue={company?.public_name || ''}
                placeholder="Enter company name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="account-number">Company Account Number</Label>
              <Input
                id="account-number"
                value={company?.company_account_number || ''}
                disabled
                style={{ background: '#f9fafb', cursor: 'not-allowed' }}
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
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
              </FormGroup>
              
              <FormGroup>
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
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                defaultValue={company?.website || ''}
                placeholder="https://example.com"
              />
            </FormGroup>
            
            <Button style={{ background: '#3b82f6', color: 'white', width: 'fit-content' }}>
              Save Changes
            </Button>
          </FormSection>
        )

      case 'phone':
        return (
          <FormSection>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                  Phone Numbers
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Manage your SMS sending numbers
                </p>
              </div>
              <Button style={{ background: '#3b82f6', color: 'white' }}>
                <Phone className="h-4 w-4 mr-2" />
                Add Number
              </Button>
            </div>

            {phoneNumbers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {phoneNumbers.map((phone) => (
                  <Card key={phone.id} style={{ border: '1px solid #e5e7eb' }}>
                    <CardContent className="p-4">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                            {phone.phone_number}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {phone.assigned_to_campaign ? `Assigned to campaign` : 'Available for use'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Badge style={{
                            background: phone.is_active ? '#dcfce7' : '#f3f4f6',
                            color: phone.is_active ? '#166534' : '#6b7280',
                            border: 'none'
                          }}>
                            {phone.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card style={{ border: '1px solid #e5e7eb' }}>
                <CardContent className="text-center py-8">
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" style={{ color: '#9ca3af' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                    No phone numbers
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    Add a phone number to start sending SMS messages
                  </p>
                  <Button style={{ background: '#3b82f6', color: 'white' }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Get Your First Number
                  </Button>
                </CardContent>
              </Card>
            )}
          </FormSection>
        )

      case 'billing':
        return (
          <FormSection>
            <Card style={{ border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>Starter Plan</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      1,000 messages/month • $0.01 per additional message
                    </div>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card style={{ border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Your current usage and remaining credits</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const messagesUsed = campaigns.reduce((acc, c) => acc + (c.metadata?.message_count || 0), 0);
                  const messageLimit = 1000;
                  const percentage = Math.min((messagesUsed / messageLimit) * 100, 100);
                  const remaining = Math.max(messageLimit - messagesUsed, 0);
                  
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Messages sent</span>
                        <span style={{ fontWeight: 600, color: '#1f2937' }}>
                          {messagesUsed.toLocaleString()} / {messageLimit.toLocaleString()}
                        </span>
                      </div>
                      <ProgressBar>
                        <ProgressFill $percent={percentage} />
                      </ProgressBar>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        {remaining.toLocaleString()} messages remaining in your plan
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </FormSection>
        )

      case 'notifications':
        return (
          <FormSection>
            <Card style={{ border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Receive updates via email</CardDescription>
              </CardHeader>
              <CardContent>
                <SwitchRow>
                  <SwitchInfo>
                    <SwitchLabel>Campaign Updates</SwitchLabel>
                    <SwitchDescription>Get notified when campaigns complete</SwitchDescription>
                  </SwitchInfo>
                  <Switch defaultChecked />
                </SwitchRow>
                
                <Separator />
                
                <SwitchRow>
                  <SwitchInfo>
                    <SwitchLabel>Delivery Reports</SwitchLabel>
                    <SwitchDescription>Daily summary of message delivery</SwitchDescription>
                  </SwitchInfo>
                  <Switch defaultChecked />
                </SwitchRow>
                
                <Separator />
                
                <SwitchRow>
                  <SwitchInfo>
                    <SwitchLabel>Billing Alerts</SwitchLabel>
                    <SwitchDescription>Notifications about usage and billing</SwitchDescription>
                  </SwitchInfo>
                  <Switch defaultChecked />
                </SwitchRow>
                
                <Separator />
                
                <SwitchRow>
                  <SwitchInfo>
                    <SwitchLabel>Product Updates</SwitchLabel>
                    <SwitchDescription>New features and improvements</SwitchDescription>
                  </SwitchInfo>
                  <Switch />
                </SwitchRow>
              </CardContent>
            </Card>
            
            <Button style={{ background: '#3b82f6', color: 'white', width: 'fit-content' }}>
              Save Preferences
            </Button>
          </FormSection>
        )

      case 'security':
        return (
          <FormSection>
            <Card style={{ border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <FormSection>
                  <FormGroup>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </FormGroup>
                  <Button style={{ background: '#3b82f6', color: 'white', width: 'fit-content' }}>
                    Update Password
                  </Button>
                </FormSection>
              </CardContent>
            </Card>

            <Card style={{ border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                      SMS Authentication
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive verification codes via SMS
                    </div>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </FormSection>
        )

      case 'api':
        return (
          <FormSection>
            <Card style={{ border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Generate and manage API keys for integration</CardDescription>
              </CardHeader>
              <CardContent>
                <InfoRow>
                  <div>
                    <InfoLabel>Production Key</InfoLabel>
                    <InfoValue>sk_prod_••••••••••••••••</InfoValue>
                  </div>
                  <ActionButtons>
                    <Badge variant="secondary">Active</Badge>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </ActionButtons>
                </InfoRow>
                
                <Button style={{ background: '#3b82f6', color: 'white', marginTop: '1rem' }}>
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </CardContent>
            </Card>

            <Card style={{ border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configure webhooks for real-time events</CardDescription>
              </CardHeader>
              <CardContent>
                <FormSection>
                  <FormGroup>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhooks"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Events</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <input type="checkbox" />
                        Message Delivered
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <input type="checkbox" />
                        Message Failed
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <input type="checkbox" />
                        Campaign Completed
                      </label>
                    </div>
                  </FormGroup>
                  
                  <Button variant="outline" style={{ width: 'fit-content' }}>
                    Save Webhook
                  </Button>
                </FormSection>
              </CardContent>
            </Card>
          </FormSection>
        )

      default:
        return (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <p style={{ color: '#6b7280' }}>This section is coming soon</p>
          </div>
        )
    }
  }

  return (
    <PageContainer>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Manage your account preferences and configuration</Subtitle>
      </Header>

      <ContentWrapper>
        <SidebarCard>
          <CardContent className="p-4">
            <NavMenu>
              {tabs.map((tab) => (
                <NavItem
                  key={tab.id}
                  $active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon />
                  {tab.label}
                </NavItem>
              ))}
            </NavMenu>
          </CardContent>
        </SidebarCard>

        <MainCard>
          <CardContent className="p-6">
            {renderTabContent()}
          </CardContent>
        </MainCard>
      </ContentWrapper>
    </PageContainer>
  )
}