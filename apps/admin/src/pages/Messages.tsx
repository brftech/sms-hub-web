import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, MessageSquare, Filter, Download, AlertTriangle, DollarSign } from 'lucide-react'
import { useAdminMessages } from '@sms-hub/supabase'
import type { Message } from '@sms-hub/types'

const messageColumns = [
  {
    accessorKey: 'account_number',
    header: 'Account',
    cell: ({ row }: { row: { original: any } }) => (
      <div className="font-mono text-sm">
        {row.original.account_number}
      </div>
    ),
  },
  {
    accessorKey: 'to_phone_number',
    header: 'To',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="font-mono text-sm">
        {row.original.to_number}
      </div>
    ),
  },
  {
    accessorKey: 'from_phone_number',
    header: 'From',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="font-mono text-sm">
        {row.original.from_number}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: 'Message',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="max-w-xs truncate">
        {row.original.message_body}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Message } }) => {
      const status = row.original.status
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        delivered: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return (
        <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.pending}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'sent_at',
    header: 'Sent',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="text-sm">
        {row.original.created_at 
          ? new Date(row.original.created_at).toLocaleString()
          : 'Not sent'
        }
      </div>
    ),
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="text-sm font-mono">
        '--'
      </div>
    ),
  },
]

export function Messages() {
  const { hubConfig } = useHub()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')
  const { data: messages = [], isLoading } = useAdminMessages(hubConfig.hubNumber)

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.to_phone_number.includes(searchTerm) ||
      message.from_phone_number?.includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message as any).account_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: messages.length,
    delivered: messages.filter(m => m.status === 'DELIVERED').length,
    failed: messages.filter(m => m.status === 'FAILED' || m.status === 'UNDELIVERED').length,
    pending: messages.filter(m => m.status === 'PENDING' || m.status === 'SENT').length,
    totalCost: messages.reduce((sum, m) => sum + (m.cost || 0), 0),
  }

  const deliveryRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Messages</h1>
          <p className="text-muted-foreground">
            Monitor all SMS messages across {hubConfig.displayName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Message Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {deliveryRate}% delivery rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Message Log</CardTitle>
          <CardDescription>
            View all SMS messages sent through the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="UNDELIVERED">Undelivered</SelectItem>
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading messages...</p>
            </div>
          ) : filteredMessages.length > 0 ? (
            <DataTable
              columns={messageColumns}
              data={filteredMessages}
            />
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No messages match your criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}