import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

// Session configuration
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long_for_security_fallback_with_extra_length",
  cookieName: "admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Session data interface
export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
}

// Database user interface
interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

// Wedding details interface
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
  venue_google_maps_url?: string;
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
  updated_at: string;
}

// Initialize SQLite database for admin users
const db = new Database("admin.db");

// Create admin users table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create wedding details table
db.exec(`
  CREATE TABLE IF NOT EXISTS wedding_details (
    id INTEGER PRIMARY KEY,
    groom_name TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    wedding_date TEXT NOT NULL,
    wedding_date_ms TEXT NOT NULL,
    ceremony_time_start TEXT NOT NULL,
    ceremony_time_end TEXT NOT NULL,
    reception_time_start TEXT NOT NULL,
    reception_time_end TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    venue_google_maps_url TEXT,
    contact1_name TEXT NOT NULL,
    contact1_phone TEXT NOT NULL,
    contact1_label_en TEXT NOT NULL,
    contact1_label_ms TEXT NOT NULL,
    contact2_name TEXT NOT NULL,
    contact2_phone TEXT NOT NULL,
    contact2_label_en TEXT NOT NULL,
    contact2_label_ms TEXT NOT NULL,
    contact3_name TEXT NOT NULL,
    contact3_phone TEXT NOT NULL,
    contact3_label_en TEXT NOT NULL,
    contact3_label_ms TEXT NOT NULL,
    contact4_name TEXT NOT NULL,
    contact4_phone TEXT NOT NULL,
    contact4_label_en TEXT NOT NULL,
    contact4_label_ms TEXT NOT NULL,
    rsvp_deadline TEXT NOT NULL,
    rsvp_deadline_ms TEXT NOT NULL,
    event_type_en TEXT NOT NULL,
    event_type_ms TEXT NOT NULL,
    dress_code_en TEXT NOT NULL,
    dress_code_ms TEXT NOT NULL,
    parking_info_en TEXT NOT NULL,
    parking_info_ms TEXT NOT NULL,
    food_info_en TEXT NOT NULL,
    food_info_ms TEXT NOT NULL,
    invitation_note_en TEXT NOT NULL,
    invitation_note_ms TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Check if we need to migrate from old schema to new schema
const tableInfo = db.prepare("PRAGMA table_info(wedding_details)").all() as Array<{name: string}>;
const hasOldSchema = tableInfo.some(col => col.name === 'groom_contact_name' || col.name === 'bride_contact_name');

if (hasOldSchema) {
  console.log('Migrating wedding_details table to new schema...');
  
  // Get existing data
  const existingData = db.prepare('SELECT * FROM wedding_details LIMIT 1').get() as Record<string, unknown> | undefined;
  
  // Drop and recreate table
  db.exec('DROP TABLE wedding_details');
  db.exec(`
    CREATE TABLE wedding_details (
      id INTEGER PRIMARY KEY,
      groom_name TEXT NOT NULL,
      bride_name TEXT NOT NULL,
      wedding_date TEXT NOT NULL,
      wedding_date_ms TEXT NOT NULL,
      ceremony_time_start TEXT NOT NULL,
      ceremony_time_end TEXT NOT NULL,
      reception_time_start TEXT NOT NULL,
      reception_time_end TEXT NOT NULL,
      venue_name TEXT NOT NULL,
      venue_address TEXT NOT NULL,
      venue_google_maps_url TEXT,
      contact1_name TEXT NOT NULL,
      contact1_phone TEXT NOT NULL,
      contact1_label_en TEXT NOT NULL,
      contact1_label_ms TEXT NOT NULL,
      contact2_name TEXT NOT NULL,
      contact2_phone TEXT NOT NULL,
      contact2_label_en TEXT NOT NULL,
      contact2_label_ms TEXT NOT NULL,
      contact3_name TEXT NOT NULL,
      contact3_phone TEXT NOT NULL,
      contact3_label_en TEXT NOT NULL,
      contact3_label_ms TEXT NOT NULL,
      contact4_name TEXT NOT NULL,
      contact4_phone TEXT NOT NULL,
      contact4_label_en TEXT NOT NULL,
      contact4_label_ms TEXT NOT NULL,
      rsvp_deadline TEXT NOT NULL,
      rsvp_deadline_ms TEXT NOT NULL,
      event_type_en TEXT NOT NULL,
      event_type_ms TEXT NOT NULL,
      dress_code_en TEXT NOT NULL,
      dress_code_ms TEXT NOT NULL,
      parking_info_en TEXT NOT NULL,
      parking_info_ms TEXT NOT NULL,
      food_info_en TEXT NOT NULL,
      food_info_ms TEXT NOT NULL,
      invitation_note_en TEXT NOT NULL,
      invitation_note_ms TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Restore data with new schema if there was existing data
  if (existingData) {
    db.prepare(`
      INSERT INTO wedding_details (
        groom_name, bride_name, wedding_date, wedding_date_ms,
        ceremony_time_start, ceremony_time_end, reception_time_start, reception_time_end,
        venue_name, venue_address, venue_google_maps_url,
        contact1_name, contact1_phone, contact1_label_en, contact1_label_ms,
        contact2_name, contact2_phone, contact2_label_en, contact2_label_ms,
        contact3_name, contact3_phone, contact3_label_en, contact3_label_ms,
        contact4_name, contact4_phone, contact4_label_en, contact4_label_ms,
        rsvp_deadline, rsvp_deadline_ms,
        event_type_en, event_type_ms,
        dress_code_en, dress_code_ms,
        parking_info_en, parking_info_ms,
        food_info_en, food_info_ms,
        invitation_note_en, invitation_note_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      existingData.groom_name || 'Hafiz',
      existingData.bride_name || 'Afini',
      existingData.wedding_date || 'Saturday, Dec 27th 2025',
      existingData.wedding_date_ms || 'Sabtu, 27 Dis 2025',
      existingData.ceremony_time_start || '10:00 AM',
      existingData.ceremony_time_end || '12:00 PM',
      existingData.reception_time_start || '1:00 PM',
      existingData.reception_time_end || '4:00 PM',
      existingData.venue_name || 'Dewan Banquet Hall',
      existingData.venue_address || 'Jalan Mawar 1/2, Taman Mawar, 43000 Kajang, Selangor',
      existingData.venue_google_maps_url || 'https://maps.google.com/?q=Dewan+Banquet+Hall+Kajang',
      existingData.groom_contact_name || 'Hafiz', existingData.groom_contact_phone || '+60 12-345 6789', 
      "Groom's Family", 'Keluarga Pengantin Lelaki',
      existingData.bride_contact_name || 'Afini', existingData.bride_contact_phone || '+60 12-987 6543', 
      "Bride's Family", 'Keluarga Pengantin Perempuan',
      'Ahmad (Father)', '+60 13-111 2222', "Groom's Father", 'Bapa Pengantin Lelaki',
      'Siti (Mother)', '+60 14-333 4444', "Bride's Mother", 'Ibu Pengantin Perempuan',
      existingData.rsvp_deadline || 'December 20, 2025',
      existingData.rsvp_deadline_ms || '20 Disember 2025',
      existingData.event_type_en || 'WALIMATUL URUS',
      existingData.event_type_ms || 'WALIMATUL URUS',
      existingData.dress_code_en || 'Smart Casual',
      existingData.dress_code_ms || 'Smart Casual',
      existingData.parking_info_en || 'Parking available',
      existingData.parking_info_ms || 'Tempat letak kereta tersedia',
      existingData.food_info_en || 'Halal food provided',
      existingData.food_info_ms || 'Hidangan halal disediakan',
      existingData.invitation_note_en || 'Please bring this invitation',
      existingData.invitation_note_ms || 'Sila bawa jemputan ini'
    );
  }
  
  console.log('Migration completed!');
}

// Insert default wedding details if none exist
const existingDetails = db.prepare('SELECT COUNT(*) as count FROM wedding_details').get() as { count: number };
if (existingDetails.count === 0) {
  db.prepare(`
    INSERT INTO wedding_details (
      groom_name, bride_name, wedding_date, wedding_date_ms,
      ceremony_time_start, ceremony_time_end, reception_time_start, reception_time_end,
      venue_name, venue_address, venue_google_maps_url,
      contact1_name, contact1_phone, contact1_label_en, contact1_label_ms,
      contact2_name, contact2_phone, contact2_label_en, contact2_label_ms,
      contact3_name, contact3_phone, contact3_label_en, contact3_label_ms,
      contact4_name, contact4_phone, contact4_label_en, contact4_label_ms,
      rsvp_deadline, rsvp_deadline_ms,
      event_type_en, event_type_ms,
      dress_code_en, dress_code_ms,
      parking_info_en, parking_info_ms,
      food_info_en, food_info_ms,
      invitation_note_en, invitation_note_ms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Hafiz', 'Afini', 'Saturday, Dec 27th 2025', 'Sabtu, 27 Dis 2025',
    '10:00 AM', '12:00 PM', '1:00 PM', '4:00 PM',
    'Dewan Banquet Hall', 'Jalan Mawar 1/2, Taman Mawar, 43000 Kajang, Selangor',
    'https://maps.google.com/?q=Dewan+Banquet+Hall+Kajang',
    'Hafiz', '+60 12-345 6789', "Groom's Family", 'Keluarga Pengantin Lelaki',
    'Afini', '+60 12-987 6543', "Bride's Family", 'Keluarga Pengantin Perempuan',
    'Ahmad (Father)', '+60 13-111 2222', "Groom's Father", 'Bapa Pengantin Lelaki',
    'Siti (Mother)', '+60 14-333 4444', "Bride's Mother", 'Ibu Pengantin Perempuan',
    'December 20, 2025', '20 Disember 2025',
    'WALIMATUL URUS', 'WALIMATUL URUS',
    'Smart Casual', 'Smart Casual',
    'Parking available', 'Tempat letak kereta tersedia',
    'Halal food provided', 'Hidangan halal disediakan',
    'Please bring this invitation', 'Sila bawa jemputan ini'
  );
}

// Get session
export async function getSession() {
  const cookieStore = await cookies();
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
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO admin_users (id, username, password_hash) 
        VALUES (?, ?, ?)
      `);
      stmt.run(id, username, hashedPassword);
      return { success: true, id };
    } catch {
      return { success: false, error: 'Username already exists' };
    }
  },

  // Login admin
  async login(username: string, password: string) {
    const stmt = db.prepare(`
      SELECT id, username, password_hash 
      FROM admin_users 
      WHERE username = ?
    `);
    const user = stmt.get(username) as AdminUser | undefined;
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();
    
    return { success: true, user: { id: user.id, username: user.username } };
  },

  // Logout admin
  async logout() {
    const session = await getSession();
    session.destroy();
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const session = await getSession();
    return session.isLoggedIn && session.userId;
  },

  // Get current admin user
  async getCurrentUser() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return null;
    }
    return { id: session.userId, username: session.username };
  }
};

// Middleware to protect admin routes
export async function requireAdmin() {
  const isAuth = await adminAuth.isAuthenticated();
  if (!isAuth) {
    throw new Error('Unauthorized - Admin access required');
  }
  return true;
}

// Wedding details functions
export const weddingDetails = {
  // Get wedding details
  async getDetails(): Promise<WeddingDetails | null> {
    try {
      const stmt = db.prepare('SELECT * FROM wedding_details LIMIT 1');
      const details = stmt.get() as WeddingDetails | undefined;
      return details || null;
    } catch (error) {
      console.error('Error getting wedding details:', error);
      return null;
    }
  },

  // Update wedding details
  async updateDetails(details: Partial<WeddingDetails>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateFields = Object.keys(details).filter(key => key !== 'id').map(key => `${key} = ?`).join(', ');
      const updateValues = Object.keys(details).filter(key => key !== 'id').map(key => details[key as keyof WeddingDetails]);
      
      if (updateFields.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      const stmt = db.prepare(`
        UPDATE wedding_details 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1
      `);
      
      stmt.run(...updateValues);
      return { success: true };
    } catch (error) {
      console.error('Error updating wedding details:', error);
      return { success: false, error: 'Failed to update wedding details' };
    }
  }
}; 