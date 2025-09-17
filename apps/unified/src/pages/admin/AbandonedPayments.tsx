import { useState, useEffect } from "react";
import {
  useHub,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Alert,
  AlertDescription,
} from "@sms-hub/ui";
import {
  CreditCard,
  User,
  Mail,
  Calendar,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getSupabaseClient } from "../../lib/supabaseSingleton";

interface AbandonedPayment {
  id: string;
  billing_email: string;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  payment_status: string | null;
  created_at: string | null;
  metadata: {
    stripe_session_id?: string;
    customer_email?: string;
    customer_name?: string;
    payment_first?: boolean;
  } | null;
  hub_id: number;
}

export default function AbandonedPayments() {
  const { hubConfig } = useHub();
  const [abandonedPayments, setAbandonedPayments] = useState<
    AbandonedPayment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [linkingPayment, setLinkingPayment] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  const loadAbandonedPayments = async () => {
    try {
      setIsRefreshing(true);

      // Find customers with payments but no user accounts
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          id,
          billing_email,
          stripe_customer_id,
          subscription_status,
          payment_status,
          created_at,
          metadata,
          hub_id
        `
        )
        .is("user_id", null)
        .eq("payment_status", "paid")
        .eq("hub_id", hubConfig.hubNumber)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading abandoned payments:", error);
      } else {
        setAbandonedPayments((data || []) as AbandonedPayment[]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const linkPaymentToUser = async (customerId: string, email: string) => {
    setLinkingPayment(customerId);

    try {
      // Find user with matching email
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("id, company_id")
        .eq("email", email)
        .single();

      if (userError || !userProfile) {
        alert(
          `No user account found with email: ${email}\nUser needs to complete signup first.`
        );
        return;
      }

      // Link customer to user and company
      const { error: linkError } = await supabase
        .from("customers")
        .update({
          user_id: userProfile.id,
          company_id: userProfile.company_id,
          metadata: {
            linked_at: new Date().toISOString(),
            linked_by: "admin_tool",
            account_recovered: true,
          },
        })
        .eq("id", customerId);

      if (linkError) {
        console.error("Link error:", linkError);
        alert("Failed to link payment to user account");
      } else {
        alert("Successfully linked payment to user account!");
        loadAbandonedPayments(); // Refresh the list
      }
    } catch (error) {
      console.error("Error linking payment:", error);
      alert("Error linking payment to user");
    } finally {
      setLinkingPayment(null);
    }
  };

  const viewInStripe = (customerId: string) => {
    const stripeUrl = `https://dashboard.stripe.com/customers/${customerId}`;
    window.open(stripeUrl, "_blank");
  };

  useEffect(() => {
    loadAbandonedPayments();
  }, [hubConfig.hubNumber]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">
            Loading abandoned payments...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Abandoned Payments
          </h1>
          <p className="text-gray-600">
            Customers who completed payment but haven't finished account setup
          </p>
        </div>
        <Button
          onClick={loadAbandonedPayments}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {abandonedPayments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Abandoned Payments
            </h3>
            <p className="text-gray-600">
              All customers who paid have completed their account setup.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Found {abandonedPayments.length} customer(s) who paid but haven't
              completed account setup. These customers have active payments but
              no user accounts.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {abandonedPayments.map((payment) => (
              <Card key={payment.id} className="border-orange-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                      Abandoned Payment
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="destructive">No Account</Badge>
                      <Badge variant="outline">
                        {payment.subscription_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{payment.billing_email}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">
                          {payment.metadata?.customer_name || "Not provided"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Payment Date:</span>
                        <span className="ml-2">
                          {new Date(
                            payment.created_at || ""
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Stripe Customer:</span>
                        <span className="ml-2 font-mono text-xs">
                          {payment.stripe_customer_id}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Session ID:</span>
                        <span className="ml-2 font-mono text-xs">
                          {payment.metadata?.stripe_session_id?.slice(-12) ||
                            "N/A"}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Status:</span>
                        <span className="ml-2">
                          <Badge
                            variant={
                              payment.payment_status === "paid"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {payment.payment_status}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() =>
                        linkPaymentToUser(payment.id, payment.billing_email)
                      }
                      disabled={linkingPayment === payment.id}
                      size="sm"
                      className="hub-bg-primary"
                    >
                      {linkingPayment === payment.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Linking...
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Link to Account
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() =>
                        viewInStripe(payment.stripe_customer_id || "")
                      }
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View in Stripe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
