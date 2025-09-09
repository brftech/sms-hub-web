// Client utilities for the Web app
import { Client, ClientConfig, ClientBranding } from "../types";

// Client data management
export const getClientById = (
  clients: Client[],
  id: string
): Client | undefined => {
  return clients.find((client) => client.id === id);
};

export const getClientBySlug = (
  clients: Client[],
  slug: string
): Client | undefined => {
  return clients.find((client) => client.slug === slug);
};

export const getActiveClients = (clients: Client[]): Client[] => {
  return clients.filter((client) => client.isActive);
};

// Client configuration helpers
export const getClientConfig = (client: Client): ClientConfig => {
  return {
    branding: {
      primaryColor: client.primaryColor || "#000000",
      secondaryColor: client.secondaryColor || "#666666",
      logo: client.logo || "",
      textLogo: client.logo || "",
      iconLogo: client.logo || "",
    },
    messaging: {
      tone: "professional",
      greeting: `Welcome to ${client.name}`,
      signature: `Best regards, ${client.name} Team`,
    },
    features: {
      smsEnabled: true,
      emailEnabled: true,
      phoneEnabled: true,
      webEnabled: true,
    },
  };
};

// Client branding helpers
export const getClientBranding = (client: Client): ClientBranding => {
  return {
    clientId: client.id,
    colors: {
      primary: client.primaryColor || "#000000",
      secondary: client.secondaryColor || "#666666",
      background: "#ffffff",
      text: "#000000",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    spacing: {
      small: "0.5rem",
      medium: "1rem",
      large: "2rem",
    },
  };
};

// Client validation
export const validateClient = (
  client: Partial<Client>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!client.name || client.name.trim().length === 0) {
    errors.push("Client name is required");
  }

  if (!client.slug || client.slug.trim().length === 0) {
    errors.push("Client slug is required");
  }

  if (client.slug && !/^[a-z0-9-]+$/.test(client.slug)) {
    errors.push(
      "Client slug must contain only lowercase letters, numbers, and hyphens"
    );
  }

  if (client.website && !isValidUrl(client.website)) {
    errors.push("Client website must be a valid URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// URL validation helper
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
