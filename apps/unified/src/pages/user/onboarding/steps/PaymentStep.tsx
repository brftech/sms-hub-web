import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import {
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Alert,
  AlertDescription,
} from "@sms-hub/ui";
import { StepComponentProps } from "@sms-hub/types";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Shield,
  CheckCircle,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useCreateCustomerCheckout } from "@sms-hub/supabase";
import { useSupabase } from "../../../../providers/SupabaseProvider";

interface PaymentFormData {
  payment_method: "stripe";
  billing_name: string;
  billing_email: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  plan_tier: "starter" | "professional" | "enterprise";
}

export function PaymentStep({
  submission,
  onComplete,
  hubId,
  userId,
}: StepComponentProps) {
  // const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "professional" | "enterprise">("starter");
  const createCheckoutSession = useCreateCustomerCheckout();
  const supabase = useSupabase();

  const form = useForm<PaymentFormData>({
    defaultValues: {
      payment_method: "stripe",
      billing_name: "",
      billing_email: "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_zip: "",
      plan_tier: selectedPlan,
      ...((submission.step_data as any)?.payment || {}),
    },
    mode: "onChange",
    resolver: (values) => {
      const errors: Record<string, any> = {};

      if (!values.billing_name?.trim()) {
        errors.billing_name = { message: "Billing name is required" };
      }

      if (!values.billing_email?.trim()) {
        errors.billing_email = { message: "Billing email is required" };
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.billing_email)) {
        errors.billing_email = { message: "Invalid email address" };
      }

      if (!values.billing_address?.trim()) {
        errors.billing_address = { message: "Address is required" };
      }

      if (!values.billing_city?.trim()) {
        errors.billing_city = { message: "City is required" };
      }

      if (!values.billing_state?.trim()) {
        errors.billing_state = { message: "State is required" };
      }

      if (!values.billing_zip?.trim()) {
        errors.billing_zip = { message: "ZIP code is required" };
      } else if (!/^\d{5}(-\d{4})?$/.test(values.billing_zip)) {
        errors.billing_zip = { message: "Invalid ZIP code format" };
      }

      return {
        values: Object.keys(errors).length ? {} : values,
        errors,
      };
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Map plan tiers to Stripe price IDs
      const priceIds = {
        starter: import.meta.env.VITE_STRIPE_PRICE_STARTER,
        professional:
          import.meta.env.VITE_STRIPE_PRICE_CORE ||
          import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL,
        enterprise:
          import.meta.env.VITE_STRIPE_PRICE_ELITE ||
          import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE,
      };

      if (!priceIds[data.plan_tier]) {
        setError(`Price ID not configured for ${data.plan_tier} plan. Please contact support.`);
        setIsSubmitting(false);
        return;
      }

      // Get current user session

      if (!supabase) {
        throw new Error("Failed to initialize Supabase client");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user found");
      }

      // Create Stripe checkout session
      const checkoutData = await createCheckoutSession.mutateAsync({
        email: data.billing_email || session.user.email || "",
        companyId: submission.company_id,
        userId: userId,
        hubId: hubId,
        priceId: priceIds[data.plan_tier],
        successUrl: `${window.location.origin}/payment-callback?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-callback?canceled=true`,
        customerType: "company", // B2B customer
      });

      if (checkoutData.url) {
        // Save billing info to submission before redirecting
        await onComplete({
          ...data,
          stripe_session_id: checkoutData.sessionId,
          stripe_customer_id: checkoutData.customerId,
        });

        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Payment step error:", error);
      setError(error.message || "Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingPlans = {
    starter: {
      name: "Starter",
      price: "$49",
      period: "/month",
      features: [
        "2,500 SMS messages/month",
        "3 team members",
        "3 phone numbers",
        "Basic support",
        "Standard compliance",
      ],
    },
    professional: {
      name: "Professional",
      price: "$149",
      period: "/month",
      features: [
        "10,000 SMS messages/month",
        "10 team members",
        "10 phone numbers",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "50,000+ SMS messages/month",
        "Unlimited team members",
        "Unlimited phone numbers",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantees",
      ],
    },
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 hub-text-primary" />
            Choose Your Plan
          </CardTitle>
          <CardDescription>
            Select the plan that best fits your messaging needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(pricingPlans).map(([key, plan]) => (
              <div
                key={key}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  form.watch("plan_tier") === key
                    ? "border-hub-primary bg-hub-primary/10 shadow-lg scale-105"
                    : "border-border hover:border-hub-primary/50 hover:shadow-md"
                }`}
                onClick={() => {
                  form.setValue("plan_tier", key as any);
                  setSelectedPlan(key as any);
                }}
              >
                {key === "professional" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-hub-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold hub-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 hub-text-primary" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Enter your billing details for payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="billing_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="billing@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billing_zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="hub-bg-primary hover:hub-bg-primary/90"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? "Processing..." : "Continue to Checkout"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
