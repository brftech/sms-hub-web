import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@sms-hub/ui";
import { Progress } from "@sms-hub/ui";
import {
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle,
  Settings,
  Send,
  Activity,
  Phone,
  Mail,
  Building,
  ArrowRight,
  BarChart3,
  FileText,
  Plus,
  Upload,
  Clock,
} from "lucide-react";
import { 
  useUserProfile, 
  useOnboardingSubmission, 
  useCurrentUserCompany,
  useCurrentUserCampaigns,
  useBrands,
  useCurrentUserPhoneNumbers
} from "@sms-hub/supabase/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DashboardContainer = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;

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
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
`;

const StatSubtext = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActionSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const ActionCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;

const ActionContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
`;

const ActionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
`;

const ActionText = styled.div``;

const ActionTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const SetupCard = styled(Card)`
  background: white;
  border-left: 4px solid #3b82f6;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

const SetupContent = styled.div`
  padding: 1.5rem;
`;

const SetupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SetupTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const SetupProgress = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
`;

export function Dashboard() {
  const { hubConfig, currentHub } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const { data: campaigns = [] } = useCurrentUserCampaigns();
  const { data: brands = [] } = useBrands(company?.id || "");
  const { data: phoneNumbers = [] } = useCurrentUserPhoneNumbers();
  const { data: onboardingSubmission } = useOnboardingSubmission(
    company?.id || "",
    hubConfig.hubNumber
  );

  // Calculate real onboarding progress
  const calculateOnboardingProgress = () => {
    if (!userProfile || !company) return 0;
    
    let completed = 0;
    const total = 6;
    
    // Step 1: Account created
    if (userProfile.id) completed++;
    
    // Step 2: Company created
    if (company.id) completed++;
    
    // Step 3: Billing setup
    if (company.stripe_customer_id) completed++;
    
    // Step 4: Brand registered
    if (brands.length > 0 && brands[0].tcr_brand_id) completed++;
    
    // Step 5: Campaign created
    if (campaigns.length > 0 && campaigns[0].tcr_campaign_id) completed++;
    
    // Step 6: Phone number assigned
    if (phoneNumbers.length > 0) completed++;
    
    return (completed / total) * 100;
  };
  
  const completionPercentage = calculateOnboardingProgress();
  const isOnboardingComplete = completionPercentage === 100;

  return (
    <DashboardContainer>
      {/* Header */}
      <Header>
        <Title>Welcome back, {userProfile?.first_name || "there"}</Title>
        <Subtitle>Here's what's happening with your SMS campaigns today.</Subtitle>
      </Header>

      {/* Setup Progress Card */}
      {!isOnboardingComplete && (
        <SetupCard>
          <SetupContent>
            <SetupHeader>
              <SetupTitle>Complete Your Account Setup</SetupTitle>
              <SetupProgress>{Math.round(completionPercentage)}% Complete</SetupProgress>
            </SetupHeader>
            <Progress value={completionPercentage} className="mb-4" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Finish setting up your account to start sending messages
              </p>
              <Button asChild>
                <Link to="/onboarding">
                  Continue Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SetupContent>
        </SetupCard>
      )}

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard>
          <CardContent className="p-6">
            <StatContent>
              <StatInfo>
                <StatLabel>Total Messages</StatLabel>
                <StatValue>{campaigns.reduce((acc, c) => acc + (c.metadata?.message_count || 0), 0)}</StatValue>
                <StatSubtext>{campaigns.length > 0 ? 'Across all campaigns' : 'No messages sent yet'}</StatSubtext>
              </StatInfo>
              <IconWrapper color="#dbeafe">
                <MessageSquare className="h-5 w-5" style={{ color: '#3b82f6' }} />
              </IconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatContent>
              <StatInfo>
                <StatLabel>Active Campaigns</StatLabel>
                <StatValue>{campaigns.filter(c => c.status === 'active').length}</StatValue>
                <StatSubtext>{campaigns.length > 0 ? `${campaigns.length} total campaigns` : 'Create your first campaign'}</StatSubtext>
              </StatInfo>
              <IconWrapper color="#dcfce7">
                <TrendingUp className="h-5 w-5" style={{ color: '#22c55e' }} />
              </IconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatContent>
              <StatInfo>
                <StatLabel>Total Contacts</StatLabel>
                <StatValue>{company?.metadata?.contact_count || 0}</StatValue>
                <StatSubtext>{company?.metadata?.contact_count > 0 ? 'Total contacts' : 'Import your contacts'}</StatSubtext>
              </StatInfo>
              <IconWrapper color="#fef3c7">
                <Users className="h-5 w-5" style={{ color: '#f59e0b' }} />
              </IconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatContent>
              <StatInfo>
                <StatLabel>Delivery Rate</StatLabel>
                <StatValue>{company?.metadata?.delivery_rate || '--'}%</StatValue>
                <StatSubtext>{company?.metadata?.delivery_rate ? 'Average delivery rate' : 'No data available'}</StatSubtext>
              </StatInfo>
              <IconWrapper color="#f3f4f6">
                <Activity className="h-5 w-5" style={{ color: '#6b7280' }} />
              </IconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>
      </StatsGrid>

      {/* Quick Actions */}
      <ActionSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionGrid>
          <Link to="/campaigns" style={{ textDecoration: 'none' }}>
            <ActionCard>
              <ActionContent>
                <ActionInfo>
                  <ActionIcon>
                    <Send className="h-5 w-5" />
                  </ActionIcon>
                  <ActionText>
                    <ActionTitle>New Campaign</ActionTitle>
                    <ActionDescription>Send bulk SMS</ActionDescription>
                  </ActionText>
                </ActionInfo>
                <ArrowRight className="h-5 w-5" style={{ color: '#9ca3af' }} />
              </ActionContent>
            </ActionCard>
          </Link>

          <Link to="/contacts" style={{ textDecoration: 'none' }}>
            <ActionCard>
              <ActionContent>
                <ActionInfo>
                  <ActionIcon>
                    <Upload className="h-5 w-5" />
                  </ActionIcon>
                  <ActionText>
                    <ActionTitle>Import Contacts</ActionTitle>
                    <ActionDescription>Add recipients</ActionDescription>
                  </ActionText>
                </ActionInfo>
                <ArrowRight className="h-5 w-5" style={{ color: '#9ca3af' }} />
              </ActionContent>
            </ActionCard>
          </Link>

          <Link to="/messages/new" style={{ textDecoration: 'none' }}>
            <ActionCard>
              <ActionContent>
                <ActionInfo>
                  <ActionIcon>
                    <MessageSquare className="h-5 w-5" />
                  </ActionIcon>
                  <ActionText>
                    <ActionTitle>Quick Message</ActionTitle>
                    <ActionDescription>Send single SMS</ActionDescription>
                  </ActionText>
                </ActionInfo>
                <ArrowRight className="h-5 w-5" style={{ color: '#9ca3af' }} />
              </ActionContent>
            </ActionCard>
          </Link>

          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <ActionCard>
              <ActionContent>
                <ActionInfo>
                  <ActionIcon>
                    <Settings className="h-5 w-5" />
                  </ActionIcon>
                  <ActionText>
                    <ActionTitle>Settings</ActionTitle>
                    <ActionDescription>Manage account</ActionDescription>
                  </ActionText>
                </ActionInfo>
                <ArrowRight className="h-5 w-5" style={{ color: '#9ca3af' }} />
              </ActionContent>
            </ActionCard>
          </Link>
        </ActionGrid>
      </ActionSection>

      {/* Content Grid */}
      <ContentGrid>
        {/* Recent Activity */}
        <ContentCard>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length > 0 || brands.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Show recent campaigns */}
                {campaigns.slice(0, 3).map(campaign => (
                  <div key={campaign.id} style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem',
                    background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                          {campaign.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Campaign • {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge style={{ 
                        background: campaign.status === 'active' ? '#dcfce7' : '#fef3c7',
                        color: campaign.status === 'active' ? '#166534' : '#92400e',
                        border: 'none'
                      }}>
                        {campaign.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {/* Show recent brands */}
                {brands.slice(0, 2).map(brand => (
                  <div key={brand.id} style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem',
                    background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                          {brand.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Brand Registration • {brand.tcr_brand_id ? 'Registered' : 'Pending'}
                        </p>
                      </div>
                      <Badge style={{ 
                        background: brand.tcr_brand_id ? '#dcfce7' : '#fef3c7',
                        color: brand.tcr_brand_id ? '#166534' : '#92400e',
                        border: 'none'
                      }}>
                        {brand.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {campaigns.length > 3 && (
                  <Button variant="outline" asChild style={{ marginTop: '0.5rem' }}>
                    <Link to="/campaigns">View All Campaigns</Link>
                  </Button>
                )}
              </div>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <Clock className="h-8 w-8" />
                </EmptyIcon>
                <EmptyText>No recent activity</EmptyText>
                <Button variant="outline" asChild>
                  <Link to="/campaigns">Create Your First Campaign</Link>
                </Button>
              </EmptyState>
            )}
          </CardContent>
        </ContentCard>

        {/* Account Info */}
        <ContentCard>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building className="h-4 w-4" style={{ color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Company</p>
                  <p style={{ fontWeight: 500, color: '#111827' }}>{company?.public_name || "Not set"}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail className="h-4 w-4" style={{ color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email</p>
                  <p style={{ fontWeight: 500, color: '#111827' }}>{userProfile?.email}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone className="h-4 w-4" style={{ color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phone</p>
                  <p style={{ fontWeight: 500, color: '#111827' }}>{userProfile?.mobile_phone_number || "Not provided"}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart3 className="h-4 w-4" style={{ color: '#6b7280' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Account Number</p>
                  <p style={{ fontWeight: 500, color: '#111827' }}>{company?.company_account_number || userProfile?.account_number || "Pending"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </ContentCard>
      </ContentGrid>
    </DashboardContainer>
  );
}