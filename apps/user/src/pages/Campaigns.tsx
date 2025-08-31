import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Search, Plus, Play, Pause, MoreHorizontal, TrendingUp } from 'lucide-react'
import { useCampaigns } from '@sms-hub/supabase/react'
import type { Campaign } from '@sms-hub/types'

const campaignColumns = [
  {
    accessorKey: 'name',
    header: 'Campaign Name',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">Campaign ID: {row.original.id}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Campaign } }) => {
      const status = row.original.status || 'DRAFT'
      const statusColors: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        ACTIVE: 'bg-green-100 text-green-800',
        PAUSED: 'bg-orange-100 text-orange-800',
        COMPLETED: 'bg-blue-100 text-blue-800',
        CANCELLED: 'bg-red-100 text-red-800'
      }
      return (
        <Badge className={statusColors[status] || statusColors.DRAFT}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'tcr_campaign_id',
    header: 'TCR Campaign',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div className="text-right">
        <div className="font-medium">{row.original.tcr_campaign_id || 'Not registered'}</div>
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }: { row: { original: Campaign } }) => (
      <div className="text-sm">
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
  const { data: campaigns = [], isLoading } = useCampaigns()

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'ACTIVE').length,
    draft: campaigns.filter(c => c.status === 'DRAFT').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your SMS campaigns
          </p>
        </div>
        <Button className="hub-bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Pause className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage your SMS campaigns and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <DataTable
              columns={campaignColumns}
              data={filteredCampaigns}
            />
          ) : (
            <div className="text-center py-8">
              {campaigns.length === 0 ? (
                <div>
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first SMS campaign to get started
                  </p>
                  <Button className="hub-bg-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">
                    No campaigns match your search criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}