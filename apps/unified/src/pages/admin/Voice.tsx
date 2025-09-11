import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  Mic,
  Phone,
  Headphones,
  Volume2,
  Settings,
  Play,
  Pause,
  Square,
  Record,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

interface VoiceApp {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance" | "error";
  type: "ivr" | "call_center" | "voicemail" | "conference";
  phone_number: string;
  created_at: string;
  last_modified: string;
  call_count: number;
  duration_minutes: number;
  success_rate: number;
  features: string[];
  assigned_accounts: number;
}

export function Voice() {
  const [voiceApps, setVoiceApps] = useState<VoiceApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockVoiceApps: VoiceApp[] = [
      {
        id: "1",
        name: "Customer Support IVR",
        description: "Main customer support interactive voice response system",
        status: "active",
        type: "ivr",
        phone_number: "+1-555-123-4567",
        created_at: "2024-01-15T10:30:00Z",
        last_modified: "2024-01-20T14:30:00Z",
        call_count: 1250,
        duration_minutes: 18750,
        success_rate: 94.2,
        features: ["Multi-level menu", "Call routing", "Queue management", "Call recording"],
        assigned_accounts: 5,
      },
      {
        id: "2",
        name: "Sales Hotline",
        description: "Direct sales line with call forwarding",
        status: "active",
        type: "call_center",
        phone_number: "+1-800-555-1234",
        created_at: "2024-01-10T09:15:00Z",
        last_modified: "2024-01-18T16:45:00Z",
        call_count: 890,
        duration_minutes: 13350,
        success_rate: 87.5,
        features: ["Call forwarding", "Voicemail", "Call analytics"],
        assigned_accounts: 3,
      },
      {
        id: "3",
        name: "Conference Bridge",
        description: "Multi-party conference calling system",
        status: "maintenance",
        type: "conference",
        phone_number: "+1-555-987-6543",
        created_at: "2024-01-05T11:30:00Z",
        last_modified: "2024-01-22T09:15:00Z",
        call_count: 450,
        duration_minutes: 6750,
        success_rate: 92.1,
        features: ["Multi-party calling", "Recording", "Screen sharing"],
        assigned_accounts: 8,
      },
      {
        id: "4",
        name: "Voicemail System",
        description: "Automated voicemail collection and management",
        status: "active",
        type: "voicemail",
        phone_number: "+1-555-456-7890",
        created_at: "2024-01-20T14:00:00Z",
        last_modified: "2024-01-21T10:20:00Z",
        call_count: 320,
        duration_minutes: 4800,
        success_rate: 98.7,
        features: ["Voicemail transcription", "Email notifications", "Playback controls"],
        assigned_accounts: 12,
      },
    ];

    const timer = setTimeout(() => {
      setVoiceApps(mockVoiceApps);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ivr":
        return "bg-blue-100 text-blue-800";
      case "call_center":
        return "bg-purple-100 text-purple-800";
      case "voicemail":
        return "bg-orange-100 text-orange-800";
      case "conference":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Applications</h1>
            <p className="text-gray-600">Manage voice applications and call systems</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Applications</h1>
          <p className="text-gray-600">Manage voice applications and call systems</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Voice App
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Total Apps</p>
                <p className="text-2xl font-bold">{voiceApps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Apps</p>
                <p className="text-2xl font-bold">
                  {voiceApps.filter((app) => app.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold">
                  {voiceApps.reduce((sum, app) => sum + app.call_count, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold">
                  {formatDuration(voiceApps.reduce((sum, app) => sum + app.duration_minutes, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Apps List */}
      <div className="space-y-4">
        {voiceApps.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No voice applications found
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first voice application to get started
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Voice App
              </Button>
            </CardContent>
          </Card>
        ) : (
          voiceApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Mic className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {app.name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(app.type)}>
                          {app.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{app.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{app.phone_number}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{app.assigned_accounts} accounts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Modified {formatDate(app.last_modified)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{app.call_count.toLocaleString()} calls</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(app.duration_minutes)} total</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{app.success_rate}% success rate</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        {app.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">Voice Applications Coming Soon</h3>
              <p className="text-sm text-orange-700">
                Advanced voice management features are currently in development. 
                This includes IVR systems, call routing, voicemail management, and more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
