import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, DataTable } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Search, Send, MessageSquare, Download } from 'lucide-react'
import { useMessages } from '@sms-hub/supabase/react'
import type { Message } from '@sms-hub/types'

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
      const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        delivered: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return (
        <Badge className={statusColors[status] || statusColors.pending}>
          {status.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
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
    accessorKey: 'status',
    header: 'Delivered',
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="text-sm">
        {row.original.status === 'delivered' ? 'Delivered' : '--'}
      </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Messages</h1>
          <p className="text-muted-foreground">
            Track and manage your SMS message history
          </p>
        </div>
        <Button className="hub-bg-primary">
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>

      {/* Message Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              {deliveryRate}% delivery rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>
            View and filter your sent messages
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

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
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
              {messages.length === 0 ? (
                <div>
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start sending SMS messages to see them here
                  </p>
                  <Button className="hub-bg-primary">
                    <Send className="h-4 w-4 mr-2" />
                    Send Your First Message
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">
                    No messages match your search criteria
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