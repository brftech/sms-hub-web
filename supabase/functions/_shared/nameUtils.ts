/**
 * @deprecated This file has been moved to @sms-hub/utils
 *
 * Edge Functions now import from the centralized package.
 * This file is kept temporarily for reference but should not be used.
 *
 * Import from: ../../../../../../packages/utils/src/nameUtils.ts
 * Or use the exported version from the package
 */

// Re-export from the centralized location
export type { ParsedName } from "../../../../../../packages/utils/src/nameUtils.ts";
export {
  parseFullName,
  formatFullName,
  getDisplayName,
} from "../../../../../../packages/utils/src/nameUtils.ts";
