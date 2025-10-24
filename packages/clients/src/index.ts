/**
 * @sms-hub/clients
 *
 * Client data and assets for marketing pages
 * Each client has its own folder with colocated data and assets
 */

// Import client data
import { donsbtData } from "./donsbt";
import { brownwatercigarData } from "./brownwatercigar";
import type { ClientData } from "./types";

// Export types
export type { ClientData, ClientColors } from "./types";

// Export combined client data
export const clientData: Record<string, ClientData> = {
  donsbt: donsbtData,
  brownwatercigar: brownwatercigarData,
};

// Export individual clients for direct access
export { donsbtData } from "./donsbt";
export { brownwatercigarData } from "./brownwatercigar";
