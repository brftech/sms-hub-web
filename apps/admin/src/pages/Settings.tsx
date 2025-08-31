import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Separator } from '@sms-hub/ui'
import { Settings as SettingsIcon, Database, Mail, Phone, Key, Shield, Bell } from 'lucide-react'
import { useAdminSettings } from '@sms-hub/supabase'
import styled from 'styled-components'

const PageContainer = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const SidebarCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  
  @media (min-width: 1024px) {
    width: 256px;
    flex-shrink: 0;
  }
`

const SidebarContent = styled(CardContent)`
  padding: 1rem;
`

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const NavButton = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  
  ${props => props.$active ? `
    background: #3b82f6;
    color: white;
  ` : `
    color: #4b5563;
    background: transparent;
    
    &:hover {
      background: #f3f4f6;
    }
  `}
`

const MainContentCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  flex: 1;
`

const MainContent = styled(CardContent)`
  padding: 1.5rem;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const SettingCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 1.5rem;
`

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`

const SettingInfo = styled.div`
  flex: 1;
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
  }
`

const ActionButton = styled(Button)`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`

const PlaceholderContent = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`

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
          <FormSection>
            <FormGroup>
              <Label htmlFor="hub-name">Hub Display Name</Label>
              <Input
                id="hub-name"
                defaultValue={hubConfig.displayName}
                placeholder="Hub display name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="hub-description">Hub Description</Label>
              <Input
                id="hub-description"
                defaultValue={settings?.description || ''}
                placeholder="Hub description"
              />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input
                  id="primary-color"
                  type="color"
                  defaultValue={hubConfig.primaryColor}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input
                  id="secondary-color"
                  type="color"
                  defaultValue={hubConfig.secondaryColor}
                />
              </FormGroup>
            </FormRow>
            <ActionButton>
              Save Changes
            </ActionButton>
          </FormSection>
        )

      case 'sms':
        return (
          <FormSection>
            <SectionHeader>
              <h3>SMS Gateway Configuration</h3>
              <p>Manage SMS provider settings</p>
            </SectionHeader>

            <SettingCard>
              <CardHeader>
                <CardTitle>Bandwidth Settings</CardTitle>
                <CardDescription>Configure Bandwidth API credentials</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FormGroup>
                  <Label htmlFor="bandwidth-user-id">User ID</Label>
                  <Input
                    id="bandwidth-user-id"
                    defaultValue={settings?.bandwidth_user_id || ''}
                    placeholder="Bandwidth User ID"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bandwidth-api-token">API Token</Label>
                  <Input
                    id="bandwidth-api-token"
                    type="password"
                    defaultValue={settings?.bandwidth_api_token ? '••••••••' : ''}
                    placeholder="Bandwidth API Token"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bandwidth-api-secret">API Secret</Label>
                  <Input
                    id="bandwidth-api-secret"
                    type="password"
                    defaultValue={settings?.bandwidth_api_secret ? '••••••••' : ''}
                    placeholder="Bandwidth API Secret"
                  />
                </FormGroup>
              </CardContent>
            </SettingCard>

            <SettingCard>
              <CardHeader>
                <CardTitle>Message Limits</CardTitle>
                <CardDescription>Configure sending limits and throttling</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="daily-limit">Daily Message Limit</Label>
                    <Input
                      id="daily-limit"
                      type="number"
                      defaultValue={settings?.daily_message_limit || 10000}
                      placeholder="10000"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      defaultValue={settings?.rate_limit_per_minute || 100}
                      placeholder="100"
                    />
                  </FormGroup>
                </FormRow>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Switch
                    id="auto-retry"
                    defaultChecked={settings?.auto_retry_failed || false}
                  />
                  <Label htmlFor="auto-retry">Auto-retry failed messages</Label>
                </div>
              </CardContent>
            </SettingCard>

            <ActionButton>
              Save SMS Configuration
            </ActionButton>
          </FormSection>
        )

      case 'security':
        return (
          <FormSection>
            <SectionHeader>
              <h3>Security Settings</h3>
              <p>Configure platform security policies</p>
            </SectionHeader>

            <SettingCard>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>User authentication settings</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingRow>
                  <SettingInfo>
                    <Label htmlFor="require-2fa">Require 2FA for Admins</Label>
                    <p>
                      Force two-factor authentication for admin users
                    </p>
                  </SettingInfo>
                  <Switch
                    id="require-2fa"
                    defaultChecked={settings?.require_2fa_admin || false}
                  />
                </SettingRow>
                <SettingRow>
                  <SettingInfo>
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p>
                      Automatically log out inactive users
                    </p>
                  </SettingInfo>
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
                </SettingRow>
                <SettingRow>
                  <SettingInfo>
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p>
                      Log all administrative actions
                    </p>
                  </SettingInfo>
                  <Switch
                    id="audit-logging"
                    defaultChecked={settings?.audit_logging || true}
                  />
                </SettingRow>
              </CardContent>
            </SettingCard>

            <ActionButton>
              Save Security Settings
            </ActionButton>
          </FormSection>
        )

      default:
        return (
          <PlaceholderContent>
            <p>
              This section is coming soon
            </p>
          </PlaceholderContent>
        )
    }
  }

  return (
    <PageContainer>
      <Header>
        <Title>Settings</Title>
        <Subtitle>
          Configure {hubConfig.displayName} platform settings
        </Subtitle>
      </Header>

      <ContentLayout>
        <SidebarCard>
          <SidebarContent>
            <NavList>
              {tabs.map((tab) => (
                <NavButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  $active={activeTab === tab.id}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </NavButton>
              ))}
            </NavList>
          </SidebarContent>
        </SidebarCard>

        <MainContentCard>
          <MainContent>
            {renderTabContent()}
          </MainContent>
        </MainContentCard>
      </ContentLayout>
    </PageContainer>
  )
}