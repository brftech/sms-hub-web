/**
 * TCR (The Campaign Registry) validation utilities
 * Ensures compliance with TCR requirements for brand and campaign registration
 */

/**
 * Validates EIN format (XX-XXXXXXX)
 */
export function validateEIN(ein: string): boolean {
  const einRegex = /^\d{2}-?\d{7}$/;
  return einRegex.test(ein.replace(/\s/g, ""));
}

/**
 * Formats EIN to XX-XXXXXXX format
 */
export function formatEIN(ein: string): string {
  const cleaned = ein.replace(/[^\d]/g, "");
  if (cleaned.length !== 9) return ein;
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
}

/**
 * Validates website URL
 */
export function validateWebsite(url: string): boolean {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates US phone number for TCR compliance
 */
export function validateTCRPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === "1");
}

/**
 * Formats US phone number to E.164 format
 */
export function formatPhoneToE164(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+${cleaned}`;
  }
  return phone;
}

/**
 * Validates ZIP code (5 digits or ZIP+4)
 */
export function validateZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

/**
 * Validates call-to-action meets TCR requirements
 */
export function validateCallToAction(text: string): {
  valid: boolean;
  error?: string;
} {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Call to action is required" };
  }

  if (text.trim().length < 40) {
    return {
      valid: false,
      error: `Call to action must be at least 40 characters (currently ${text.trim().length})`,
    };
  }

  return { valid: true };
}

/**
 * Validates brand data for TCR submission
 */
export interface TCRBrandValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Helper function to safely get string value
function getStringValue(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

export function validateTCRBrandData(
  data: Record<string, unknown>
): TCRBrandValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  if (!getStringValue(data, "company_legal_name").trim()) {
    errors.company_legal_name = "Legal company name is required";
  }

  const ein = getStringValue(data, "ein");
  if (!ein.trim()) {
    errors.ein = "EIN is required";
  } else if (!validateEIN(ein)) {
    errors.ein = "EIN must be in format XX-XXXXXXX";
  }

  const website = getStringValue(data, "company_website");
  if (!website.trim()) {
    errors.company_website = "Company website is required";
  } else if (!validateWebsite(website)) {
    errors.company_website = "Please enter a valid website URL";
  }

  if (!getStringValue(data, "address_street").trim()) {
    errors.address_street = "Street address is required";
  }

  if (!getStringValue(data, "address_city").trim()) {
    errors.address_city = "City is required";
  }

  const state = getStringValue(data, "address_state");
  if (!state.trim()) {
    errors.address_state = "State is required";
  } else if (state.length !== 2) {
    errors.address_state = "State must be 2-letter code (e.g., CA)";
  }

  const zip = getStringValue(data, "address_postal_code");
  if (!zip.trim()) {
    errors.address_postal_code = "ZIP code is required";
  } else if (!validateZipCode(zip)) {
    errors.address_postal_code = "Please enter a valid ZIP code";
  }

  if (!getStringValue(data, "industry").trim()) {
    errors.industry = "Industry is required";
  }

  if (!getStringValue(data, "vertical_type").trim()) {
    errors.vertical_type = "Vertical type is required";
  }

  if (!getStringValue(data, "legal_form").trim()) {
    errors.legal_form = "Legal form is required";
  }

  // Contact information
  if (!getStringValue(data, "contact_first_name").trim()) {
    errors.contact_first_name = "Contact first name is required";
  }

  if (!getStringValue(data, "contact_last_name").trim()) {
    errors.contact_last_name = "Contact last name is required";
  }

  const email = getStringValue(data, "contact_email");
  if (!email.trim()) {
    errors.contact_email = "Contact email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.contact_email = "Please enter a valid email address";
  }

  const phone = getStringValue(data, "contact_phone");
  if (!phone.trim()) {
    errors.contact_phone = "Contact phone is required";
  } else if (!validateTCRPhoneNumber(phone)) {
    errors.contact_phone = "Please enter a valid US phone number";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates campaign data for TCR submission
 */
export interface TCRCampaignValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export function validateTCRCampaignData(
  data: Record<string, unknown>
): TCRCampaignValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // Required fields
  if (!getStringValue(data, "campaign_name").trim()) {
    errors.campaign_name = "Campaign name is required";
  }

  const description = getStringValue(data, "description");
  if (!description.trim()) {
    errors.description = "Campaign description is required";
  } else if (description.trim().length < 40) {
    errors.description = "Description must be at least 40 characters";
  }

  if (!getStringValue(data, "message_flow").trim()) {
    errors.message_flow = "Message flow description is required";
  }

  if (!getStringValue(data, "use_case").trim()) {
    errors.use_case = "Use case is required";
  }

  const callToAction = getStringValue(data, "call_to_action");
  if (!callToAction.trim()) {
    errors.call_to_action = "Call to action is required";
  } else {
    const ctaValidation = validateCallToAction(callToAction);
    if (!ctaValidation.valid) {
      errors.call_to_action = ctaValidation.error!;
    }
  }

  // Sample messages
  const sampleMessages = data.sample_messages as string[] | undefined;
  const validSamples = sampleMessages?.filter((msg: string) => msg?.trim());
  if (!validSamples || validSamples.length === 0) {
    errors.sample_messages = "At least one sample message is required";
  } else if (validSamples.length > 5) {
    errors.sample_messages = "Maximum 5 sample messages allowed";
  }

  // Compliance messages
  if (!getStringValue(data, "opt_in_message").trim()) {
    errors.opt_in_message = "Opt-in message is required";
  }

  if (!getStringValue(data, "opt_out_message").trim()) {
    errors.opt_out_message = "Opt-out message is required";
  }

  if (!getStringValue(data, "help_message").trim()) {
    errors.help_message = "Help message is required";
  }

  // Warnings for special use cases
  if (data.direct_lending) {
    warnings.push(
      "Direct lending campaigns require additional compliance review"
    );
  }

  if (data.age_gated) {
    warnings.push("Age-gated content requires age verification process");
  }

  if (data.affiliate_marketing) {
    warnings.push(
      "Affiliate marketing campaigns have stricter approval requirements"
    );
  }

  const monthlyVolume =
    typeof data.monthly_volume === "number" ? data.monthly_volume : 0;
  if (monthlyVolume > 100000) {
    warnings.push("High-volume campaigns may require additional vetting");
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if all required TCR fields are present for API submission
 */
export function hasAllTCRFields(
  brandData: Record<string, unknown>,
  campaignData: Record<string, unknown>
): boolean {
  const brandValidation = validateTCRBrandData(brandData);
  const campaignValidation = validateTCRCampaignData(campaignData);

  return brandValidation.valid && campaignValidation.valid;
}
