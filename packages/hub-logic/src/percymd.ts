export const PERCYMD_FEATURES = {
  HIPAA_COMPLIANCE: "hipaa_compliance",
  HEALTHCARE_PROVIDERS: "healthcare_providers",
  PATIENT_COMMUNICATION: "patient_communication",
  MEDICAL_PRACTICE_SUPPORT: "medical_practice_support",
} as const;

export const PERCYMD_PROVIDER_TYPES = [
  "Primary Care Practice",
  "Specialty Clinic",
  "Hospital System",
  "Urgent Care",
  "Mental Health Practice",
  "Dental Practice",
  "Veterinary Clinic",
  "Physical Therapy",
  "Other Healthcare Provider",
] as const;

export const getPercyMDOnboardingRequirements = () => {
  return {
    hipaaCompliance: true,
    additionalVerification: true,
    complianceDocuments: [
      "Medical License",
      "DEA Registration (if applicable)",
      "HIPAA Compliance Attestation",
      "Business Associate Agreement",
      "Professional Liability Insurance",
    ],
    requiredTerms: [
      "HIPAA Business Associate Agreement",
      "Healthcare Communication Guidelines",
      "Patient Privacy Requirements",
      "Medical Practice Terms",
    ],
  };
};

export const validatePercyMDCompliance = (data: {
  providerType: string;
  hasMedicalLicense: boolean;
  hasHipaaTraining: boolean;
  hasBusinessAssociateAgreement: boolean;
  hasLiabilityInsurance: boolean;
}) => {
  const errors: string[] = [];

  if (!PERCYMD_PROVIDER_TYPES.includes(data.providerType as string)) {
    errors.push("Invalid provider type selection for PercyMD platform");
  }

  if (!data.hasMedicalLicense) {
    errors.push("Valid medical license is required");
  }

  if (!data.hasHipaaTraining) {
    errors.push("HIPAA compliance training certification is required");
  }

  if (!data.hasBusinessAssociateAgreement) {
    errors.push("Business Associate Agreement acceptance is required");
  }

  if (!data.hasLiabilityInsurance) {
    errors.push("Professional liability insurance is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getHIPAAMessageGuidelines = () => {
  return {
    allowedContent: [
      "Appointment reminders",
      "General health tips",
      "Prescription ready notifications",
      "Office announcements",
      "Wellness program information",
    ],
    prohibitedContent: [
      "Specific medical conditions",
      "Treatment details",
      "Lab results",
      "Medication names",
      "Personal health information",
    ],
    bestPractices: [
      "Use patient-preferred communication method",
      "Include opt-out instructions in every message",
      "Limit to appointment reminders and general health info",
      "Never include PHI in messages",
      "Verify patient identity before communication",
    ],
  };
};
