import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/connect';
import { adminUsers, weddingDetails as weddingDetailsTable, rsvpResponses as rsvpResponsesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { auditDatabaseOperation, monitorQuery, validateQueryParams } from '@/lib/db-security';

// Session configuration  
// Users MUST set SECRET_COOKIE_PASSWORD environment variable - no fallback provided for security
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: process.env.NODE_ENV === 'production' ? "__Host-wedding-admin-session" : "wedding-admin-session", // __Host- prefix only for production HTTPS
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Only require HTTPS in production
    httpOnly: true, // Prevent XSS attacks - cookie not accessible via JavaScript
    sameSite: "lax" as const, // Less strict than "strict" but still secure - allows normal navigation
    maxAge: 60 * 60 * 2, // 2 hours instead of 1 week
    path: "/", // Explicit path setting
  },
};

// Session data interface
export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  lastActivity?: number; // Timestamp for session timeout
}

// Wedding details interface for backward compatibility
export interface WeddingDetails {
  id: number;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_date_ms: string;
  ceremony_time_start: string;
  ceremony_time_end: string;
  reception_time_start: string;
  reception_time_end: string;
  venue_name: string;
  venue_address: string;
  venue_google_maps_url: string;
  contact1_name: string;
  contact1_phone: string;
  contact1_label_en: string;
  contact1_label_ms: string;
  contact2_name: string;
  contact2_phone: string;
  contact2_label_en: string;
  contact2_label_ms: string;
  contact3_name: string;
  contact3_phone: string;
  contact3_label_en: string;
  contact3_label_ms: string;
  contact4_name: string;
  contact4_phone: string;
  contact4_label_en: string;
  contact4_label_ms: string;
  rsvp_deadline: string;
  rsvp_deadline_ms: string;
  event_type_en: string;
  event_type_ms: string;
  dress_code_en: string;
  dress_code_ms: string;
  parking_info_en: string;
  parking_info_ms: string;
  food_info_en: string;
  food_info_ms: string;
  invitation_note_en: string;
  invitation_note_ms: string;
  // New fields for formal invitation card
  groom_title_en: string;
  groom_title_ms: string;
  bride_title_en: string;
  bride_title_ms: string;
  groom_father_name: string;
  groom_mother_name: string;
  bride_father_name: string;
  bride_mother_name: string;
  // New customizable inviter title fields
  groom_father_title_en: string;
  groom_father_title_ms: string;
  groom_mother_title_en: string;
  groom_mother_title_ms: string;
  bride_father_title_en: string;
  bride_father_title_ms: string;
  bride_mother_title_en: string;
  bride_mother_title_ms: string;
  bismillah_text_en: string;
  bismillah_text_ms: string;
  with_pleasure_text_en: string;
  with_pleasure_text_ms: string;
  together_with_text_en: string;
  together_with_text_ms: string;
  invitation_message_en: string;
  invitation_message_ms: string;
  cordially_invite_text_en: string;
  cordially_invite_text_ms: string;
  qr_code_url: string;
  qr_owner_name: string;
  qr_bank_name: string;
  updated_at: string;
}

// RSVP response interface for backward compatibility
export interface RSVPResponseLegacy {
  id: string;
  name: string;
  phone: string;
  pax: number;
  created_at: string;
}

// Initialize default wedding details if none exist
async function initializeDefaultWeddingDetails() {
  try {
    const existing = await db.select().from(weddingDetailsTable).limit(1);
    
    if (existing.length === 0) {
      await db.insert(weddingDetailsTable).values({
        groom_name: 'MUHAMMAD AZFAR BIN MOHAMAD SAID',
        bride_name: 'NURAFINI BINTI KHARUL ANUAR',
        wedding_date: 'December 20, 2025',
        wedding_date_ms: '20 Disember 2025',
        ceremony_time_start: '',
        ceremony_time_end: '',
        reception_time_start: '',
        reception_time_end: '',
        venue_name: 'Dewan Seri Budiman',
        venue_address: '123 Wedding Street, Kuala Lumpur',
        venue_google_maps_url: '',
        contact1_name: 'MOHAMAD SAID BIN RASSAL',
        contact1_phone: '012-3456789',
        contact1_label_en: 'Father of Groom',
        contact1_label_ms: 'Ayah Pengantin Lelaki',
        contact2_name: 'KHARUL ANUAR BIN JAMALUDDIN',
        contact2_phone: '012-9876543',
        contact2_label_en: 'Father of Bride',
        contact2_label_ms: 'Ayah Pengantin Perempuan',
        contact3_name: '',
        contact3_phone: '',
        contact3_label_en: '',
        contact3_label_ms: '',
        contact4_name: '',
        contact4_phone: '',
        contact4_label_en: '',
        contact4_label_ms: '',
        rsvp_deadline: 'December 15, 2025',
        rsvp_deadline_ms: '15 Disember 2025',
        event_type_en: 'WALIMATUL URUS',
        event_type_ms: 'WALIMATUL URUS',
        dress_code_en: 'Smart Casual',
        dress_code_ms: 'Smart Casual',
        parking_info_en: 'Parking available',
        parking_info_ms: 'Tempat letak kereta tersedia',
        food_info_en: 'Halal food provided',
        food_info_ms: 'Hidangan halal disediakan',
        invitation_note_en: 'Please bring this invitation',
        invitation_note_ms: 'Sila bawa jemputan ini',
        groom_title_en: '',
        groom_title_ms: '',
        bride_title_en: '',
        bride_title_ms: '',
        groom_father_name: 'MOHAMAD SAID BIN RASSAL',
        groom_mother_name: 'SAFURAH BINTI HJ KAMARUL',
        bride_father_name: 'KHARUL ANUAR BIN JAMALUDDIN',
        bride_mother_name: 'AISHAH AIRIS BINTI ZAKARIA',
        // Initialize with default title values
        groom_father_title_en: 'Father of the Groom',
        groom_father_title_ms: 'Ayah Pengantin Lelaki',
        groom_mother_title_en: 'Mother of the Groom',
        groom_mother_title_ms: 'Ibu Pengantin Lelaki',
        bride_father_title_en: 'Father of the Bride',
        bride_father_title_ms: 'Ayah Pengantin Perempuan',
        bride_mother_title_en: 'Mother of the Bride',
        bride_mother_title_ms: 'Ibu Pengantin Perempuan',
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
        qr_code_url: '',
        qr_owner_name: '',
        qr_bank_name: '',
      });
    }
  } catch (error) {
    console.error('Error initializing default wedding details:', error);
  }
}

// Initialize on module load
initializeDefaultWeddingDetails();

// Get session
export async function getSession() {
  const cookieStore = await cookies();
  // @ts-expect-error - Users MUST set SECRET_COOKIE_PASSWORD environment variable
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  
  return session;
}

// Admin user functions
export const adminAuth = {
  // Create admin user (use this once to create your admin account)
  async createAdmin(username: string, password: string) {
    // Validate inputs for security
    if (!validateQueryParams({ username, password }, 'createAdmin')) {
      return { success: false, error: 'Invalid input detected' };
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    try {
      monitorQuery('INSERT', 'admin_users', { username });
      
      const result = await db.insert(adminUsers).values({
        username,
        password: hashedPassword,
      }).returning({ id: adminUsers.id });
      
      auditDatabaseOperation('INSERT', 'admin_users', result[0].id.toString(), { username });
      
      return { success: true, id: result[0].id.toString() };
    } catch (error) {
      console.error('Error creating admin:', error);
      return { success: false, error: 'Username already exists' };
    }
  },

  // Login admin
  async login(username: string, password: string) {
    try {
      // Validate inputs for security
      if (!validateQueryParams({ username }, 'login')) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      monitorQuery('SELECT', 'admin_users', { username });
      
      const result = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, username))
        .limit(1);
      
      const user = result[0];
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Create session with regeneration for security
      const session = await getSession();
      
      // Clear any existing session data first
      session.userId = undefined;
      session.username = undefined;
      session.isLoggedIn = false;
      
      // Set new session data
      session.userId = user.id.toString();
      session.username = user.username;
      session.isLoggedIn = true;
      session.lastActivity = Date.now(); // Set initial activity timestamp
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Setting session data:', {
          userId: session.userId,
          username: session.username,
          isLoggedIn: session.isLoggedIn,
          lastActivity: session.lastActivity
        });
      }
      
      // Save the session
      await session.save();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Session saved successfully');
      }
      
      return { success: true, user: { id: user.id.toString(), username: user.username } };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  // Logout admin
  async logout() {
    const session = await getSession();
    // Clear all session data before destroying
    session.userId = undefined;
    session.username = undefined;
    session.isLoggedIn = false;
    session.lastActivity = undefined;
    // Destroy the session
    session.destroy();
  },

  // Check if user is authenticated (safe for page components - read-only)
  async isAuthenticatedReadOnly() {
    const session = await getSession();
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Session state:', {
        isLoggedIn: session.isLoggedIn,
        userId: session.userId,
        username: session.username,
        lastActivity: session.lastActivity,
        lastActivityDate: session.lastActivity ? new Date(session.lastActivity).toISOString() : null
      });
    }
    
    if (!session.isLoggedIn || !session.userId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Authentication failed: missing isLoggedIn or userId');
      }
      return false;
    }
    
    // Check session timeout (2 hours = 7200000 milliseconds)
    const now = Date.now();
    const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    if (session.lastActivity && (now - session.lastActivity > sessionTimeout)) {
      // Session expired - return false but don't modify session here
      if (process.env.NODE_ENV === 'development') {
        console.log('Session expired:', {
          lastActivity: session.lastActivity,
          now,
          timeDiff: now - session.lastActivity,
          timeout: sessionTimeout
        });
      }
      return false;
    }
    
    return true;
  },

  // Check if user is authenticated (for route handlers - can modify cookies)
  async isAuthenticated() {
    const isAuth = await this.isAuthenticatedReadOnly();
    if (!isAuth) {
      return false;
    }
    
    // Try to update session activity if possible (route handlers)
    await this.updateSessionActivity();
    return true;
  },

  // Update session activity (only call from route handlers/server actions)
  async updateSessionActivity() {
    try {
      const session = await getSession();
      
      if (!session.isLoggedIn || !session.userId) {
        return false;
      }
      
      // Check session timeout
      const now = Date.now();
      const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (session.lastActivity && (now - session.lastActivity > sessionTimeout)) {
        // Session expired, clear it
        session.userId = undefined;
        session.username = undefined;
        session.isLoggedIn = false;
        session.lastActivity = undefined;
        await session.save();
        return false;
      }
      
      // Update last activity
      session.lastActivity = now;
      await session.save();
      
      return true;
    } catch (error) {
      // If we can't update session (e.g., called from page component), just return true
      // The read-only check has already passed
      console.warn('Could not update session activity:', error);
      return true;
    }
  },

  // Get current admin user
  async getCurrentUser() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId || !session.username) {
      return null;
    }
    return { id: session.userId, username: session.username };
  }
};

// Middleware to protect admin routes (call from route handlers only)
export async function requireAdmin() {
  const isAuth = await adminAuth.isAuthenticated();
  if (!isAuth) {
    throw new Error('Unauthorized - Admin access required');
  }
  
  // Update session activity since this is called from route handlers
  await adminAuth.updateSessionActivity();
  
  return true;
}

// Wedding details functions
export const weddingDetails = {
  // Get wedding details
  async getDetails(): Promise<WeddingDetails | null> {
    try {
      const result = await db.select().from(weddingDetailsTable).limit(1);
      const details = result[0];
      
      if (!details) {
        return null;
      }
      
      // Convert Drizzle result to legacy interface format
      return {
        id: details.id,
        groom_name: details.groom_name,
        bride_name: details.bride_name,
        wedding_date: details.wedding_date,
        wedding_date_ms: details.wedding_date_ms,
        ceremony_time_start: details.ceremony_time_start || '',
        ceremony_time_end: details.ceremony_time_end || '',
        reception_time_start: details.reception_time_start || '',
        reception_time_end: details.reception_time_end || '',
        venue_name: details.venue_name,
        venue_address: details.venue_address,
        venue_google_maps_url: details.venue_google_maps_url || '',
        contact1_name: details.contact1_name,
        contact1_phone: details.contact1_phone,
        contact1_label_en: details.contact1_label_en,
        contact1_label_ms: details.contact1_label_ms,
        contact2_name: details.contact2_name,
        contact2_phone: details.contact2_phone,
        contact2_label_en: details.contact2_label_en,
        contact2_label_ms: details.contact2_label_ms,
        contact3_name: details.contact3_name || '',
        contact3_phone: details.contact3_phone || '',
        contact3_label_en: details.contact3_label_en || '',
        contact3_label_ms: details.contact3_label_ms || '',
        contact4_name: details.contact4_name || '',
        contact4_phone: details.contact4_phone || '',
        contact4_label_en: details.contact4_label_en || '',
        contact4_label_ms: details.contact4_label_ms || '',
        rsvp_deadline: details.rsvp_deadline,
        rsvp_deadline_ms: details.rsvp_deadline_ms,
        event_type_en: details.event_type_en,
        event_type_ms: details.event_type_ms,
        dress_code_en: details.dress_code_en,
        dress_code_ms: details.dress_code_ms,
        parking_info_en: details.parking_info_en,
        parking_info_ms: details.parking_info_ms,
        food_info_en: details.food_info_en,
        food_info_ms: details.food_info_ms,
        invitation_note_en: details.invitation_note_en,
        invitation_note_ms: details.invitation_note_ms,
        groom_title_en: details.groom_title_en || '',
        groom_title_ms: details.groom_title_ms || '',
        bride_title_en: details.bride_title_en || '',
        bride_title_ms: details.bride_title_ms || '',
        groom_father_name: details.groom_father_name || '',
        groom_mother_name: details.groom_mother_name || '',
        bride_father_name: details.bride_father_name || '',
        bride_mother_name: details.bride_mother_name || '',
        // New customizable inviter title fields
        groom_father_title_en: details.groom_father_title_en || 'Father of the Groom',
        groom_father_title_ms: details.groom_father_title_ms || 'Ayah Pengantin Lelaki',
        groom_mother_title_en: details.groom_mother_title_en || 'Mother of the Groom',
        groom_mother_title_ms: details.groom_mother_title_ms || 'Ibu Pengantin Lelaki',
        bride_father_title_en: details.bride_father_title_en || 'Father of the Bride',
        bride_father_title_ms: details.bride_father_title_ms || 'Ayah Pengantin Perempuan',
        bride_mother_title_en: details.bride_mother_title_en || 'Mother of the Bride',
        bride_mother_title_ms: details.bride_mother_title_ms || 'Ibu Pengantin Perempuan',
        bismillah_text_en: details.bismillah_text_en || 'In the name of Allah, the Most Gracious, the Most Merciful',
        bismillah_text_ms: details.bismillah_text_ms || 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang',
        with_pleasure_text_en: details.with_pleasure_text_en || 'With great pleasure, we',
        with_pleasure_text_ms: details.with_pleasure_text_ms || 'Dengan penuh kesyukuran, kami',
        together_with_text_en: details.together_with_text_en || 'together with',
        together_with_text_ms: details.together_with_text_ms || 'bersama',
        invitation_message_en: details.invitation_message_en || 'cordially invite you to join us at the Wedding Reception of our beloved children',
        invitation_message_ms: details.invitation_message_ms || 'menjemput Yang Berbahagia ke majlis perkahwinan anakanda kami',
        cordially_invite_text_en: details.cordially_invite_text_en || 'Cordially invite you to join us at the Wedding Reception of our beloved children',
        cordially_invite_text_ms: details.cordially_invite_text_ms || 'Dengan hormatnya menjemput anda ke majlis perkahwinan anak kami',
        qr_code_url: details.qr_code_url || '',
        qr_owner_name: details.qr_owner_name || '',
        qr_bank_name: details.qr_bank_name || '',
        updated_at: details.updated_at.toISOString(),
      };
    } catch (error) {
      console.error('Error getting wedding details:', error);
      return null;
    }
  },

  // Update wedding details
  async updateDetails(details: Partial<WeddingDetails>): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove id and updated_at from the update object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, updated_at, ...updateData } = details;
      
      if (Object.keys(updateData).length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      await db
        .update(weddingDetailsTable)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(weddingDetailsTable.id, 1));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating wedding details:', error);
      return { success: false, error: 'Failed to update wedding details' };
    }
  }
};

// RSVP functions
export const rsvpResponses = {
  // Create RSVP response
  async createResponse(name: string, phone: string, pax: number): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      // Validate inputs for security
      if (!validateQueryParams({ name, phone, pax: pax.toString() }, 'createRSVP')) {
        return { success: false, error: 'Invalid input detected' };
      }
      
      monitorQuery('SELECT', 'rsvp_responses', { phone });
      
      // Check for duplicate phone number
      const existing = await db
        .select()
        .from(rsvpResponsesTable)
        .where(eq(rsvpResponsesTable.phone, phone))
        .limit(1);
      
      if (existing.length > 0) {
        return { success: false, error: 'This phone number has already been used to RSVP' };
      }

      monitorQuery('INSERT', 'rsvp_responses', { name, phone, pax });
      
      const result = await db
        .insert(rsvpResponsesTable)
        .values({
          name,
          phone,
          pax,
        })
        .returning({ id: rsvpResponsesTable.id });
      
      auditDatabaseOperation('INSERT', 'rsvp_responses', result[0].id.toString(), { name, phone, pax });
      
      return { success: true, id: result[0].id.toString() };
    } catch (error) {
      console.error('Error creating RSVP response:', error);
      return { success: false, error: 'Failed to submit RSVP' };
    }
  },

  // Get all RSVP responses
  async getAllResponses(): Promise<RSVPResponseLegacy[]> {
    try {
      const responses = await db
        .select()
        .from(rsvpResponsesTable)
        .orderBy(sql`${rsvpResponsesTable.submitted_at} DESC`);
      
      return responses.map(response => ({
        id: response.id.toString(),
        name: response.name,
        phone: response.phone,
        pax: response.pax,
        created_at: response.submitted_at.toISOString(),
      }));
    } catch (error) {
      console.error('Error getting RSVP responses:', error);
      return [];
    }
  },

  // Get total RSVP count and pax
  async getStats(): Promise<{ totalResponses: number; totalPax: number }> {
    try {
      const result = await db
        .select({
          totalResponses: sql<number>`count(*)::int`,
          totalPax: sql<number>`coalesce(sum(${rsvpResponsesTable.pax}), 0)::int`,
        })
        .from(rsvpResponsesTable);
      
      return {
        totalResponses: result[0]?.totalResponses || 0,
        totalPax: result[0]?.totalPax || 0,
      };
    } catch (error) {
      console.error('Error getting RSVP stats:', error);
      return { totalResponses: 0, totalPax: 0 };
    }
  }
}; 