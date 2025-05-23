import { adminAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

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