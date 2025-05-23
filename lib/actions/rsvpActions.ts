'use server';

import { rsvpResponses } from '@/lib/auth';
import { RSVPSchema, RSVPFormState } from '@/lib/schemas/rsvpSchema';

// Phone number normalization for Malaysian numbers
function normalizePhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +60 for Malaysian numbers
  if (cleaned.match(/^[0-9]/)) {
    // If it starts with 0, replace with +60
    if (cleaned.startsWith('0')) {
      cleaned = '+60' + cleaned.substring(1);
    } else {
      cleaned = '+60' + cleaned;
    }
  }
  
  // If it starts with 60, prepend +
  if (cleaned.startsWith('60') && !cleaned.startsWith('+60')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

// Server-side hCaptcha verification function
async function verifyHCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY not found in environment variables');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}

export async function submitRSVP(
  prevState: RSVPFormState, 
  formData: FormData
): Promise<RSVPFormState> {
  try {
    // 1. Extract and normalize phone number
    const rawPhone = formData.get('phone') as string;
    const normalizedPhone = normalizePhoneNumber(rawPhone);

    // 2. Validate form data (using normalized phone)
    const validatedFields = RSVPSchema.safeParse({
      name: formData.get('name'),
      phone: normalizedPhone,
      pax: parseInt(formData.get('pax') as string) || 0,
      hcaptchaToken: formData.get('hcaptchaToken'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { name, phone, pax, hcaptchaToken } = validatedFields.data;

    // 3. Verify hCaptcha token
    const isValidCaptcha = await verifyHCaptcha(hcaptchaToken);
    if (!isValidCaptcha) {
      return {
        message: 'Captcha verification failed. Please try again.',
        errors: { hcaptchaToken: ['Captcha verification failed. Please try again.'] },
        success: false,
      };
    }

    // 4. Create RSVP response (phone number is already normalized with +60)
    const result = await rsvpResponses.createResponse(name, phone, pax);

    if (!result.success) {
      return {
        message: result.error || 'Failed to submit RSVP',
        errors: { general: [result.error || 'Failed to submit RSVP'] },
        success: false,
      };
    }

    // 5. Return success state
    return {
      message: 'RSVP submitted successfully! Thank you for confirming your attendance.',
      success: true,
    };

  } catch (error) {
    console.error('RSVP action error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: { general: ['An unexpected error occurred. Please try again.'] },
      success: false,
    };
  }
} 