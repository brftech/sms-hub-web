import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, Building, MoreHorizontal, DollarSign } from 'lucide-react'
import { useAdminCompanies } from '@sms-hub/supabase'
import type { Company } from '@sms-hub/types'

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Companies</h1>
          <p className="text-muted-foreground">
            Manage {hubConfig.displayName} customer accounts
          </p>
        </div>
        <Button className="hub-bg-primary">
          <Building className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Company Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            View and manage customer companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading companies...</p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <DataTable
              columns={companyColumns}
              data={filteredCompanies}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No companies match your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}