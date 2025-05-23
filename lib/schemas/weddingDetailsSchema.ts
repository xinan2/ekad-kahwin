import { z } from 'zod';

export const WeddingDetailsSchema = z.object({
  groom_name: z.string().min(1, { message: 'Groom name is required' }),
  bride_name: z.string().min(1, { message: 'Bride name is required' }),
  wedding_date: z.string().min(1, { message: 'Wedding date (EN) is required' }),
  wedding_date_ms: z.string().min(1, { message: 'Wedding date (MS) is required' }),
  ceremony_time_start: z.string().min(1, { message: 'Ceremony start time is required' }),
  ceremony_time_end: z.string().min(1, { message: 'Ceremony end time is required' }),
  reception_time_start: z.string().min(1, { message: 'Reception start time is required' }),
  reception_time_end: z.string().min(1, { message: 'Reception end time is required' }),
  venue_name: z.string().min(1, { message: 'Venue name is required' }),
  venue_address: z.string().min(1, { message: 'Venue address is required' }),
  venue_google_maps_url: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  contact1_name: z.string().min(1, { message: 'Contact 1 name is required' }),
  contact1_phone: z.string().min(1, { message: 'Contact 1 phone is required' }),
  contact1_label_en: z.string().min(1, { message: 'Contact 1 label (EN) is required' }),
  contact1_label_ms: z.string().min(1, { message: 'Contact 1 label (MS) is required' }),
  contact2_name: z.string().min(1, { message: 'Contact 2 name is required' }),
  contact2_phone: z.string().min(1, { message: 'Contact 2 phone is required' }),
  contact2_label_en: z.string().min(1, { message: 'Contact 2 label (EN) is required' }),
  contact2_label_ms: z.string().min(1, { message: 'Contact 2 label (MS) is required' }),
  contact3_name: z.string().optional().default(''),
  contact3_phone: z.string().optional().default(''),
  contact3_label_en: z.string().optional().default(''),
  contact3_label_ms: z.string().optional().default(''),
  contact4_name: z.string().optional().default(''),
  contact4_phone: z.string().optional().default(''),
  contact4_label_en: z.string().optional().default(''),
  contact4_label_ms: z.string().optional().default(''),
  rsvp_deadline: z.string().min(1, { message: 'RSVP deadline (EN) is required' }),
  rsvp_deadline_ms: z.string().min(1, { message: 'RSVP deadline (MS) is required' }),
  event_type_en: z.string().min(1, { message: 'Event type (EN) is required' }),
  event_type_ms: z.string().min(1, { message: 'Event type (MS) is required' }),
  dress_code_en: z.string().min(1, { message: 'Dress code (EN) is required' }),
  dress_code_ms: z.string().min(1, { message: 'Dress code (MS) is required' }),
  parking_info_en: z.string().min(1, { message: 'Parking info (EN) is required' }),
  parking_info_ms: z.string().min(1, { message: 'Parking info (MS) is required' }),
  food_info_en: z.string().min(1, { message: 'Food info (EN) is required' }),
  food_info_ms: z.string().min(1, { message: 'Food info (MS) is required' }),
  invitation_note_en: z.string().min(1, { message: 'Invitation note (EN) is required' }),
  invitation_note_ms: z.string().min(1, { message: 'Invitation note (MS) is required' }),
});

// This type will be inferred in the component, but shown here for clarity
// export type WeddingDetailsFormValues = z.infer<typeof WeddingDetailsSchema>;

export type WeddingDetailsFormState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof WeddingDetailsSchema>, string[]>> & { general?: string[] };
  success: boolean;
}; 