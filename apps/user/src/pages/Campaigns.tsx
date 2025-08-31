import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Search, Plus, Play, Pause, MoreHorizontal, TrendingUp, BarChart3, CheckCircle, Clock } from 'lucide-react'
import { useCurrentUserCampaigns, useCurrentUserCompany, useBrands } from '@sms-hub/supabase/react'
import type { Campaign } from '@sms-hub/types'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleSection = styled.div``;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0.5rem;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const campaignColumns = [
  {
    accessorKey: 'name',
    header: 'Campaign Name',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">ID: {row.original.id.slice(0, 8)}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const status = row.original.status || 'pending'
      const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
        active: { bg: '#dcfce7', text: '#166534', label: 'Active' },
        paused: { bg: '#fed7aa', text: '#9a3412', label: 'Paused' },
        completed: { bg: '#dbeafe', text: '#1e40af', label: 'Completed' },
      }
      const config = statusConfig[status] || statusConfig.pending
      return (
        <Badge style={{ background: config.bg, color: config.text, border: 'none' }}>
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'tcr_campaign_id',
    header: 'TCR Campaign',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div className="font-mono text-sm">
        {row.original.tcr_campaign_id || 'Not registered'}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div className="text-sm text-gray-600">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : 'N/A'}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
]

export function Campaigns() {
  useHub() // Initialize hub context
  const [searchTerm, setSearchTerm] = useState('')
  const { data: campaigns = [], isLoading } = useCurrentUserCampaigns()
  const { data: company } = useCurrentUserCompany()
  const { data: brands = [] } = useBrands(company?.id || '')

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    pending: campaigns.filter(c => c.status === 'pending').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
  }

  return (
    <PageContainer>
      <Header>
        <TitleSection>
          <Title>Campaigns</Title>
          <Subtitle>Create and manage your SMS campaigns</Subtitle>
        </TitleSection>
        <Button style={{ background: '#3b82f6', color: 'white' }}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </Header>

      <StatsGrid>
        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Total Campaigns</StatLabel>
                <StatValue>{stats.total}</StatValue>
              </div>
              <IconWrapper color="#dbeafe">
                <BarChart3 className="h-4 w-4" style={{ color: '#3b82f6' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Active</StatLabel>
                <StatValue style={{ color: '#22c55e' }}>{stats.active}</StatValue>
              </div>
              <IconWrapper color="#dcfce7">
                <Play className="h-4 w-4" style={{ color: '#22c55e' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Pending</StatLabel>
                <StatValue style={{ color: '#f59e0b' }}>{stats.pending}</StatValue>
              </div>
              <IconWrapper color="#fef3c7">
                <Clock className="h-4 w-4" style={{ color: '#f59e0b' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Completed</StatLabel>
                <StatValue style={{ color: '#3b82f6' }}>{stats.completed}</StatValue>
              </div>
              <IconWrapper color="#dbeafe">
                <CheckCircle className="h-4 w-4" style={{ color: '#3b82f6' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>
      </StatsGrid>

      <MainCard>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage your SMS campaigns and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchSection>
            <SearchWrapper>
              <SearchIcon />
              <SearchInput
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
          </SearchSection>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <p style={{ color: '#6b7280' }}>Loading campaigns...</p>
            </LoadingContainer>
          ) : filteredCampaigns.length > 0 ? (
            <DataTable
              columns={campaignColumns}
              data={filteredCampaigns}
            />
          ) : (
            <EmptyState>
              {campaigns.length === 0 ? (
                <>
                  <EmptyIcon>
                    <TrendingUp className="h-8 w-8" style={{ color: '#9ca3af' }} />
                  </EmptyIcon>
                  <EmptyTitle>No campaigns yet</EmptyTitle>
                  <EmptyText>
                    Create your first SMS campaign to get started
                  </EmptyText>
                  <Button style={{ background: '#3b82f6', color: 'white' }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </>
              ) : (
                <>
                  <EmptyText>
                    No campaigns match your search criteria
                  </EmptyText>
                </>
              )}
            </EmptyState>
          )}
        </CardContent>
      </MainCard>
    </PageContainer>
  )
}