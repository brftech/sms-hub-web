/**
 * DEPRECATED: Use getHubColors from @sms-hub/hub-logic instead
 * This file is kept for backwards compatibility only
 */

import { HubType } from "./types";

/**
 * @deprecated Import getHubColors from @sms-hub/hub-logic instead
 */
export const getHubColorClasses = (currentHub: HubType) => {
  // Import dynamically to avoid circular dependencies
  // In the future, consumers should import directly from @sms-hub/hub-logic
  const { getHubColors } = require("@sms-hub/hub-logic");
  const colors = getHubColors(currentHub);
  return colors.tailwind;
};
