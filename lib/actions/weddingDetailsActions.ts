'use server';

import { weddingDetails } from '@/lib/auth'; // Assuming weddingDetails object in auth.ts handles DB interaction
import { WeddingDetailsSchema, WeddingDetailsFormState } from '@/lib/schemas/weddingDetailsSchema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getWeddingDetails() {
  try {
    const details = await weddingDetails.getDetails();
    if (!details) {
      // Return a default structure or throw an error if preferred
      // For a form, it's often better to return the expected shape, even if empty
      const defaultDetails: z.infer<typeof WeddingDetailsSchema> = {
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
      };
      return defaultDetails;
    }
    // Ensure the returned object matches the schema (omitting id, updated_at for the form)
    const { id, updated_at, ...formData } = details;
    return formData as z.infer<typeof WeddingDetailsSchema>; // Cast to the schema type
  } catch (error) {
    console.error('Error fetching wedding details for form:', error);
    // Consider how to handle this error in the page component
    throw new Error('Failed to fetch wedding details.'); 
  }
}

export async function updateWeddingDetails(
  prevState: WeddingDetailsFormState,
  formData: FormData
): Promise<WeddingDetailsFormState> {
  try {
    const formValues: Record<string, any> = {};
    WeddingDetailsSchema.keyof().options.forEach(key => {
      formValues[key] = formData.get(key);
    });
    
    const validatedFields = WeddingDetailsSchema.safeParse(formValues);

    if (!validatedFields.success) {
      return {
        message: 'Validation failed. Please check the fields.',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    // The weddingDetails.updateDetails expects Partial<WeddingDetails>, 
    // so validatedFields.data which matches WeddingDetailsSchema is compatible.
    const result = await weddingDetails.updateDetails(validatedFields.data);

    if (!result.success) {
      return {
        message: result.error || 'Failed to update wedding details.',
        errors: { general: [result.error || 'Update failed. Please try again.'] },
        success: false,
      };
    }
    
    // Revalidate public page if details change successfully
    revalidatePath('/'); 
    // Optionally revalidate other paths like the admin dashboard if it shows these details
    // revalidatePath('/admin');

    return {
      message: 'Wedding details updated successfully!',
      success: true,
    };

  } catch (error) {
    console.error('Update wedding details action error:', error);
    return {
      message: 'An unexpected error occurred while updating details.',
      errors: { general: ['An server error occurred. Please try again.'] },
      success: false,
    };
  }
} 