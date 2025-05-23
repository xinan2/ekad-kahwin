'use client';

import { useActionState, useTransition, useEffect, useId } from 'react';
import { useForm, Controller, SubmitHandler, Control, FieldErrors, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WeddingDetailsSchema, WeddingDetailsFormState } from '@/lib/schemas/weddingDetailsSchema';
import { updateWeddingDetails } from '@/lib/actions/weddingDetailsActions';
import { useRouter } from 'next/navigation';

// Define the inferred type for convenience
type WeddingDetailsFormValues = z.infer<typeof WeddingDetailsSchema>;

interface FormInputRowProps {
  label: string;
  fieldName: keyof WeddingDetailsFormValues;
  control: Control<WeddingDetailsFormValues>;
  errors: FieldErrors<WeddingDetailsFormValues>;
  isTextArea?: boolean;
  placeholder?: string;
  required?: boolean;
  labelEnMs?: boolean;
  variant?: 'en' | 'ms';
}

const FormInputRow: React.FC<FormInputRowProps> = ({ 
  label,
  fieldName,
  control,
  errors,
  isTextArea = false,
  placeholder,
  required = true,
  labelEnMs = false,
  variant
}) => {
  const inputId = useId();
  const fieldError = errors[fieldName]?.message;
  
  let displayLabel = label;
  if (labelEnMs) {
    displayLabel = variant === 'ms' ? `${label} (MS)` : `${label} (EN)`;
  }

  return (
    <div className="mb-6">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {displayLabel} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id={inputId}
              rows={3}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${fieldError ? 'border-red-500' : ''}`}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              value={field.value || ''}
            />
          )}
        />
      ) : (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={inputId}
              type={fieldName.includes('url') ? 'url' : fieldName.includes('phone') ? 'tel' : 'text'} 
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${fieldError ? 'border-red-500' : ''}`}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              value={field.value || ''}
            />
          )}
        />
      )}
      {fieldError && <p className="mt-1 text-xs text-red-500">{String(fieldError)}</p>}
    </div>
  );
};

interface SubmitButtonProps {
  isPending: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 transition-colors"
    >
      {isPending ? 'Saving Changes...' : 'Save Changes'}
    </button>
  );
};

interface WeddingDetailsFormProps {
  initialDetails: WeddingDetailsFormValues;
}

const WeddingDetailsForm: React.FC<WeddingDetailsFormProps> = ({ initialDetails }) => {
  const router = useRouter();
  const [formState, formAction] = useActionState<WeddingDetailsFormState, FormData>(
    updateWeddingDetails,
    { message: '', success: false, errors: {} }
  );
  const [isPending, startTransition] = useTransition();

        const {    control,    handleSubmit,    formState: { errors },  } = useForm<WeddingDetailsFormValues>({    resolver: zodResolver(WeddingDetailsSchema) as Resolver<WeddingDetailsFormValues>,    defaultValues: initialDetails,  });

  useEffect(() => {
    if (formState.success) {
      router.push('/admin');
    }
  }, [formState.success, router]);

  const onSubmit: SubmitHandler<WeddingDetailsFormValues> = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key as keyof WeddingDetailsFormValues];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    }
    startTransition(() => {
      formAction(formData);
    });
  };
  
  const formFields: Array<{
    label: string, 
    fieldName: keyof WeddingDetailsFormValues, 
    isTextArea?: boolean, 
    placeholder?: string, 
    labelEnMs?: boolean,
    required?: boolean 
  }> = [
    { label: 'Groom Name', fieldName: 'groom_name' },
    { label: 'Bride Name', fieldName: 'bride_name' },
    { label: 'Wedding Date', fieldName: 'wedding_date', labelEnMs: true },
    { label: 'Wedding Date', fieldName: 'wedding_date_ms', labelEnMs: true },
    { label: 'Ceremony Start Time', fieldName: 'ceremony_time_start', placeholder: 'e.g., 02:00 PM' },
    { label: 'Ceremony End Time', fieldName: 'ceremony_time_end', placeholder: 'e.g., 03:00 PM' },
    { label: 'Reception Start Time', fieldName: 'reception_time_start', placeholder: 'e.g., 08:00 PM' },
    { label: 'Reception End Time', fieldName: 'reception_time_end', placeholder: 'e.g., 10:00 PM' },
    { label: 'Venue Name', fieldName: 'venue_name' },
    { label: 'Venue Address', fieldName: 'venue_address', isTextArea: true },
    { label: 'Venue Google Maps URL', fieldName: 'venue_google_maps_url', placeholder: 'https://maps.app.goo.gl/...', required: false },
    
    { label: 'Contact 1 Name', fieldName: 'contact1_name' },
    { label: 'Contact 1 Phone', fieldName: 'contact1_phone', placeholder: 'e.g., 012-3456789' },
    { label: 'Contact 1 Label', fieldName: 'contact1_label_en', labelEnMs: true },
    { label: 'Contact 1 Label', fieldName: 'contact1_label_ms', labelEnMs: true },

    { label: 'Contact 2 Name', fieldName: 'contact2_name' },
    { label: 'Contact 2 Phone', fieldName: 'contact2_phone', placeholder: 'e.g., 012-3456789' },
    { label: 'Contact 2 Label', fieldName: 'contact2_label_en', labelEnMs: true },
    { label: 'Contact 2 Label', fieldName: 'contact2_label_ms', labelEnMs: true },

    { label: 'Contact 3 Name', fieldName: 'contact3_name', required: false },
    { label: 'Contact 3 Phone', fieldName: 'contact3_phone', placeholder: 'e.g., 012-3456789', required: false },
    { label: 'Contact 3 Label', fieldName: 'contact3_label_en', labelEnMs: true, required: false },
    { label: 'Contact 3 Label', fieldName: 'contact3_label_ms', labelEnMs: true, required: false },
    
    { label: 'Contact 4 Name', fieldName: 'contact4_name', required: false },
    { label: 'Contact 4 Phone', fieldName: 'contact4_phone', placeholder: 'e.g., 012-3456789', required: false },
    { label: 'Contact 4 Label', fieldName: 'contact4_label_en', labelEnMs: true, required: false },
    { label: 'Contact 4 Label', fieldName: 'contact4_label_ms', labelEnMs: true, required: false },

    { label: 'RSVP Deadline', fieldName: 'rsvp_deadline', labelEnMs: true },
    { label: 'RSVP Deadline', fieldName: 'rsvp_deadline_ms', labelEnMs: true },
    { label: 'Event Type', fieldName: 'event_type_en', labelEnMs: true },
    { label: 'Event Type', fieldName: 'event_type_ms', labelEnMs: true },
    { label: 'Dress Code', fieldName: 'dress_code_en', labelEnMs: true },
    { label: 'Dress Code', fieldName: 'dress_code_ms', labelEnMs: true },
    { label: 'Parking Info', fieldName: 'parking_info_en', isTextArea: true, labelEnMs: true },
    { label: 'Parking Info', fieldName: 'parking_info_ms', isTextArea: true, labelEnMs: true },
    { label: 'Food Info', fieldName: 'food_info_en', isTextArea: true, labelEnMs: true },
    { label: 'Food Info', fieldName: 'food_info_ms', isTextArea: true, labelEnMs: true },
    { label: 'Invitation Note', fieldName: 'invitation_note_en', isTextArea: true, labelEnMs: true },
    { label: 'Invitation Note', fieldName: 'invitation_note_ms', isTextArea: true, labelEnMs: true },
    
    // New invitation card fields
    { label: 'Groom Title', fieldName: 'groom_title_en', labelEnMs: true, required: false },
    { label: 'Groom Title', fieldName: 'groom_title_ms', labelEnMs: true, required: false },
    { label: 'Bride Title', fieldName: 'bride_title_en', labelEnMs: true, required: false },
    { label: 'Bride Title', fieldName: 'bride_title_ms', labelEnMs: true, required: false },
    { label: 'Groom Father Name', fieldName: 'groom_father_name', required: false },
    { label: 'Groom Mother Name', fieldName: 'groom_mother_name', required: false },
    { label: 'Bride Father Name', fieldName: 'bride_father_name', required: false },
    { label: 'Bride Mother Name', fieldName: 'bride_mother_name', required: false },
    { label: 'Bismillah Text', fieldName: 'bismillah_text_en', isTextArea: true, labelEnMs: true, required: false },
    { label: 'Bismillah Text', fieldName: 'bismillah_text_ms', isTextArea: true, labelEnMs: true, required: false },
    { label: 'With Pleasure Text', fieldName: 'with_pleasure_text_en', labelEnMs: true, required: false },
    { label: 'With Pleasure Text', fieldName: 'with_pleasure_text_ms', labelEnMs: true, required: false },
    { label: 'Together With Text', fieldName: 'together_with_text_en', labelEnMs: true, required: false },
    { label: 'Together With Text', fieldName: 'together_with_text_ms', labelEnMs: true, required: false },
    { label: 'Invitation Message', fieldName: 'invitation_message_en', isTextArea: true, labelEnMs: true, required: false },
    { label: 'Invitation Message', fieldName: 'invitation_message_ms', isTextArea: true, labelEnMs: true, required: false },
    { label: 'Cordially Invite Text', fieldName: 'cordially_invite_text_en', isTextArea: true, labelEnMs: true, required: false },
    { label: 'Cordially Invite Text', fieldName: 'cordially_invite_text_ms', isTextArea: true, labelEnMs: true, required: false },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {formFields.map((fieldConfig, index) => (
            <FormInputRow 
              key={`${fieldConfig.fieldName}-${index}`}
              label={fieldConfig.label}
              fieldName={fieldConfig.fieldName}
              control={control}
              errors={errors}
              isTextArea={fieldConfig.isTextArea}
              placeholder={fieldConfig.placeholder}
              required={fieldConfig.required !== undefined ? fieldConfig.required : !WeddingDetailsSchema.shape[fieldConfig.fieldName].isOptional()}
              labelEnMs={fieldConfig.labelEnMs}
              variant={fieldConfig.fieldName.endsWith('_ms') ? 'ms' : 'en'}
            />
        ))}
      </div>

      <SubmitButton isPending={isPending} />

      {formState?.message && (
        <div className={`p-3 mt-4 rounded-md text-sm ${formState.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {formState.message}
          {formState.errors?.general && (
            <ul className="list-disc list-inside mt-1">
              {formState.errors.general.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          )}
        </div>
      )}
    </form>
  );
};

export default WeddingDetailsForm; 