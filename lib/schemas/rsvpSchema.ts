import { z } from 'zod';

// Define the schema for RSVP form validation
export const RSVPSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' })
    .transform((val) => val.replace(/\-/g, '')) // Remove dashes before validation
    .refine((val) => /^(\+?60)[0|1|2|3|4|6|7|8|9][0-9]{8,9}$/.test(val), {
      message: 'Please enter a valid Malaysian phone number (e.g., +60123456789)'
    }),
  pax: z.number().min(1, { message: 'Number of guests must be at least 1' })
    .max(10, { message: 'Maximum 10 guests allowed' }),
  hcaptchaToken: z.string().min(1, { message: 'Please complete the captcha verification' }),
});

export type RSVPFormState = {
  message: string;
  errors?: {
    name?: string[];
    phone?: string[];
    pax?: string[];
    hcaptchaToken?: string[];
    general?: string[]; // For errors not specific to a field
  };
  success: boolean;
}; 