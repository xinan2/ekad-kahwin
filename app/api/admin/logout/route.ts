import { adminAuth } from '@/lib/auth';

export async function POST() {
  try {
    await adminAuth.logout();
    return Response.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 