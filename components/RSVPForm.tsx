'use client';

import { useEffect, useActionState, useTransition, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { RSVPSchema, RSVPFormState } from '@/lib/schemas/rsvpSchema';
import { submitRSVP } from '@/lib/actions/rsvpActions';

// Infer form values type from Zod schema
type RSVPFormValues = z.infer<typeof RSVPSchema>;

const initialState: RSVPFormState = {
  message: '',
  success: false,
};

function SubmitButton({ isPending, isHCaptchaVerified }: { isPending: boolean; isHCaptchaVerified: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending || !isHCaptchaVerified}
      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
    >
      {isPending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting RSVP...
        </>
      ) : (
        '✓ Confirm Attendance'
      )}
    </button>
  );
}

interface RSVPFormProps {
  onSuccess?: () => void;
  language: 'en' | 'ms';
}

export default function RSVPForm({ onSuccess, language }: RSVPFormProps) {
  // 1. Server action state management
  const [state, formAction] = useActionState(submitRSVP, initialState);
  
  // 2. Transition for pending UI
  const [isPending, startTransition] = useTransition();

  // 3. hCaptcha state management
  const [hcaptchaToken, setHcaptchaToken] = useState<string>('');
  const hcaptchaRef = useRef<HCaptcha>(null);

  // 4. React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(RSVPSchema),
    defaultValues: {
      name: '',
      phone: '',
      pax: 1,
      hcaptchaToken: '',
    },
  });

  // 5. Effect for success handling
  useEffect(() => {
    if (state.success) {
      reset(); // Clear form
      setHcaptchaToken(''); // Clear hCaptcha token
      hcaptchaRef.current?.resetCaptcha(); // Reset hCaptcha widget
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000); // Show success message for 2 seconds before closing
      }
    }
  }, [state.success, onSuccess, reset]);

  // 6. hCaptcha handlers
  const onHCaptchaVerify = (token: string) => {
    setHcaptchaToken(token);
    setValue('hcaptchaToken', token, { shouldValidate: true });
  };

  const onHCaptchaExpire = () => {
    setHcaptchaToken('');
    setValue('hcaptchaToken', '', { shouldValidate: true });
  };

  const onHCaptchaError = (err: string) => {
    console.error('hCaptcha error:', err);
    setHcaptchaToken('');
    setValue('hcaptchaToken', '', { shouldValidate: true });
  };

  // 7. Phone number formatting helper
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // If it starts with just numbers, prepend +60
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
    
    // Format the number with dashes for readability
    if (cleaned.startsWith('+60') && cleaned.length > 3) {
      const countryCode = '+60';
      const number = cleaned.substring(3);
      
      if (number.length <= 2) {
        return countryCode + number;
      } else if (number.length <= 5) {
        return countryCode + number.substring(0, 2) + '-' + number.substring(2);
      } else if (number.length <= 9) {
        return countryCode + number.substring(0, 2) + '-' + number.substring(2, 5) + '-' + number.substring(5);
      } else {
        // Limit to 10 digits after +60
        const limitedNumber = number.substring(0, 10);
        return countryCode + limitedNumber.substring(0, 2) + '-' + limitedNumber.substring(2, 5) + '-' + limitedNumber.substring(5);
      }
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted, { shouldValidate: true });
  };

  // 8. Form submission handler
  const processSubmit = (data: RSVPFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    // Send formatted phone number - server will normalize to ensure +60 prefix
    const cleanPhone = data.phone.replace(/\-/g, '');
    formData.append('phone', cleanPhone);
    formData.append('pax', data.pax.toString());
    formData.append('hcaptchaToken', hcaptchaToken);
    
    startTransition(() => {
      formAction(formData);
    });
  };

  // Get the site key from environment (safe to expose to client)
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error('NEXT_PUBLIC_HCAPTCHA_SITE_KEY not found');
    return (
      <div className="text-center py-8">
        <div className="text-red-600">
          <p>Configuration error. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Success state UI
  if (state.success) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          {language === 'en' ? 'RSVP Confirmed!' : 'RSVP Disahkan!'}
        </h3>
        <p className="text-green-600 mb-4">{state.message}</p>
        <div className="animate-pulse text-green-500 text-sm">
          {language === 'en' ? 'Closing in a moment...' : 'Menutup sebentar lagi...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💌</div>
        <h3 className="text-lg font-semibold text-green-800">
          {language === 'en' ? 'Confirm Your Attendance' : 'Sahkan Kehadiran Anda'}
        </h3>
        <p className="text-sm text-green-600 mt-1">
          {language === 'en' 
            ? 'Please fill in your details below' 
            : 'Sila isi butiran anda di bawah'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
        {/* Display general errors from server action */}
        {state?.errors?.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.errors.general.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        {!state.success && state.message && !state.errors?.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <p>{state.message}</p>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
            {language === 'en' ? 'Full Name' : 'Nama Penuh'}
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            disabled={isPending}
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
            placeholder={language === 'en' ? 'Enter your full name' : 'Masukkan nama penuh anda'}
            aria-invalid={errors.name || state?.errors?.name ? "true" : "false"}
          />
          {/* Client-side validation error */}
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
          {/* Server-side validation error */}
          {state?.errors?.name && 
            state.errors.name.map((err, i) => (
              <p key={i} className="mt-1 text-xs text-red-600">{err}</p>
            ))}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-green-700 mb-1">
            {language === 'en' ? 'Phone Number' : 'Nombor Telefon'}
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            disabled={isPending}
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
            placeholder={language === 'en' ? 'e.g., 0123456789 or +60123456789' : 'cth: 0123456789 atau +60123456789'}
            aria-invalid={errors.phone || state?.errors?.phone ? "true" : "false"}
            onChange={handlePhoneChange}
          />
          <p className="mt-1 text-xs text-green-600">
            {language === 'en' 
              ? 'Malaysian mobile numbers only. We\'ll automatically add +60 for you.' 
              : 'Nombor telefon Malaysia sahaja. Kami akan tambah +60 secara automatik.'
            }
          </p>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
          {state?.errors?.phone && 
            state.errors.phone.map((err, i) => (
              <p key={i} className="mt-1 text-xs text-red-600">{err}</p>
            ))}
        </div>

        {/* Pax Field */}
        <div>
          <label htmlFor="pax" className="block text-sm font-medium text-green-700 mb-1">
            {language === 'en' ? 'Number of Guests' : 'Bilangan Tetamu'}
          </label>
          <select
            id="pax"
            {...register('pax', { valueAsNumber: true })}
            disabled={isPending}
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
            aria-invalid={errors.pax || state?.errors?.pax ? "true" : "false"}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {language === 'en' 
                  ? (num === 1 ? 'person' : 'people') 
                  : (num === 1 ? 'orang' : 'orang')
                }
              </option>
            ))}
          </select>
          {errors.pax && (
            <p className="mt-1 text-xs text-red-600">{errors.pax.message}</p>
          )}
          {state?.errors?.pax && 
            state.errors.pax.map((err, i) => (
              <p key={i} className="mt-1 text-xs text-red-600">{err}</p>
            ))}
        </div>

        {/* hCaptcha Field */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            {language === 'en' ? 'Security Verification' : 'Pengesahan Keselamatan'}
          </label>
          <div className="flex justify-center">
            <HCaptcha
              ref={hcaptchaRef}
              sitekey={siteKey}
              onVerify={onHCaptchaVerify}
              onExpire={onHCaptchaExpire}
              onError={onHCaptchaError}
              size="normal"
              theme="light"
            />
          </div>
          {/* Hidden input for form validation */}
          <input
            type="hidden"
            {...register('hcaptchaToken')}
            value={hcaptchaToken}
          />
          {/* Client-side validation error */}
          {errors.hcaptchaToken && (
            <p className="mt-1 text-xs text-red-600 text-center">{errors.hcaptchaToken.message}</p>
          )}
          {/* Server-side validation error */}
          {state?.errors?.hcaptchaToken && 
            state.errors.hcaptchaToken.map((err, i) => (
              <p key={i} className="mt-1 text-xs text-red-600 text-center">{err}</p>
            ))}
        </div>

        <SubmitButton isPending={isPending} isHCaptchaVerified={!!hcaptchaToken} />
      </form>
    </div>
  );
} 