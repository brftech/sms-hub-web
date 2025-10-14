/**
 * Form Schemas - Centralized form definitions
 * 
 * All forms in the application are defined here as schemas.
 * This ensures consistency and makes forms easy to modify.
 */

import { FormFieldType } from '@sms-hub/ui';
import { HubType } from '@sms-hub/hub-logic';

/**
 * Contact Form Schema
 * 
 * Dynamically adjusts based on hub type to show hub-specific fields
 */
export function getContactFormFields(hubType: HubType): FormFieldType[] {
  const baseFields: FormFieldType[] = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'John',
      validation: [
        { type: 'required', message: 'First name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
      ],
      autoComplete: 'given-name'
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Doe',
      validation: [
        { type: 'required', message: 'Last name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
      ],
      autoComplete: 'family-name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'john@company.com',
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ],
      autoComplete: 'email'
    },
    {
      name: 'phone',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      validation: [
        { type: 'phone', message: 'Please enter a valid phone number' }
      ],
      autoComplete: 'tel',
      optional: true,
      helpText: 'Optional - We\'ll use this to schedule a call'
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company',
      placeholder: 'Company Name',
      optional: true,
      autoComplete: 'organization',
      helpText: 'Optional'
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Tell us about your venue, your needs, and how we can help elevate your customer communication...',
      rows: 5,
      optional: true,
      helpText: 'Optional'
    }
  ];

  // Hub-specific fields
  switch (hubType) {
    case 'gnymble':
      baseFields.push({
        name: 'businessType',
        type: 'select',
        label: 'Business Type',
        placeholder: 'Select your business type',
        options: [
          { label: 'Tobacco/Cigar Retail', value: 'tobacco' },
          { label: 'Alcohol/Spirits Retail', value: 'alcohol' },
          { label: 'Cannabis Retail', value: 'cannabis' },
          { label: 'Other Retail', value: 'other' }
        ],
        validation: [
          { type: 'required', message: 'Please select your business type' }
        ],
        helpText: 'Helps us understand your compliance needs'
      });
      break;

    case 'percymd':
      baseFields.push({
        name: 'practiceType',
        type: 'select',
        label: 'Practice Type',
        placeholder: 'Select your practice type',
        options: [
          { label: 'Primary Care', value: 'primary' },
          { label: 'Specialty Practice', value: 'specialty' },
          { label: 'Dental', value: 'dental' },
          { label: 'Mental Health', value: 'mental' },
          { label: 'Other Healthcare', value: 'other' }
        ],
        validation: [
          { type: 'required', message: 'Please select your practice type' }
        ],
        helpText: 'Helps us tailor HIPAA-compliant solutions for you'
      });
      break;

    case 'percytech':
      baseFields.push({
        name: 'industryFocus',
        type: 'select',
        label: 'Industry Focus',
        placeholder: 'Select your industry',
        options: [
          { label: 'SaaS/Software', value: 'saas' },
          { label: 'E-commerce', value: 'ecommerce' },
          { label: 'Professional Services', value: 'professional' },
          { label: 'Education', value: 'education' },
          { label: 'Other Technology', value: 'other' }
        ],
        validation: [
          { type: 'required', message: 'Please select your industry' }
        ]
      });
      break;

    case 'percytext':
      baseFields.push({
        name: 'monthlyVolume',
        type: 'select',
        label: 'Expected Monthly SMS Volume',
        placeholder: 'Select expected volume',
        options: [
          { label: 'Under 1,000 messages', value: 'under-1k' },
          { label: '1,000 - 10,000 messages', value: '1k-10k' },
          { label: '10,000 - 50,000 messages', value: '10k-50k' },
          { label: '50,000+ messages', value: '50k-plus' }
        ],
        validation: [
          { type: 'required', message: 'Please select your expected volume' }
        ],
        helpText: 'Helps us recommend the right plan'
      });
      break;
  }

  return baseFields;
}

/**
 * Newsletter Signup Form Schema
 */
export const newsletterFormFields: FormFieldType[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'you@example.com',
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ],
    autoComplete: 'email'
  },
  {
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'John',
    validation: [
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
    ],
    optional: true,
    autoComplete: 'given-name'
  }
];

/**
 * Admin Lead Form Schema
 */
export const adminLeadFormFields: FormFieldType[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full Name',
    validation: [
      { type: 'required', message: 'Name is required' }
    ]
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email' }
    ]
  },
  {
    name: 'phone',
    type: 'phone',
    label: 'Phone',
    validation: [
      { type: 'phone', message: 'Invalid phone number' }
    ],
    optional: true
  },
  {
    name: 'company',
    type: 'text',
    label: 'Company',
    validation: [
      { type: 'required', message: 'Company is required' }
    ]
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Converted', value: 'converted' },
      { label: 'Lost', value: 'lost' }
    ],
    validation: [
      { type: 'required', message: 'Status is required' }
    ]
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    rows: 4,
    optional: true
  }
];

