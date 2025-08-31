import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { MessageSquare, Users, Building, TrendingUp, AlertTriangle, DollarSign, Activity, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useAdminStats } from '@sms-hub/supabase'
import styled from 'styled-components'

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`

const AlertCard = styled(StatCard)`
  border-left: 4px solid #ef4444;
`

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const StatInfo = styled.div`
  flex: 1;
`

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  margin-bottom: 0.5rem;
`

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
`

const IconContainer = styled.div<{ $bgColor: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.$bgColor};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`

const ActivityCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
`

const TimeStamp = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`

const StatusIndicator = styled.div<{ $status: 'success' | 'warning' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${props => props.$status === 'success' ? '#059669' : props.$status === 'warning' ? '#d97706' : '#dc2626'};
`

const StatusDot = styled.div<{ $status: 'success' | 'warning' | 'error' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$status === 'success' ? '#10b981' : props.$status === 'warning' ? '#f59e0b' : '#ef4444'};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`

export function Dashboard() {
  const { hubConfig, currentHub } = useHub()
  const { data: stats } = useAdminStats(hubConfig.id)

  const overviewStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Active Companies',
      value: stats?.activeCompanies || 0,
      icon: Building,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
    {
      title: 'Messages Today',
      value: stats?.messagesToday || 0,
      icon: MessageSquare,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
    {
      title: 'Revenue (MTD)',
      value: `$${(stats?.revenueThisMonth || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
  ]

  const alertsStats = [
    {
      title: 'Failed Messages',
      value: stats?.failedMessages || 0,
      icon: XCircle,
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
  ]

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>{hubConfig.displayName} platform overview and management</Subtitle>
      </Header>

      <StatsGrid>
        {overviewStats.map((stat) => (
          <StatCard key={stat.title}>
            <CardContent>
              <StatContent>
                <StatInfo>
                  <StatLabel>{stat.title}</StatLabel>
                  <StatValue>{stat.value}</StatValue>
                </StatInfo>
                <IconContainer $bgColor={stat.bgColor}>
                  <stat.icon size={24} color={stat.color} />
                </IconContainer>
              </StatContent>
            </CardContent>
          </StatCard>
        ))}
      </StatsGrid>

      <StatsGrid>
        {alertsStats.map((stat) => (
          <AlertCard key={stat.title}>
            <CardContent>
              <StatContent>
                <StatInfo>
                  <StatLabel>{stat.title}</StatLabel>
                  <StatValue>{stat.value}</StatValue>
                </StatInfo>
                <IconContainer $bgColor={stat.bgColor}>
                  <stat.icon size={24} color={stat.color} />
                </IconContainer>
              </StatContent>
            </CardContent>
          </AlertCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <ActivityCard>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>New user registrations today</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList>
              {stats?.recentSignups?.length ? (
                stats.recentSignups.map((signup, i) => (
                  <ActivityItem key={i}>
                    <UserInfo>
                      <UserName>{signup.name}</UserName>
                      <UserEmail>{signup.email}</UserEmail>
                    </UserInfo>
                    <TimeStamp>
                      {new Date(signup.created_at).toLocaleTimeString()}
                    </TimeStamp>
                  </ActivityItem>
                ))
              ) : (
                <EmptyState>No recent signups</EmptyState>
              )}
            </ActivityList>
          </CardContent>
        </ActivityCard>

        <ActivityCard>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList>
              <ActivityItem>
                <UserInfo>
                  <UserName>API Status</UserName>
                </UserInfo>
                <StatusIndicator $status="success">
                  <StatusDot $status="success" />
                  Operational
                </StatusIndicator>
              </ActivityItem>
              <ActivityItem>
                <UserInfo>
                  <UserName>Message Queue</UserName>
                </UserInfo>
                <StatusIndicator $status="success">
                  <StatusDot $status="success" />
                  Healthy
                </StatusIndicator>
              </ActivityItem>
              <ActivityItem>
                <UserInfo>
                  <UserName>Database</UserName>
                </UserInfo>
                <StatusIndicator $status="success">
                  <StatusDot $status="success" />
                  Connected
                </StatusIndicator>
              </ActivityItem>
              <ActivityItem>
                <UserInfo>
                  <UserName>SMS Gateway</UserName>
                </UserInfo>
                <StatusIndicator $status="warning">
                  <StatusDot $status="warning" />
                  Degraded
                </StatusIndicator>
              </ActivityItem>
            </ActivityList>
          </CardContent>
        </ActivityCard>
      </ContentGrid>
    </DashboardContainer>
  )
}