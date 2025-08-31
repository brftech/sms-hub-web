import {
  useHub,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@sms-hub/ui";
import { Badge, Progress } from "@sms-hub/ui";
import {
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle,
  Settings,
} from "lucide-react";
import { useUserProfile, useOnboardingSubmission } from "@sms-hub/supabase";
import { ONBOARDING_STEPS } from "@sms-hub/types";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { hubConfig, currentHub } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: onboardingSubmission } = useOnboardingSubmission(
    userProfile?.company_id || "",
    hubConfig.hubNumber
  );

  // Debug: Log hub information
  console.log("Current Hub:", currentHub);
  console.log("Hub Config:", hubConfig);
  console.log(
    "Document data-hub:",
    document.documentElement.getAttribute("data-hub")
  );
  console.log("Body data-hub:", document.body.getAttribute("data-hub"));

  const onboardingProgress = onboardingSubmission
    ? Object.values(ONBOARDING_STEPS).findIndex(
        (step) => step.stepName === onboardingSubmission.current_step
      ) + 1
    : 0;

  const totalSteps = Object.keys(ONBOARDING_STEPS).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold hub-text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your {hubConfig.displayName} dashboard
        </p>
      </div>

      {/* Onboarding Progress */}
      {userProfile?.onboarding_step !== "completed" && (
        <Card className="hub-border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Complete Your Setup
              <Badge variant="secondary">
                {onboardingProgress}/{totalSteps} steps
              </Badge>
            </CardTitle>
            <CardDescription>
              Finish setting up your account to start sending SMS messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress
                value={(onboardingProgress / totalSteps) * 100}
                className="w-full"
              />
              <Button asChild className="hub-bg-primary">
                <Link to="/onboarding">Continue Setup</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start sending when setup is complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Create your first campaign
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Import or add contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/campaigns">
                <TrendingUp className="h-4 w-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
