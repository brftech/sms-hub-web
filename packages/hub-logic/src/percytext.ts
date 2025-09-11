export const PERCYTEXT_FEATURES = {
  ADVANCED_TEXTING: "advanced_texting",
  SMS_AUTOMATION: "sms_automation",
  INTEGRATION_FOCUS: "integration_focus",
  DEVELOPER_TOOLS: "developer_tools",
  API_ACCESS: "api_access",
} as const;

export const PERCYTEXT_INTEGRATIONS = [
  "Zapier",
  "Salesforce",
  "HubSpot",
  "Mailchimp",
  "Shopify",
  "WooCommerce",
  "Custom API",
  "Webhook Endpoints",
] as const;

export const getPercyTextAdvancedFeatures = () => {
  return {
    automation: {
      triggers: [
        "New Customer",
        "Abandoned Cart",
        "Event Reminder",
        "Follow-up",
      ],
      actions: ["Send SMS", "Add to Campaign", "Update Contact", "Create Task"],
      conditions: [
        "Time Delay",
        "Customer Segment",
        "Previous Interaction",
        "Custom Field",
      ],
    },
    apiAccess: {
      endpoints: [
        "Send Message",
        "Manage Contacts",
        "Campaign Management",
        "Analytics API",
        "Webhook Configuration",
      ],
      authentication: ["API Key", "OAuth 2.0", "JWT"],
      rateLimit: "1000 requests/hour",
    },
    developerTools: {
      sdks: ["JavaScript", "Python", "PHP", "Ruby"],
      webhooks: ["Message Status", "Delivery Reports", "Opt-out Events"],
      testing: ["Sandbox Environment", "Test Phone Numbers", "API Testing"],
    },
  };
};

export const validatePercyTextIntegration = (data: {
  integrationType: string;
  apiCredentials?: Record<string, string>;
  webhookUrl?: string;
}) => {
  const errors: string[] = [];

  if (!PERCYTEXT_INTEGRATIONS.includes(data.integrationType as string)) {
    errors.push("Invalid integration type selected");
  }

  if (data.integrationType === "Custom API" && !data.apiCredentials) {
    errors.push("API credentials are required for custom integrations");
  }

  if (data.webhookUrl && !/^https?:\/\/.+/.test(data.webhookUrl)) {
    errors.push("Webhook URL must be a valid HTTPS URL");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
