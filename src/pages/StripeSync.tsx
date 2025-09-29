import { useState } from "react";
import { 
  PageLayout, 
  SEO,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@sms-hub/ui/marketing";
import { CheckCircle, AlertCircle, Loader, ExternalLink } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const StripeSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSyncCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const stripeCustomerId = formData.get("stripe_customer_id") as string;
    const companyName = formData.get("company_name") as string;
    const userEmail = formData.get("user_email") as string;
    const hubId = parseInt(formData.get("hub_id") as string) || 1;

    try {

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-stripe-customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            stripe_customer_id: stripeCustomerId,
            company_name: companyName,
            user_email: userEmail,
            hub_id: hubId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync customer");
      }

      setResult(data);
    } catch (err) {
      // Error handled by UI state
      setError(err instanceof Error ? err.message : "Failed to sync customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticateCustomer = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const verificationCode = formData.get("verification_code") as string;
    const stripeCustomerId = formData.get("stripe_customer_id") as string;

    try {

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/authenticate-stripe-customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            verification_code: verificationCode,
            stripe_customer_id: stripeCustomerId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate customer");
      }

      setResult(data);
    } catch (err) {
      // Error handled by UI state
      setError(
        err instanceof Error ? err.message : "Failed to authenticate customer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Stripe Customer Sync - SMS Hub"
        description="Sync Stripe customers with Supabase database"
        keywords="Stripe sync, customer management, SMS Hub"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Stripe Customer Sync
            </h1>
            <p className="text-gray-300 text-lg">
              Sync Stripe customers with your Supabase database and trigger
              authentication
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sync Customer Form */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Sync Stripe Customer
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Create Supabase records from existing Stripe customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSyncCustomer} className="space-y-4">
                  <div>
                    <Label htmlFor="stripe_customer_id" className="text-white">
                      Stripe Customer ID
                    </Label>
                    <Input
                      id="stripe_customer_id"
                      name="stripe_customer_id"
                      placeholder="cus_..."
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_name" className="text-white">
                      Company Name
                    </Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      placeholder="Acme Corp"
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_email" className="text-white">
                      User Email
                    </Label>
                    <Input
                      id="user_email"
                      name="user_email"
                      type="email"
                      placeholder="user@company.com"
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hub_id" className="text-white">
                      Hub ID
                    </Label>
                    <select
                      id="hub_id"
                      name="hub_id"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white"
                      defaultValue="1"
                    >
                      <option value="0">PercyTech (0)</option>
                      <option value="1">Gnymble (1)</option>
                      <option value="2">PercyMD (2)</option>
                      <option value="3">PercyText (3)</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      "Sync Customer"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Authenticate Customer Form */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Authenticate Customer
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Complete authentication for synced customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAuthenticateCustomer}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="auth_email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="auth_email"
                      name="email"
                      type="email"
                      placeholder="user@company.com"
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="verification_code" className="text-white">
                      Verification Code
                    </Label>
                    <Input
                      id="verification_code"
                      name="verification_code"
                      placeholder="ABC123"
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="auth_stripe_customer_id"
                      className="text-white"
                    >
                      Stripe Customer ID
                    </Label>
                    <Input
                      id="auth_stripe_customer_id"
                      name="stripe_customer_id"
                      placeholder="cus_..."
                      required
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Authenticate"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {(result || error) && (
            <Card className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="pt-6">
                {error && (
                  <div className="flex items-center p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-400 font-semibold">Error</h3>
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="flex items-center p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <h3 className="text-green-400 font-semibold">Success</h3>
                      <p className="text-green-300 mb-2">{result.message}</p>
                      {result.data && (
                        <div className="text-sm text-gray-300 mt-2">
                          <pre className="bg-gray-800/50 p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default StripeSync;
