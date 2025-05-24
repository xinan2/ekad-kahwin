import { adminAuth } from '@/lib/auth';
import { db } from '@/lib/db/connect';
import { adminUsers } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check for existing admin users using Drizzle
    const existingAdminCount = await db
      .select({ count: count() })
      .from(adminUsers);
    
    if (existingAdminCount[0]?.count > 0) {
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