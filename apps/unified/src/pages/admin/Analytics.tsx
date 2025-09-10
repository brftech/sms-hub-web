import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { BarChart3, TrendingUp, MessageSquare, Users, DollarSign, Activity } from 'lucide-react'
import { useAdminAnalytics } from '@sms-hub/supabase'
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    gap: 1rem;
  }
`

const HeaderInfo = styled.div``

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
  margin-bottom: 0.5rem;
`

const StatChange = styled.p<{ $positive: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$positive ? '#059669' : '#dc2626'};
  margin: 0;
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
  margin-bottom: 2rem;
`

const MainCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  text-align: center;
`

const ChartContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const ChartIcon = styled.div`
  color: #9ca3af;
`

const ChartText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  
  &.small {
    font-size: 0.75rem;
  }
`

const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const DataItem = styled.div`
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

const CompanyInfo = styled.div`
  flex: 1;
`

const CompanyName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`

const CompanyAccount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
  margin-top: 0.125rem;
`

const MetricValue = styled.div`
  text-align: right;
`

const MetricNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`

export function Analytics() {
  const { hubConfig } = useHub()
  const [timeRange, setTimeRange] = useState('30d')
  const { data: analytics } = useAdminAnalytics(hubConfig.hubNumber, timeRange)

  const kpiCards = [
    {
      title: 'Message Volume',
      value: (analytics?.totalMessages || 0).toLocaleString(),
      change: analytics?.messageGrowth || 0,
      icon: MessageSquare,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Delivery Rate',
      value: `${analytics?.deliveryRate || 0}%`,
      change: analytics?.deliveryRateChange || 0,
      icon: TrendingUp,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
    {
      title: 'Active Users',
      value: (analytics?.activeUsers || 0).toLocaleString(),
      change: analytics?.userGrowth || 0,
      icon: Users,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
    {
      title: 'Revenue',
      value: `$${(analytics?.revenue || 0).toLocaleString()}`,
      change: analytics?.revenueGrowth || 0,
      icon: DollarSign,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
  ]

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <Title>Analytics</Title>
          <Subtitle>
            {hubConfig.displayName} platform performance and insights
          </Subtitle>
        </HeaderInfo>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </Header>

      <StatsGrid>
        {kpiCards.map((kpi) => (
          <StatCard key={kpi.title}>
            <CardContent>
              <StatContent>
                <StatInfo>
                  <StatLabel>{kpi.title}</StatLabel>
                  <StatValue>{kpi.value}</StatValue>
                  <StatChange $positive={kpi.change >= 0}>
                    {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}% from last period
                  </StatChange>
                </StatInfo>
                <IconContainer $bgColor={kpi.bgColor}>
                  <kpi.icon size={24} color={kpi.color} />
                </IconContainer>
              </StatContent>
            </CardContent>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <MainCard>
          <CardHeader>
            <CardTitle>Message Volume Trend</CardTitle>
            <CardDescription>
              Daily message volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder>
              <ChartContent>
                <ChartIcon>
                  <BarChart3 size={48} />
                </ChartIcon>
                <ChartText>Chart visualization would be rendered here</ChartText>
                <ChartText className="small">(Integration with charting library needed)</ChartText>
              </ChartContent>
            </ChartPlaceholder>
          </CardContent>
        </MainCard>

        <MainCard>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>
              Success vs failure rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder>
              <ChartContent>
                <ChartIcon>
                  <Activity size={48} />
                </ChartIcon>
                <ChartText>Delivery rate chart would be rendered here</ChartText>
                <ChartText className="small">(Integration with charting library needed)</ChartText>
              </ChartContent>
            </ChartPlaceholder>
          </CardContent>
        </MainCard>
      </ContentGrid>

      <ContentGrid>
        <MainCard>
          <CardHeader>
            <CardTitle>Top Companies by Volume</CardTitle>
            <CardDescription>
              Highest message senders this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataList>
              {analytics?.topCompanies?.map((company, i) => (
                <DataItem key={i}>
                  <CompanyInfo>
                    <CompanyName>{(company as any).name}</CompanyName>
                    <CompanyAccount>{(company as any).account_number}</CompanyAccount>
                  </CompanyInfo>
                  <MetricValue>
                    <MetricNumber>{(company as any).message_count.toLocaleString()}</MetricNumber>
                    <MetricLabel>messages</MetricLabel>
                  </MetricValue>
                </DataItem>
              )) || (
                <EmptyState>
                  No data available
                </EmptyState>
              )}
            </DataList>
          </CardContent>
        </MainCard>

        <MainCard>
          <CardHeader>
            <CardTitle>Failed Message Analysis</CardTitle>
            <CardDescription>
              Common failure reasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataList>
              {analytics?.failureReasons?.map((reason, i) => (
                <DataItem key={i}>
                  <CompanyInfo>
                    <CompanyName>{(reason as any).reason}</CompanyName>
                  </CompanyInfo>
                  <MetricValue>
                    <MetricNumber>{(reason as any).count}</MetricNumber>
                    <MetricLabel>
                      ({(((reason as any).count / ((analytics as any)?.totalFailures || 1)) * 100).toFixed(1)}%)
                    </MetricLabel>
                  </MetricValue>
                </DataItem>
              )) || (
                <EmptyState>
                  No failure data available
                </EmptyState>
              )}
            </DataList>
          </CardContent>
        </MainCard>
      </ContentGrid>
    </PageContainer>
  )
}