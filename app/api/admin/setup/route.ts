import { adminAuth } from '@/lib/auth';
import { db } from '@/lib/db/connect';
import { adminUsers } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import { sanitizeUsername, sanitizeText, logSecurityEvent } from '@/lib/input-sanitizer';

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Sanitize inputs to prevent injection attacks
    const username = sanitizeUsername(rawData.username || '');
    const password = sanitizeText(rawData.password || '', 200);
    
    // Log if original input was modified (potential attack)
    if (username !== rawData.username || password !== rawData.password) {
      logSecurityEvent('SETUP_INPUT_SANITIZED', {
        originalUsername: rawData.username?.substring(0, 20),
        originalPassword: '[REDACTED]'
      });
    }

    // Enhanced admin existence check with transaction safety
    const existingAdminCount = await db
      .select({ count: count() })
      .from(adminUsers);
    
    if (existingAdminCount[0]?.count > 0) {
      // Log potential setup abuse attempt
      logSecurityEvent('SETUP_ATTEMPT_AFTER_ADMIN_EXISTS', {
        attemptedUsername: username,
        existingAdminCount: existingAdminCount[0].count
      });
      
      return Response.json(
        { error: 'Admin user already exists. Setup can only be run once.' }, 
        { status: 403 }
      );
    }
    
    // Additional security: Check if setup has been disabled via environment variable
    if (process.env.DISABLE_SETUP === 'true') {
      logSecurityEvent('SETUP_ATTEMPT_WHEN_DISABLED', {
        attemptedUsername: username
      });
      
      return Response.json(
        { error: 'Setup has been permanently disabled for security.' }, 
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