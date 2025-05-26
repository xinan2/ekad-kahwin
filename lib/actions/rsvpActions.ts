'use server';

import { rsvpResponses } from '@/lib/auth';
import { RSVPSchema, RSVPFormState } from '@/lib/db/schema';
import { sanitizeText, sanitizePhone, logSecurityEvent } from '@/lib/input-sanitizer';

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
    // 1. Extract and sanitize inputs
    const rawName = sanitizeText(formData.get('name') as string || '', 100);
    const rawPhone = sanitizePhone(formData.get('phone') as string || '');
    const rawPax = Math.max(1, Math.min(parseInt(formData.get('pax') as string) || 1, 10));
    const rawToken = formData.get('hcaptchaToken') as string || '';
    // Removed explicit type check and length truncation for hCaptcha token.
    // The token is expected to be a string from the form data.
    // If it's null/undefined, it defaults to an empty string.
    // The Zod schema will then validate if it's a non-empty string before verification.
    
    // Log if inputs were suspicious
    const originalName = formData.get('name') as string || '';
    const originalPhone = formData.get('phone') as string || '';
    if (rawName !== originalName || rawPhone !== originalPhone) {
      logSecurityEvent('RSVP_INPUT_SANITIZED', {
        nameChanged: rawName !== originalName,
        phoneChanged: rawPhone !== originalPhone
      });
    }
    
    // 2. Normalize phone number
    const normalizedPhone = normalizePhoneNumber(rawPhone);

    // 3. Validate form data (using sanitized and normalized data)
    const validatedFields = RSVPSchema.safeParse({
      name: rawName,
      phone: normalizedPhone,
      pax: rawPax,
      hcaptchaToken: rawToken,
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { name, phone, pax, hcaptchaToken } = validatedFields.data;

    // 4. Verify hCaptcha token
    const isValidCaptcha = await verifyHCaptcha(hcaptchaToken);
    if (!isValidCaptcha) {
      return {
        message: 'Captcha verification failed. Please try again.',
        errors: { hcaptchaToken: ['Captcha verification failed. Please try again.'] },
        success: false,
      };
    }

    // 5. Create RSVP response (phone number is already normalized with +60)
    const result = await rsvpResponses.createResponse(name, phone, pax);

    if (!result.success) {
      return {
        message: result.error || 'Failed to submit RSVP',
        errors: { general: [result.error || 'Failed to submit RSVP'] },
        success: false,
      };
    }

    // 6. Return success state
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