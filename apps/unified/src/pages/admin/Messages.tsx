import { useState } from "react";
import {
  useHub,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  DataTable,
} from "@sms-hub/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sms-hub/ui";
import {
  Search,
  MessageSquare,
  Filter,
  Download,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAdminMessages } from "@sms-hub/supabase";
import type { Message } from "@sms-hub/types";
import styled from "styled-components";

const messageColumns = [
  {
    accessorKey: "account_number",
    header: "Account",
    cell: ({ row }: { row: { original: any } }) => (
      <div className="font-mono text-sm">{row.original.account_number}</div>
    ),
  },
  {
    accessorKey: "to_phone_number",
    header: "To",
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="font-mono text-sm">{row.original.to_number}</div>
    ),
  },
  {
    accessorKey: "from_phone_number",
    header: "From",
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="font-mono text-sm">{row.original.from_number}</div>
    ),
  },
  {
    accessorKey: "content",
    header: "Message",
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="max-w-xs truncate">{row.original.message_body}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Message } }) => {
      const status = row.original.status;
      const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        sent: "bg-blue-100 text-blue-800",
        delivered: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
      };
      return (
        <Badge
          className={
            statusColors[status as keyof typeof statusColors] ||
            statusColors.pending
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sent_at",
    header: "Sent",
    cell: ({ row }: { row: { original: Message } }) => (
      <div className="text-sm">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleString()
          : "Not sent"}
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: () => <div className="text-sm font-mono">'--'</div>,
  },
];

const PageContainer = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

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
`;

const HeaderInfo = styled.div``;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.25rem;
`;

const StatMeta = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
`;

const IconContainer = styled.div<{ $bgColor: string }>`
  width: 48px;
  height: 48px;
  background: ${(props) => props.$bgColor};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MainCard = styled(Card)`
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

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
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;

  svg {
    color: #9ca3af;
    margin-bottom: 1rem;
  }
`;

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
`;

export function Messages() {
  const { hubConfig } = useHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const { data: messages = [], isLoading } = useAdminMessages(
    hubConfig.hubNumber
  );

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      (message as any).to_phone_number.includes(searchTerm) ||
      (message as any).from_phone_number?.includes(searchTerm) ||
      (message as any).content
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (message as any).account_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || (message as any).status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    delivered: messages.filter((m) => (m as any).status === "DELIVERED").length,
    failed: messages.filter(
      (m) =>
        (m as any).status === "FAILED" || (m as any).status === "UNDELIVERED"
    ).length,
    pending: messages.filter(
      (m) => (m as any).status === "PENDING" || (m as any).status === "SENT"
    ).length,
    totalCost: messages.reduce((sum, m) => sum + ((m as any).cost || 0), 0),
  };

  const deliveryRate =
    stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <Title>Messages</Title>
          <Subtitle>
            Monitor all SMS messages across {hubConfig.displayName}
          </Subtitle>
        </HeaderInfo>
        <ActionGroup>
          <ActionButton>
            <Download size={16} />
            Export
          </ActionButton>
          <ActionButton>
            <Filter size={16} />
            Advanced Filters
          </ActionButton>
        </ActionGroup>
      </Header>

      <StatsGrid>
        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Total Messages</StatLabel>
                <StatValue style={{ color: "#1f2937" }}>
                  {stats.total.toLocaleString()}
                </StatValue>
              </StatInfo>
              <IconContainer $bgColor="#eff6ff">
                <MessageSquare size={24} color="#3b82f6" />
              </IconContainer>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <StatContent>
              <StatInfo>
                <StatLabel>Delivered</StatLabel>
                <StatValue style={{ color: "#10b981" }}>
                  {stats.delivered.toLocaleString()}
                </StatValue>
                <StatMeta>{deliveryRate}% delivery rate</StatMeta>
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
                <StatLabel>Failed</StatLabel>
                <StatValue style={{ color: "#ef4444" }}>
                  {stats.failed.toLocaleString()}
                </StatValue>
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
                <StatLabel>Pending</StatLabel>
                <StatValue style={{ color: "#f59e0b" }}>
                  {stats.pending.toLocaleString()}
                </StatValue>
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
                <StatLabel>Total Cost</StatLabel>
                <StatValue style={{ color: "#10b981" }}>
                  ${stats.totalCost.toFixed(2)}
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
          <CardTitle>Message Log</CardTitle>
          <CardDescription>
            View all SMS messages sent through the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FiltersContainer>
            <SearchContainer>
              <SearchIcon />
              <StyledInput
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <FilterGroup>
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
            </FilterGroup>
          </FiltersContainer>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading messages...</LoadingText>
            </LoadingContainer>
          ) : filteredMessages.length > 0 ? (
            <DataTable columns={messageColumns} data={filteredMessages} />
          ) : (
            <EmptyState>
              <MessageSquare size={48} />
              <p>No messages match your criteria</p>
            </EmptyState>
          )}
        </CardContent>
      </MainCard>
    </PageContainer>
  );
}
