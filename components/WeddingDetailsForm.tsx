'use client';

import React, { useEffect, useTransition, useState } from 'react';
import { useForm, Controller, Control, FieldErrors, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WeddingDetailsSchema, WeddingDetailsFormState } from '@/lib/db/schema';
import { updateWeddingDetails } from '@/lib/actions/weddingDetailsActions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

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
  const fieldError = errors[fieldName]?.message;
  const inputId = `${fieldName}-${variant || 'default'}`;
  
  // Enhanced label with language indicator
  const displayLabel = labelEnMs 
    ? `${label} ${variant === 'ms' ? '(Malay)' : '(English)'}`
    : label;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {displayLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
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
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm resize-vertical ${fieldError ? 'border-red-500' : ''}`}
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

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  description, 
  children, 
  defaultOpen = true,
  icon 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-green-600">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface SubmitButtonProps {
  isPending: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending }) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6">
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 transition-colors"
      >
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </div>
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WeddingDetailsFormValues>({
    resolver: zodResolver(WeddingDetailsSchema) as Resolver<WeddingDetailsFormValues>,
    defaultValues: initialDetails,
  });

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

  // Icons for sections
  const CoupleIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ContactIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const FamilyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const InfoIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const GiftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Couple Information */}
        <CollapsibleSection
          title="Couple Information"
          description="Basic details about the bride and groom"
          icon={<CoupleIcon />}
          defaultOpen={true}
        >
          <FormInputRow 
            label="Groom Name"
            fieldName="groom_name"
            control={control}
            errors={errors}
            required={true}
          />
          <FormInputRow 
            label="Bride Name"
            fieldName="bride_name"
            control={control}
            errors={errors}
            required={true}
          />
          <FormInputRow 
            label="Groom Title"
            fieldName="groom_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Groom Title"
            fieldName="groom_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
          <FormInputRow 
            label="Bride Title"
            fieldName="bride_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Bride Title"
            fieldName="bride_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
        </CollapsibleSection>

        {/* Date & Time Information */}
        <CollapsibleSection
          title="Date & Time"
          description="Wedding date and ceremony timings"
          icon={<CalendarIcon />}
          defaultOpen={true}
        >
          <FormInputRow 
            label="Wedding Date"
            fieldName="wedding_date"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Wedding Date"
            fieldName="wedding_date_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Ceremony Start Time"
            fieldName="ceremony_time_start"
            control={control}
            errors={errors}
            placeholder="e.g., 02:00 PM"
            required={false}
          />
          <FormInputRow 
            label="Ceremony End Time"
            fieldName="ceremony_time_end"
            control={control}
            errors={errors}
            placeholder="e.g., 03:00 PM"
            required={false}
          />
          <FormInputRow 
            label="Reception Start Time"
            fieldName="reception_time_start"
            control={control}
            errors={errors}
            placeholder="e.g., 08:00 PM"
            required={false}
          />
          <FormInputRow 
            label="Reception End Time"
            fieldName="reception_time_end"
            control={control}
            errors={errors}
            placeholder="e.g., 10:00 PM"
            required={false}
          />
        </CollapsibleSection>

        {/* Venue Information */}
        <CollapsibleSection
          title="Venue Details"
          description="Location and venue information"
          icon={<LocationIcon />}
          defaultOpen={true}
        >
          <FormInputRow 
            label="Venue Name"
            fieldName="venue_name"
            control={control}
            errors={errors}
            required={true}
          />
          <FormInputRow 
            label="Venue Google Maps URL"
            fieldName="venue_google_maps_url"
            control={control}
            errors={errors}
            placeholder="https://maps.app.goo.gl/..."
            required={false}
          />
          <div className="md:col-span-2">
            <FormInputRow 
              label="Venue Address"
              fieldName="venue_address"
              control={control}
              errors={errors}
              isTextArea={true}
              required={true}
            />
          </div>
        </CollapsibleSection>

        {/* Contact Information */}
        <CollapsibleSection
          title="Contact Information"
          description="Contact details for guests to reach out"
          icon={<ContactIcon />}
          defaultOpen={false}
        >
          {/* Contact 1 */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">Primary Contact</h4>
          </div>
          <FormInputRow 
            label="Contact 1 Name"
            fieldName="contact1_name"
            control={control}
            errors={errors}
            required={true}
          />
          <FormInputRow 
            label="Contact 1 Phone"
            fieldName="contact1_phone"
            control={control}
            errors={errors}
            placeholder="e.g., 012-3456789"
            required={true}
          />
          <FormInputRow 
            label="Contact 1 Label"
            fieldName="contact1_label_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Contact 1 Label"
            fieldName="contact1_label_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />

          {/* Contact 2 */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2 mt-6">Secondary Contact</h4>
          </div>
          <FormInputRow 
            label="Contact 2 Name"
            fieldName="contact2_name"
            control={control}
            errors={errors}
            required={true}
          />
          <FormInputRow 
            label="Contact 2 Phone"
            fieldName="contact2_phone"
            control={control}
            errors={errors}
            placeholder="e.g., 012-3456789"
            required={true}
          />
          <FormInputRow 
            label="Contact 2 Label"
            fieldName="contact2_label_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Contact 2 Label"
            fieldName="contact2_label_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />

          {/* Contact 3 */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2 mt-6">Additional Contact 1 (Optional)</h4>
          </div>
          <FormInputRow 
            label="Contact 3 Name"
            fieldName="contact3_name"
            control={control}
            errors={errors}
            required={false}
          />
          <FormInputRow 
            label="Contact 3 Phone"
            fieldName="contact3_phone"
            control={control}
            errors={errors}
            placeholder="e.g., 012-3456789"
            required={false}
          />
          <FormInputRow 
            label="Contact 3 Label"
            fieldName="contact3_label_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Contact 3 Label"
            fieldName="contact3_label_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />

          {/* Contact 4 */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2 mt-6">Additional Contact 2 (Optional)</h4>
          </div>
          <FormInputRow 
            label="Contact 4 Name"
            fieldName="contact4_name"
            control={control}
            errors={errors}
            required={false}
          />
          <FormInputRow 
            label="Contact 4 Phone"
            fieldName="contact4_phone"
            control={control}
            errors={errors}
            placeholder="e.g., 012-3456789"
            required={false}
          />
          <FormInputRow 
            label="Contact 4 Label"
            fieldName="contact4_label_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Contact 4 Label"
            fieldName="contact4_label_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
        </CollapsibleSection>

        {/* Family Information */}
        <CollapsibleSection
          title="Family Information"
          description="Parents and family details for the invitation (at least one parent per side required)"
          icon={<FamilyIcon />}
          defaultOpen={false}
        >
          {/* Groom's Family */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-2 border-b border-gray-200 pb-2">
              Groom&apos;s Family
              <span className="text-sm text-gray-600 font-normal ml-2">(At least one parent required)</span>
            </h4>
            {/* Show validation error for groom's family if exists */}
            {errors.groom_father_name?.message?.includes("At least one parent") && (
              <p className="text-xs text-red-500 mb-3">At least one parent must be provided for groom&apos;s family</p>
            )}
          </div>
          <FormInputRow 
            label="Groom Father Name"
            fieldName="groom_father_name"
            control={control}
            errors={errors}
            required={false}
            placeholder="Leave empty if not applicable"
          />
          <FormInputRow 
            label="Groom Mother Name"
            fieldName="groom_mother_name"
            control={control}
            errors={errors}
            required={false}
            placeholder="Leave empty if not applicable"
          />
          <FormInputRow 
            label="Groom Father Title"
            fieldName="groom_father_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
            placeholder="e.g., Father of the Groom, Uncle of the Groom"
          />
          <FormInputRow 
            label="Groom Father Title"
            fieldName="groom_father_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
            placeholder="e.g., Ayah Pengantin Lelaki, Pakcik Pengantin Lelaki"
          />
          <FormInputRow 
            label="Groom Mother Title"
            fieldName="groom_mother_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
            placeholder="e.g., Mother of the Groom, Aunt of the Groom"
          />
          <FormInputRow 
            label="Groom Mother Title"
            fieldName="groom_mother_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
            placeholder="e.g., Ibu Pengantin Lelaki, Makcik Pengantin Lelaki"
          />

          {/* Bride's Family */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-900 mb-2 border-b border-gray-200 pb-2 mt-6">
              Bride&apos;s Family
              <span className="text-sm text-gray-600 font-normal ml-2">(At least one parent required)</span>
            </h4>
            {/* Show validation error for bride's family if exists */}
            {errors.groom_father_name?.message?.includes("At least one parent") && (
              <p className="text-xs text-red-500 mb-3">At least one parent must be provided for bride&apos;s family</p>
            )}
          </div>
          <FormInputRow 
            label="Bride Father Name"
            fieldName="bride_father_name"
            control={control}
            errors={errors}
            required={false}
            placeholder="Leave empty if not applicable"
          />
          <FormInputRow 
            label="Bride Mother Name"
            fieldName="bride_mother_name"
            control={control}
            errors={errors}
            required={false}
            placeholder="Leave empty if not applicable"
          />
          <FormInputRow 
            label="Bride Father Title"
            fieldName="bride_father_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
            placeholder="e.g., Father of the Bride, Uncle of the Bride"
          />
          <FormInputRow 
            label="Bride Father Title"
            fieldName="bride_father_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
            placeholder="e.g., Ayah Pengantin Perempuan, Pakcik Pengantin Perempuan"
          />
          <FormInputRow 
            label="Bride Mother Title"
            fieldName="bride_mother_title_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
            placeholder="e.g., Mother of the Bride, Aunt of the Bride"
          />
          <FormInputRow 
            label="Bride Mother Title"
            fieldName="bride_mother_title_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
            placeholder="e.g., Ibu Pengantin Perempuan, Makcik Pengantin Perempuan"
          />
        </CollapsibleSection>

        {/* Invitation Text Customization */}
        <CollapsibleSection
          title="Invitation Text"
          description="Customize the text that appears on your invitation card"
          icon={<DocumentIcon />}
          defaultOpen={false}
        >
          <FormInputRow 
            label="Bismillah Text"
            fieldName="bismillah_text_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Bismillah Text"
            fieldName="bismillah_text_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
          <FormInputRow 
            label="With Pleasure Text"
            fieldName="with_pleasure_text_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="With Pleasure Text"
            fieldName="with_pleasure_text_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
          <FormInputRow 
            label="Together With Text"
            fieldName="together_with_text_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Together With Text"
            fieldName="together_with_text_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
          <FormInputRow 
            label="Invitation Message"
            fieldName="invitation_message_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Invitation Message"
            fieldName="invitation_message_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
          <FormInputRow 
            label="Cordially Invite Text"
            fieldName="cordially_invite_text_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={false}
          />
          <FormInputRow 
            label="Cordially Invite Text"
            fieldName="cordially_invite_text_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={false}
          />
        </CollapsibleSection>

        {/* Event Information */}
        <CollapsibleSection
          title="Event Information"
          description="RSVP deadlines and event details"
          icon={<InfoIcon />}
          defaultOpen={false}
        >
          <FormInputRow 
            label="RSVP Deadline"
            fieldName="rsvp_deadline"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="RSVP Deadline"
            fieldName="rsvp_deadline_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Event Type"
            fieldName="event_type_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Event Type"
            fieldName="event_type_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Dress Code"
            fieldName="dress_code_en"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Dress Code"
            fieldName="dress_code_ms"
            control={control}
            errors={errors}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Parking Info"
            fieldName="parking_info_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Parking Info"
            fieldName="parking_info_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Food Info"
            fieldName="food_info_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Food Info"
            fieldName="food_info_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
          <FormInputRow 
            label="Invitation Note"
            fieldName="invitation_note_en"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="en"
            required={true}
          />
          <FormInputRow 
            label="Invitation Note"
            fieldName="invitation_note_ms"
            control={control}
            errors={errors}
            isTextArea={true}
            labelEnMs={true}
            variant="ms"
            required={true}
          />
        </CollapsibleSection>

        {/* Gift Information */}
        <CollapsibleSection
          title="Gift Information"
          description="QR code and bank details for wedding gifts"
          icon={<GiftIcon />}
          defaultOpen={false}
        >
          <FormInputRow 
            label="QR Code Image URL"
            fieldName="qr_code_url"
            control={control}
            errors={errors}
            placeholder="https://example.com/qr-code.png"
            required={false}
          />
          <div></div>
          <FormInputRow 
            label="QR Owner Name"
            fieldName="qr_owner_name"
            control={control}
            errors={errors}
            placeholder="e.g., Ahmad bin Ali"
            required={false}
          />
          <FormInputRow 
            label="Bank Name"
            fieldName="qr_bank_name"
            control={control}
            errors={errors}
            placeholder="e.g., Maybank, CIMB Bank"
            required={false}
          />
        </CollapsibleSection>

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
    </div>
  );
};

export default WeddingDetailsForm; 