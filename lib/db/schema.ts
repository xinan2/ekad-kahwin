import { z } from 'zod';
import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

// =============================================================================
// ADMIN SCHEMAS
// =============================================================================

// Admin Login Schema
export const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormState = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string[]; // For errors not specific to a field
  };
  success: boolean;
};

// Admin Setup Schema
export const SetupSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SetupFormState = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[]; // For errors not specific to a field
  };
  success: boolean;
};

// =============================================================================
// WEDDING DETAILS SCHEMA
// =============================================================================

export const WeddingDetailsSchema = z.object({
  groom_name: z.string().min(1, { message: 'Groom name is required' }),
  bride_name: z.string().min(1, { message: 'Bride name is required' }),
  wedding_date: z.string().min(1, { message: 'Wedding date (EN) is required' }),
  wedding_date_ms: z.string().min(1, { message: 'Wedding date (MS) is required' }),
  ceremony_time_start: z.string().default(''),
  ceremony_time_end: z.string().default(''),
  reception_time_start: z.string().default(''),
  reception_time_end: z.string().default(''),
  venue_name: z.string().min(1, { message: 'Venue name is required' }),
  venue_address: z.string().min(1, { message: 'Venue address is required' }),
  venue_google_maps_url: z.string().default(''),
  contact1_name: z.string().min(1, { message: 'Contact 1 name is required' }),
  contact1_phone: z.string().min(1, { message: 'Contact 1 phone is required' }),
  contact1_label_en: z.string().min(1, { message: 'Contact 1 label (EN) is required' }),
  contact1_label_ms: z.string().min(1, { message: 'Contact 1 label (MS) is required' }),
  contact2_name: z.string().min(1, { message: 'Contact 2 name is required' }),
  contact2_phone: z.string().min(1, { message: 'Contact 2 phone is required' }),
  contact2_label_en: z.string().min(1, { message: 'Contact 2 label (EN) is required' }),
  contact2_label_ms: z.string().min(1, { message: 'Contact 2 label (MS) is required' }),
  contact3_name: z.string().default(''),
  contact3_phone: z.string().default(''),
  contact3_label_en: z.string().default(''),
  contact3_label_ms: z.string().default(''),
  contact4_name: z.string().default(''),
  contact4_phone: z.string().default(''),
  contact4_label_en: z.string().default(''),
  contact4_label_ms: z.string().default(''),
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
  
  // New fields for formal invitation card
  groom_title_en: z.string().default(''),
  groom_title_ms: z.string().default(''),
  bride_title_en: z.string().default(''),
  bride_title_ms: z.string().default(''),
  groom_father_name: z.string().default(''),
  groom_mother_name: z.string().default(''),
  bride_father_name: z.string().default(''),
  bride_mother_name: z.string().default(''),
  
  // New customizable inviter title fields
  groom_father_title_en: z.string().default('Father of the Groom'),
  groom_father_title_ms: z.string().default('Ayah Pengantin Lelaki'),
  groom_mother_title_en: z.string().default('Mother of the Groom'),
  groom_mother_title_ms: z.string().default('Ibu Pengantin Lelaki'),
  bride_father_title_en: z.string().default('Father of the Bride'),
  bride_father_title_ms: z.string().default('Ayah Pengantin Perempuan'),
  bride_mother_title_en: z.string().default('Mother of the Bride'),
  bride_mother_title_ms: z.string().default('Ibu Pengantin Perempuan'),
  
  bismillah_text_en: z.string().default('In the name of Allah, the Most Gracious, the Most Merciful'),
  bismillah_text_ms: z.string().default('Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang'),
  with_pleasure_text_en: z.string().default('With great pleasure, we'),
  with_pleasure_text_ms: z.string().default('Dengan penuh kesyukuran, kami'),
  together_with_text_en: z.string().default('together with'),
  together_with_text_ms: z.string().default('bersama'),
  invitation_message_en: z.string().default('cordially invite you to join us at the Wedding Reception of our beloved children'),
  invitation_message_ms: z.string().default('menjemput Yang Berbahagia ke majlis perkahwinan anakanda kami'),
  cordially_invite_text_en: z.string().default('Cordially invite you to join us at the Wedding Reception of our beloved children'),
  cordially_invite_text_ms: z.string().default('Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami'),
  
  // Gift/QR Code fields
  qr_code_url: z.string().default(''),
  qr_owner_name: z.string().default(''),
  qr_bank_name: z.string().default(''),
});

export type WeddingDetailsFormState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof WeddingDetailsSchema>, string[]>> & { general?: string[] };
  success: boolean;
};

// =============================================================================
// RSVP SCHEMA
// =============================================================================

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

// =============================================================================
// DRIZZLE DATABASE TABLES
// =============================================================================

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Wedding Details Table
export const weddingDetails = pgTable('wedding_details', {
  id: serial('id').primaryKey(),
  groom_name: varchar('groom_name', { length: 255 }).notNull(),
  bride_name: varchar('bride_name', { length: 255 }).notNull(),
  wedding_date: varchar('wedding_date', { length: 255 }).notNull(),
  wedding_date_ms: varchar('wedding_date_ms', { length: 255 }).notNull(),
  ceremony_time_start: varchar('ceremony_time_start', { length: 100 }).default(''),
  ceremony_time_end: varchar('ceremony_time_end', { length: 100 }).default(''),
  reception_time_start: varchar('reception_time_start', { length: 100 }).default(''),
  reception_time_end: varchar('reception_time_end', { length: 100 }).default(''),
  venue_name: varchar('venue_name', { length: 255 }).notNull(),
  venue_address: text('venue_address').notNull(),
  venue_google_maps_url: text('venue_google_maps_url').default(''),
  contact1_name: varchar('contact1_name', { length: 255 }).notNull(),
  contact1_phone: varchar('contact1_phone', { length: 50 }).notNull(),
  contact1_label_en: varchar('contact1_label_en', { length: 255 }).notNull(),
  contact1_label_ms: varchar('contact1_label_ms', { length: 255 }).notNull(),
  contact2_name: varchar('contact2_name', { length: 255 }).notNull(),
  contact2_phone: varchar('contact2_phone', { length: 50 }).notNull(),
  contact2_label_en: varchar('contact2_label_en', { length: 255 }).notNull(),
  contact2_label_ms: varchar('contact2_label_ms', { length: 255 }).notNull(),
  contact3_name: varchar('contact3_name', { length: 255 }).default(''),
  contact3_phone: varchar('contact3_phone', { length: 50 }).default(''),
  contact3_label_en: varchar('contact3_label_en', { length: 255 }).default(''),
  contact3_label_ms: varchar('contact3_label_ms', { length: 255 }).default(''),
  contact4_name: varchar('contact4_name', { length: 255 }).default(''),
  contact4_phone: varchar('contact4_phone', { length: 50 }).default(''),
  contact4_label_en: varchar('contact4_label_en', { length: 255 }).default(''),
  contact4_label_ms: varchar('contact4_label_ms', { length: 255 }).default(''),
  rsvp_deadline: varchar('rsvp_deadline', { length: 255 }).notNull(),
  rsvp_deadline_ms: varchar('rsvp_deadline_ms', { length: 255 }).notNull(),
  event_type_en: varchar('event_type_en', { length: 255 }).notNull(),
  event_type_ms: varchar('event_type_ms', { length: 255 }).notNull(),
  dress_code_en: varchar('dress_code_en', { length: 255 }).notNull(),
  dress_code_ms: varchar('dress_code_ms', { length: 255 }).notNull(),
  parking_info_en: text('parking_info_en').notNull(),
  parking_info_ms: text('parking_info_ms').notNull(),
  food_info_en: text('food_info_en').notNull(),
  food_info_ms: text('food_info_ms').notNull(),
  invitation_note_en: text('invitation_note_en').notNull(),
  invitation_note_ms: text('invitation_note_ms').notNull(),
  groom_title_en: varchar('groom_title_en', { length: 255 }).default(''),
  groom_title_ms: varchar('groom_title_ms', { length: 255 }).default(''),
  bride_title_en: varchar('bride_title_en', { length: 255 }).default(''),
  bride_title_ms: varchar('bride_title_ms', { length: 255 }).default(''),
  groom_father_name: varchar('groom_father_name', { length: 255 }).default(''),
  groom_mother_name: varchar('groom_mother_name', { length: 255 }).default(''),
  bride_father_name: varchar('bride_father_name', { length: 255 }).default(''),
  bride_mother_name: varchar('bride_mother_name', { length: 255 }).default(''),
  groom_father_title_en: varchar('groom_father_title_en', { length: 255 }).default('Father of the Groom'),
  groom_father_title_ms: varchar('groom_father_title_ms', { length: 255 }).default('Ayah Pengantin Lelaki'),
  groom_mother_title_en: varchar('groom_mother_title_en', { length: 255 }).default('Mother of the Groom'),
  groom_mother_title_ms: varchar('groom_mother_title_ms', { length: 255 }).default('Ibu Pengantin Lelaki'),
  bride_father_title_en: varchar('bride_father_title_en', { length: 255 }).default('Father of the Bride'),
  bride_father_title_ms: varchar('bride_father_title_ms', { length: 255 }).default('Ayah Pengantin Perempuan'),
  bride_mother_title_en: varchar('bride_mother_title_en', { length: 255 }).default('Mother of the Bride'),
  bride_mother_title_ms: varchar('bride_mother_title_ms', { length: 255 }).default('Ibu Pengantin Perempuan'),
  bismillah_text_en: text('bismillah_text_en').default('In the name of Allah, the Most Gracious, the Most Merciful'),
  bismillah_text_ms: text('bismillah_text_ms').default('Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang'),
  with_pleasure_text_en: text('with_pleasure_text_en').default('With great pleasure, we'),
  with_pleasure_text_ms: text('with_pleasure_text_ms').default('Dengan penuh kesyukuran, kami'),
  together_with_text_en: text('together_with_text_en').default('together with'),
  together_with_text_ms: text('together_with_text_ms').default('bersama'),
  invitation_message_en: text('invitation_message_en').default('cordially invite you to join us at the Wedding Reception of our beloved children'),
  invitation_message_ms: text('invitation_message_ms').default('menjemput Yang Berbahagia ke majlis perkahwinan anakanda kami'),
  cordially_invite_text_en: text('cordially_invite_text_en').default('Cordially invite you to join us at the Wedding Reception of our beloved children'),
  cordially_invite_text_ms: text('cordially_invite_text_ms').default('Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami'),
  qr_code_url: text('qr_code_url').default(''),
  qr_owner_name: varchar('qr_owner_name', { length: 255 }).default(''),
  qr_bank_name: varchar('qr_bank_name', { length: 255 }).default(''),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// RSVP Responses Table
export const rsvpResponses = pgTable('rsvp_responses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  pax: integer('pax').notNull(),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
});

// Table type exports for TypeScript
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type WeddingDetail = typeof weddingDetails.$inferSelect;
export type NewWeddingDetail = typeof weddingDetails.$inferInsert;

export type RSVPResponse = typeof rsvpResponses.$inferSelect;
export type NewRSVPResponse = typeof rsvpResponses.$inferInsert;
