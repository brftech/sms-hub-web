export * from "./hub";
export * from "./sms";
export * from "./validation";
// hub-colors.ts is deprecated - use getHubColors() from @sms-hub/hub-logic instead
// export * from "./hub-colors";
export * from "./errors";
export * from "./validation-advanced";
// Logger removed - using console for debugging
export * from "./tcr-validation";
export * from "./crossAppRedirects";
export * from "./nameUtils";

// React hooks
export * from "./useScrollToTop";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
