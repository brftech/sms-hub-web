import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, Send, MessageSquare, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useMessages } from '@sms-hub/supabase/react'
import type { Message } from '@sms-hub/types'
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

const StatSubtext = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
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

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 24rem;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const messageColumns = [
  {
    accessorKey: 'to_number',
    header: 'To',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="font-mono text-sm">
        {row.original.to_number}
      </div>
    ),
  },
  {
    accessorKey: 'message_body',
    header: 'Message',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="max-w-xs truncate text-sm">
        {row.original.message_body}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Message } }) => {
      const status = row.original.status
      const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
        sent: { bg: '#dbeafe', text: '#1e40af', label: 'Sent' },
        delivered: { bg: '#dcfce7', text: '#166534', label: 'Delivered' },
        failed: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' }
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
    accessorKey: 'created_at',
    header: 'Sent',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="text-sm text-gray-600">
        {row.original.created_at 
          ? new Date(row.original.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          : 'Not sent'
        }
      </div>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <Button variant="ghost" size="icon">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </Button>
    ),
  },
]

export function Messages() {
  useHub() // Initialize hub context
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')
  const { data: messages = [], isLoading } = useMessages()

  const filteredMessages = messages.filter((message: Message) => {
    const matchesSearch = 
      message.to_number.includes(searchTerm) ||
      message.message_body.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: messages.length,
    delivered: messages.filter((m: Message) => m.status === 'delivered').length,
    failed: messages.filter((m: Message) => m.status === 'failed').length,
    pending: messages.filter((m: Message) => m.status === 'pending' || m.status === 'sent').length,
  }

  const deliveryRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0

  return (
    <PageContainer>
      <Header>
        <TitleSection>
          <Title>Messages</Title>
          <Subtitle>Track and manage your SMS message history</Subtitle>
        </TitleSection>
        <Button style={{ background: '#3b82f6', color: 'white' }}>
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </Header>

      <StatsGrid>
        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Total Messages</StatLabel>
                <StatValue>{stats.total}</StatValue>
              </div>
              <IconWrapper color="#dbeafe">
                <MessageSquare className="h-4 w-4" style={{ color: '#3b82f6' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Delivered</StatLabel>
                <StatValue style={{ color: '#22c55e' }}>{stats.delivered}</StatValue>
                <StatSubtext>{deliveryRate}% delivery rate</StatSubtext>
              </div>
              <IconWrapper color="#dcfce7">
                <CheckCircle className="h-4 w-4" style={{ color: '#22c55e' }} />
              </IconWrapper>
            </StatHeader>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="p-6">
            <StatHeader>
              <div>
                <StatLabel>Failed</StatLabel>
                <StatValue style={{ color: '#ef4444' }}>{stats.failed}</StatValue>
              </div>
              <IconWrapper color="#fee2e2">
                <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
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
      </StatsGrid>

      <MainCard>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>
            View and filter your sent messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterSection>
            <SearchWrapper>
              <SearchIcon />
              <SearchInput
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
            
            <FilterGroup>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </FilterGroup>
          </FilterSection>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <p style={{ color: '#6b7280' }}>Loading messages...</p>
            </LoadingContainer>
          ) : filteredMessages.length > 0 ? (
            <DataTable
              columns={messageColumns}
              data={filteredMessages}
            />
          ) : (
            <EmptyState>
              {messages.length === 0 ? (
                <>
                  <EmptyIcon>
                    <MessageSquare className="h-8 w-8" style={{ color: '#9ca3af' }} />
                  </EmptyIcon>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyText>
                    Start sending SMS messages to see them here
                  </EmptyText>
                  <Button style={{ background: '#3b82f6', color: 'white' }}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Your First Message
                  </Button>
                </>
              ) : (
                <>
                  <EmptyText>
                    No messages match your search criteria
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