export * from "./hub";
export * from "./sms";
export * from "./validation";
export * from "./hub-colors";
export * from "./errors";
export * from "./validation-advanced";
export * from "./logger";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
