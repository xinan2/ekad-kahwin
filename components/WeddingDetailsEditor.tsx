'use client';

import { useActionState, useTransition, useEffect } from 'react';
import { useForm, Controller, Control, FieldErrors, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WeddingDetailsSchema, WeddingDetailsFormState } from '@/lib/schemas/weddingDetailsSchema';
import { updateWeddingDetails, getWeddingDetails } from '@/lib/actions/weddingDetailsActions';

interface WeddingDetailsEditorProps {
  onClose: () => void;
}

// Define the inferred type for convenience
type WeddingDetailsFormValues = z.infer<typeof WeddingDetailsSchema>;

const initialState: WeddingDetailsFormState = {
  message: '',
  success: false,
};

// Submit Button Component
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center"
    >
      {isPending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </button>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  name: keyof WeddingDetailsFormValues;
  control: Control<WeddingDetailsFormValues>;
  errors: FieldErrors<WeddingDetailsFormValues>;
  isTextArea?: boolean;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

function FormField({ label, name, control, errors, isTextArea = false, placeholder, required = true, rows = 3 }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-green-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          isTextArea ? (
            <textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <input
              {...field}
              type="text"
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          )
        )}
      />
      {/* Client-side validation error */}
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
  );
}

export default function WeddingDetailsEditor({ onClose }: WeddingDetailsEditorProps) {
  // 1. Server action state management
  const [state, formAction] = useActionState(updateWeddingDetails, initialState);
  
  // 2. Transition for pending UI
  const [isPending, startTransition] = useTransition();

  // 3. React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WeddingDetailsFormValues>({
    resolver: zodResolver(WeddingDetailsSchema),
    defaultValues: {
      groom_name: '',
      bride_name: '',
      wedding_date: '',
      wedding_date_ms: '',
      ceremony_time_start: '',
      ceremony_time_end: '',
      reception_time_start: '',
      reception_time_end: '',
      venue_name: '',
      venue_address: '',
      venue_google_maps_url: '',
      contact1_name: '',
      contact1_phone: '',
      contact1_label_en: '',
      contact1_label_ms: '',
      contact2_name: '',
      contact2_phone: '',
      contact2_label_en: '',
      contact2_label_ms: '',
      contact3_name: '',
      contact3_phone: '',
      contact3_label_en: '',
      contact3_label_ms: '',
      contact4_name: '',
      contact4_phone: '',
      contact4_label_en: '',
      contact4_label_ms: '',
      rsvp_deadline: '',
      rsvp_deadline_ms: '',
      event_type_en: '',
      event_type_ms: '',
      dress_code_en: '',
      dress_code_ms: '',
      parking_info_en: '',
      parking_info_ms: '',
      food_info_en: '',
      food_info_ms: '',
      invitation_note_en: '',
      invitation_note_ms: '',
      // New invitation card fields
      groom_title_en: '',
      groom_title_ms: '',
      bride_title_en: '',
      bride_title_ms: '',
      groom_father_name: '',
      groom_mother_name: '',
      bride_father_name: '',
      bride_mother_name: '',
      bismillah_text_en: 'In the name of Allah, the Most Gracious, the Most Merciful',
      bismillah_text_ms: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang',
      with_pleasure_text_en: 'With great pleasure, we',
      with_pleasure_text_ms: 'Dengan penuh kesyukuran, kami',
      together_with_text_en: 'together with',
      together_with_text_ms: 'bersama',
      invitation_message_en: 'cordially invite you to join us at the Wedding Reception of our beloved children',
      invitation_message_ms: 'menjemput Yang Berbahagia ke majlis perkahwinan anakanda kami',
      cordially_invite_text_en: 'Cordially invite you to join us at the Wedding Reception of our beloved children',
      cordially_invite_text_ms: 'Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami',
    },
  });

  // 4. Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const details = await getWeddingDetails();
        reset(details);
      } catch (error) {
        console.error('Error loading wedding details:', error);
      }
    };
    loadData();
  }, [reset]);

  // 5. Handle successful submission
  useEffect(() => {
    if (state.success) {
      // Auto-close after successful save
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [state.success, onClose]);

  // 6. Form submission handler
  const processSubmit: SubmitHandler<WeddingDetailsFormValues> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value || '');
    });
    
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-green-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-100">
          <h2 className="text-2xl font-bold text-green-800">Edit Wedding Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Messages */}
          {state?.errors?.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {state.errors.general.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          {state.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {state.message}
            </div>
          )}
          {!state.success && state.message && !state.errors?.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {state.message}
            </div>
          )}

          <form onSubmit={handleSubmit(processSubmit)} className="space-y-8">
            {/* Couple Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Couple Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Groom Name" name="groom_name" control={control} errors={errors} />
                <FormField label="Bride Name" name="bride_name" control={control} errors={errors} />
              </div>
            </div>

            {/* Wedding Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Wedding Date</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Date (English)" name="wedding_date" control={control} errors={errors} placeholder="Saturday, Dec 27th 2025" />
                <FormField label="Date (Malay)" name="wedding_date_ms" control={control} errors={errors} placeholder="Sabtu, 27 Dis 2025" />
              </div>
            </div>

            {/* Event Times */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Event Times</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField label="Ceremony Start" name="ceremony_time_start" control={control} errors={errors} placeholder="10:00 AM" />
                <FormField label="Ceremony End" name="ceremony_time_end" control={control} errors={errors} placeholder="12:00 PM" />
                <FormField label="Reception Start" name="reception_time_start" control={control} errors={errors} placeholder="1:00 PM" />
                <FormField label="Reception End" name="reception_time_end" control={control} errors={errors} placeholder="4:00 PM" />
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Venue Information</h3>
              <div className="space-y-4">
                <FormField label="Venue Name" name="venue_name" control={control} errors={errors} />
                <FormField label="Venue Address" name="venue_address" control={control} errors={errors} isTextArea={true} />
                <FormField label="Google Maps URL" name="venue_google_maps_url" control={control} errors={errors} required={false} />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact 1 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Contact 1</h4>
                  <FormField label="Label (English)" name="contact1_label_en" control={control} errors={errors} placeholder="Groom's Family" />
                  <FormField label="Label (Malay)" name="contact1_label_ms" control={control} errors={errors} placeholder="Keluarga Pengantin Lelaki" />
                  <FormField label="Contact Name" name="contact1_name" control={control} errors={errors} />
                  <FormField label="Phone Number" name="contact1_phone" control={control} errors={errors} />
                </div>

                {/* Contact 2 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Contact 2</h4>
                  <FormField label="Label (English)" name="contact2_label_en" control={control} errors={errors} placeholder="Bride's Family" />
                  <FormField label="Label (Malay)" name="contact2_label_ms" control={control} errors={errors} placeholder="Keluarga Pengantin Perempuan" />
                  <FormField label="Contact Name" name="contact2_name" control={control} errors={errors} />
                  <FormField label="Phone Number" name="contact2_phone" control={control} errors={errors} />
                </div>

                {/* Contact 3 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Contact 3</h4>
                  <FormField label="Label (English)" name="contact3_label_en" control={control} errors={errors} placeholder="Groom's Father" required={false} />
                  <FormField label="Label (Malay)" name="contact3_label_ms" control={control} errors={errors} placeholder="Bapa Pengantin Lelaki" required={false} />
                  <FormField label="Contact Name" name="contact3_name" control={control} errors={errors} required={false} />
                  <FormField label="Phone Number" name="contact3_phone" control={control} errors={errors} required={false} />
                </div>

                {/* Contact 4 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Contact 4</h4>
                  <FormField label="Label (English)" name="contact4_label_en" control={control} errors={errors} placeholder="Bride's Mother" required={false} />
                  <FormField label="Label (Malay)" name="contact4_label_ms" control={control} errors={errors} placeholder="Ibu Pengantin Perempuan" required={false} />
                  <FormField label="Contact Name" name="contact4_name" control={control} errors={errors} required={false} />
                  <FormField label="Phone Number" name="contact4_phone" control={control} errors={errors} required={false} />
                </div>
              </div>
            </div>

            {/* RSVP Deadline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">RSVP Deadline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Deadline (English)" name="rsvp_deadline" control={control} errors={errors} placeholder="December 20, 2025" />
                <FormField label="Deadline (Malay)" name="rsvp_deadline_ms" control={control} errors={errors} placeholder="20 Disember 2025" />
              </div>
            </div>

            {/* Event Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Event Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Event Type (English)" name="event_type_en" control={control} errors={errors} />
                <FormField label="Event Type (Malay)" name="event_type_ms" control={control} errors={errors} />
              </div>
            </div>

            {/* Important Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Important Notes</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Dress Code (English)" name="dress_code_en" control={control} errors={errors} />
                  <FormField label="Dress Code (Malay)" name="dress_code_ms" control={control} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Parking Info (English)" name="parking_info_en" control={control} errors={errors} />
                  <FormField label="Parking Info (Malay)" name="parking_info_ms" control={control} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Food Info (English)" name="food_info_en" control={control} errors={errors} />
                  <FormField label="Food Info (Malay)" name="food_info_ms" control={control} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Invitation Note (English)" name="invitation_note_en" control={control} errors={errors} />
                  <FormField label="Invitation Note (Malay)" name="invitation_note_ms" control={control} errors={errors} />
                </div>
              </div>
            </div>

            {/* Invitation Card Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Invitation Card Content</h3>
              
              {/* Bismillah Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Bismillah Text (English)" name="bismillah_text_en" control={control} errors={errors} isTextArea={true} rows={2} required={false} placeholder="In the name of Allah, the Most Gracious, the Most Merciful" />
                <FormField label="Bismillah Text (Malay)" name="bismillah_text_ms" control={control} errors={errors} isTextArea={true} rows={2} required={false} placeholder="Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang" />
              </div>

              {/* Opening Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="With Pleasure Text (English)" name="with_pleasure_text_en" control={control} errors={errors} required={false} placeholder="With great pleasure, we" />
                <FormField label="With Pleasure Text (Malay)" name="with_pleasure_text_ms" control={control} errors={errors} required={false} placeholder="Dengan penuh kesyukuran, kami" />
              </div>

              {/* Parent Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Groom's Parents */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Groom&apos;s Parents</h4>
                  <FormField label="Father&apos;s Name" name="groom_father_name" control={control} errors={errors} required={false} placeholder="MOHAMAD SAID BIN RASSAL" />
                  <FormField label="Mother&apos;s Name" name="groom_mother_name" control={control} errors={errors} required={false} placeholder="SAFURAH BINTI HJ KAMARUL" />
                  <FormField label="Title (English)" name="groom_title_en" control={control} errors={errors} required={false} placeholder="Ayah Pengantin Lelaki" />
                  <FormField label="Title (Malay)" name="groom_title_ms" control={control} errors={errors} required={false} placeholder="Ayah Pengantin Lelaki" />
                </div>

                {/* Bride's Parents */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Bride&apos;s Parents</h4>
                  <FormField label="Father&apos;s Name" name="bride_father_name" control={control} errors={errors} required={false} placeholder="KHARUL ANUAR BIN JAMALUDDIN" />
                  <FormField label="Mother&apos;s Name" name="bride_mother_name" control={control} errors={errors} required={false} placeholder="AISHAH AIRIS BINTI ZAKARIA" />
                  <FormField label="Title (English)" name="bride_title_en" control={control} errors={errors} required={false} placeholder="Ibu Pengantin Perempuan" />
                  <FormField label="Title (Malay)" name="bride_title_ms" control={control} errors={errors} required={false} placeholder="Ibu Pengantin Perempuan" />
                </div>
              </div>

              {/* Together With Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Together With Text (English)" name="together_with_text_en" control={control} errors={errors} required={false} placeholder="together with" />
                <FormField label="Together With Text (Malay)" name="together_with_text_ms" control={control} errors={errors} required={false} placeholder="bersama" />
              </div>

              {/* Invitation Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Invitation Message (English)" name="invitation_message_en" control={control} errors={errors} isTextArea={true} rows={3} required={false} placeholder="cordially invite you to join us at the Wedding Reception of our beloved children" />
                <FormField label="Invitation Message (Malay)" name="invitation_message_ms" control={control} errors={errors} isTextArea={true} rows={3} required={false} placeholder="menjemput Yang Berbahagia ke majlis perkahwinan anakanda kami" />
              </div>

              {/* Cordially Invite Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Cordially Invite Text (English)" name="cordially_invite_text_en" control={control} errors={errors} isTextArea={true} rows={2} required={false} placeholder="Cordially invite you to join us at the Wedding Reception of our beloved children" />
                <FormField label="Cordially Invite Text (Malay)" name="cordially_invite_text_ms" control={control} errors={errors} isTextArea={true} rows={2} required={false} placeholder="Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami" />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-green-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
              >
                Cancel
              </button>
              <SubmitButton isPending={isPending} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 