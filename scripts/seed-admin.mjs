import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function seedAdmin() {
  console.log('🌱 Starting admin user seeding...');
  
  try {
    // Initialize SQLite database
    const db = new Database('admin.db');
    console.log('✅ Database connection established');

    // Create admin users table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT NOT NULL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin users table created/verified');

    // Check if admin user already exists
    const existingAdmin = db.prepare('SELECT * FROM admin_users LIMIT 1').get();
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Created: ${existingAdmin.created_at}`);
      console.log('');
      console.log('💡 To reset admin, delete admin.db file and run this script again');
      return;
    }

    // Default admin credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'wedding2025';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    const id = crypto.randomUUID();
    
    // Insert admin user
    const stmt = db.prepare(`
      INSERT INTO admin_users (id, username, password_hash) 
      VALUES (?, ?, ?)
    `);
    
    stmt.run(id, defaultUsername, hashedPassword);
    
    console.log('🎉 Admin user created successfully!');
    console.log('');
    console.log('📋 Admin Credentials:');
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('');
    console.log('🔗 Admin URLs:');
    console.log('   Login: http://localhost:3001/admin/login');
    console.log('   Dashboard: http://localhost:3001/admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
    db.close();
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin(); 