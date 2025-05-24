import { adminAuth } from '@/lib/auth';

export async function POST() {
  try {
    // Verify user is authenticated before allowing logout
    const isAuthenticated = await adminAuth.isAuthenticated();
    if (!isAuthenticated) {
      return Response.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }
    
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