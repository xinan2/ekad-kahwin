import { adminAuth } from '@/lib/auth';
import { sanitizeUsername, sanitizeText, logSecurityEvent } from '@/lib/input-sanitizer';

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Sanitize inputs to prevent injection attacks
    const username = sanitizeUsername(rawData.username || '');
    const password = sanitizeText(rawData.password || '', 200); // Max 200 chars for password
    
    // Log if original input was modified (potential attack)
    if (username !== rawData.username || password !== rawData.password) {
      logSecurityEvent('LOGIN_INPUT_SANITIZED', {
        originalUsername: rawData.username?.substring(0, 20),
        originalPassword: '[REDACTED]'
      });
    }

    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      );
    }

    const result = await adminAuth.login(username, password);

    if (result.success) {
      return Response.json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      return Response.json(
        { error: result.error }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 