import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, UserPlus, MoreHorizontal, Filter, Users as UsersIcon, CheckCircle, Clock, Shield } from 'lucide-react'
import { useAdminUsers } from '@sms-hub/supabase'
import type { UserProfile } from '@sms-hub/types'
import styled from 'styled-components'

const userColumns = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }: { row: { original: UserProfile } }) => (
      <div>
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
        <div className="text-sm text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'account_number',
    header: 'Account',
    cell: ({ row }: { row: { original: UserProfile } }) => (
      <div className="font-mono text-sm">{row.original.account_number}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: { row: { original: UserProfile } }) => {
      const role = row.original.role
      const roleColors = {
        SUPERADMIN: 'bg-red-100 text-red-800',
        OWNER: 'bg-purple-100 text-purple-800',
        ADMIN: 'bg-blue-100 text-blue-800',
        SUPPORT: 'bg-yellow-100 text-yellow-800',
        VIEWER: 'bg-gray-100 text-gray-800',
        MEMBER: 'bg-green-100 text-green-800'
      }
      return (
        <Badge className={roleColors[role] || roleColors.MEMBER}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'onboarding_step',
    header: 'Status',
    cell: ({ row }: { row: { original: UserProfile } }) => {
      const step = row.original.onboarding_step
      return (
        <Badge variant={step === 'completed' ? 'default' : 'secondary'}>
          {step === 'completed' ? 'Active' : 'Onboarding'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }: { row: { original: UserProfile } }) => (
      <div className="text-sm">
        {new Date(row.original.created_at).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'last_activity',
    header: 'Last Active',
    cell: ({ row }: { row: { original: UserProfile } }) => (
      <div className="text-sm">
        {row.original.last_activity 
          ? new Date(row.original.last_activity).toLocaleDateString()
          : 'Never'
        }
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }: { row: { original: UserProfile } }) => (
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

export function Users() {
  const { hubConfig } = useHub()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: users = [], isLoading } = useAdminUsers(hubConfig.hubNumber)

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.onboarding_step === 'completed') ||
      (statusFilter === 'onboarding' && user.onboarding_step !== 'completed')
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.onboarding_step === 'completed').length,
    onboarding: users.filter(u => u.onboarding_step !== 'completed').length,
    admins: users.filter(u => ['SUPERADMIN', 'ADMIN'].includes(u.role)).length,
  }

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <Title>Users</Title>
          <Subtitle>Manage {hubConfig.displayName} platform users</Subtitle>
        </HeaderInfo>
        <ActionButton>
          <UserPlus size={20} />
          Invite User
        </ActionButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Total Users</StatLabel>
                <StatValue style={{ color: '#1f2937' }}>{stats.total}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#eff6ff">
                <UsersIcon size={24} color="#3b82f6" />
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
                <CheckCircle size={24} color="#10b981" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Onboarding</StatLabel>
                <StatValue style={{ color: '#f59e0b' }}>{stats.onboarding}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#fffbeb">
                <Clock size={24} color="#f59e0b" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Administrators</StatLabel>
                <StatValue style={{ color: '#3b82f6' }}>{stats.admins}</StatValue>
              </StatInfo>
              <IconContainer $bgColor="#eff6ff">
                <Shield size={24} color="#3b82f6" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>
      </StatsGrid>

      <MainCard>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FiltersContainer>
            <SearchContainer>
              <SearchIcon />
              <StyledInput
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <FilterGroup>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </FilterGroup>
          </FiltersContainer>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading users...</LoadingText>
            </LoadingContainer>
          ) : filteredUsers.length > 0 ? (
            <DataTable
              columns={userColumns}
              data={filteredUsers}
            />
          ) : (
            <EmptyState>
              No users match your search criteria
            </EmptyState>
          )}
        </CardContent>
      </MainCard>
    </PageContainer>
  )
}