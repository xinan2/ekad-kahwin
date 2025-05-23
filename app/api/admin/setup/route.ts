import { adminAuth } from '@/lib/auth';
import Database from 'better-sqlite3';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check for existing admin users
    const db = new Database("admin.db");
    const existingAdmin = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
    
    if (existingAdmin.count > 0) {
      return Response.json(
        { error: 'Admin user already exists. Setup can only be run once.' }, 
        { status: 403 }
      );
    }

    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' }, 
        { status: 400 }
      );
    }

    const result = await adminAuth.createAdmin(username, password);

    if (result.success) {
      return Response.json({ 
        success: true, 
        message: 'Admin user created successfully',
        userId: result.id 
      });
    } else {
      return Response.json(
        { error: result.error }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Setup error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 