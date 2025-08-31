import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, UserPlus, MoreHorizontal, Filter } from 'lucide-react'
import { useAdminUsers } from '@sms-hub/supabase'
import type { UserProfile } from '@sms-hub/types'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Users</h1>
          <p className="text-muted-foreground">
            Manage {hubConfig.displayName} platform users
          </p>
        </div>
        <Button className="hub-bg-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onboarding}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <DataTable
              columns={userColumns}
              data={filteredUsers}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No users match your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}