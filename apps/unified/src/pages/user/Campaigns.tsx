import { useState } from "react";
import { useHub } from "@sms-hub/ui";
import {
  Search,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  useCurrentUserCampaigns,
  useCurrentUserCompany,
  useBrands,
} from "@sms-hub/supabase/react";
import { Campaign } from "@sms-hub/types";

export function Campaigns() {
  const { currentHub } = useHub();
  const { data: company } = useCurrentUserCompany();
  const { data: campaigns = [] } = useCurrentUserCampaigns();
  useBrands(company?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter campaigns based on search and status
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    const matchesSearch =
      campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c: Campaign) => c.status === "active").length,
    paused: campaigns.filter((c: Campaign) => c.status === "paused").length,
    completed: campaigns.filter((c: Campaign) => c.status === "completed")
      .length,
    totalMessages: campaigns.reduce(
      (acc: number, c: Campaign) =>
        acc + ((c as any).metadata?.message_count || 0),
      0
    ),
    deliveryRate:
      campaigns.length > 0
        ? campaigns.reduce(
            (acc: number, c: Campaign) =>
              acc + ((c as any).metadata?.delivery_rate || 0),
            0
          ) / campaigns.length
        : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "campaign-active";
      case "paused":
        return "campaign-paused";
      case "completed":
        return "campaign-completed";
      case "draft":
        return "campaign-draft";
      default:
        return "campaign-draft";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your SMS campaigns in {currentHub} hub
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 icon-bg-info rounded-lg">
              <Zap className="w-6 h-6 text-status-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Campaigns
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 icon-bg-success rounded-lg">
              <Play className="w-6 h-6 text-status-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active
              </p>
              <p className="text-2xl font-bold text-status-success">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 icon-bg-warning rounded-lg">
              <Pause className="w-6 h-6 text-status-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Paused
              </p>
              <p className="text-2xl font-bold text-status-warning">
                {stats.paused}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 icon-bg-error rounded-lg">
              <TrendingUp className="w-6 h-6 text-status-error" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Messages Sent
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalMessages.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Campaigns ({filteredCampaigns.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Delivery Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredCampaigns.map((campaign: Campaign) => (
                <tr key={campaign.id} className="hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status || "draft")}`}
                    >
                      {getStatusIcon(campaign.status || "draft")}
                      <span className="ml-1">{campaign.status || "draft"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {(
                      (campaign as any).metadata?.message_count || 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {((campaign as any).metadata?.delivery_rate || 0).toFixed(
                      1
                    )}
                    %
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {campaign.created_at
                      ? new Date(campaign.created_at).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Zap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-foreground">
              No campaigns found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first campaign."}
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
