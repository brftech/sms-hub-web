import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, Building, MoreHorizontal, DollarSign, Users, AlertTriangle } from 'lucide-react'
import { useAdminCompanies } from '@sms-hub/supabase'
import type { Company } from '@sms-hub/types'
import styled from 'styled-components'

const companyColumns = [
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }: { row: { original: Company } }) => (
      <div>
        <div className="font-medium">{row.original.public_name}</div>
        <div className="text-sm text-muted-foreground font-mono">
          {row.original.company_account_number}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'industry',
    header: 'Industry',
    cell: ({ row }: { row: { original: Company } }) => (
      <Badge variant="outline">
        {row.original.industry || 'Not specified'}
      </Badge>
    ),
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }: { row: { original: Company } }) => (
      <div className="text-sm">
        {row.original.size || 'Not specified'}
      </div>
    ),
  },
  {
    accessorKey: 'total_users',
    header: 'Users',
    cell: ({ row }: { row: { original: any } }) => (
      <div className="text-center font-medium">
        {row.original.total_users || 0}
      </div>
    ),
  },
  {
    accessorKey: 'messages_sent',
    header: 'Messages Sent',
    cell: ({ row }: { row: { original: any } }) => (
      <div className="text-right font-medium">
        {(row.original.messages_sent || 0).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'monthly_spend',
    header: 'Monthly Spend',
    cell: ({ row }: { row: { original: any } }) => (
      <div className="text-right font-medium">
        ${(row.original.monthly_spend || 0).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: any } }) => {
      const status = row.original.status || 'active'
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        suspended: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      }
      return (
        <Badge className={statusColors[status] || statusColors.active}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: { original: Company } }) => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
]

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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  align-items: center;
`

const StatInfo = styled.div``

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

const MainCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
`

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled(Button)`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
`

export function Companies() {
  const { hubConfig } = useHub()
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: companies = [], isLoading } = useAdminCompanies(hubConfig.hubNumber)

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.account_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter
    const matchesStatus = statusFilter === 'all' || (company as any).status === statusFilter
    
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const stats = {
    total: companies.length,
    active: companies.filter((c: any) => (c.status || 'active') === 'active').length,
    suspended: companies.filter((c: any) => (c.status || 'active') === 'suspended').length,
    totalRevenue: companies.reduce((sum: number, c: any) => sum + (c.monthly_spend || 0), 0),
  }

  const totalUsers = companies.reduce((sum: number, c: any) => sum + (c.total_users || 0), 0)

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <Title>Companies</Title>
          <Subtitle>Manage {hubConfig.displayName} customer accounts</Subtitle>
        </HeaderInfo>
        <ActionButton>
          <Building size={20} />
          Add Company
        </ActionButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Total Companies</StatLabel>
                <StatValue style={{ color: '#1f2937' }}>{stats.total}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#eff6ff">
                <Building size={24} color="#3b82f6" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Active</StatLabel>
                <StatValue style={{ color: '#10b981' }}>{stats.active}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#f0fdf4">
                <Building size={24} color="#10b981" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Suspended</StatLabel>
                <StatValue style={{ color: '#ef4444' }}>{stats.suspended}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#fef2f2">
                <AlertTriangle size={24} color="#ef4444" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Monthly Revenue</StatLabel>
                <StatValue style={{ color: '#10b981' }}>
                  ${stats.totalRevenue.toLocaleString()}
                </StatValue>
              </StatInfo>
              <IconContainer $bgColor="#f0fdf4">
                <DollarSign size={24} color="#10b981" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>
      </StatsGrid>

      <MainCard>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            View and manage customer companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FiltersContainer>
            <SearchContainer>
              <SearchIcon />
              <StyledInput
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <FilterGroup>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </FilterGroup>
          </FiltersContainer>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading companies...</LoadingText>
            </LoadingContainer>
          ) : filteredCompanies.length > 0 ? (
            <DataTable
              columns={companyColumns}
              data={filteredCompanies}
            />
          ) : (
            <EmptyState>
              No companies match your search criteria
            </EmptyState>
          )}
        </CardContent>
      </MainCard>
    </PageContainer>
  )
}