import { adminAuth } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication first
    const isAuth = await adminAuth.isAuthenticated();
    if (!isAuth) {
      return Response.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }
    
    // Update session activity since this is a route handler
    await adminAuth.updateSessionActivity();
    
    const currentUser = await adminAuth.getCurrentUser();
    
    if (!currentUser) {
      return Response.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }
    
    return Response.json({
      success: true,
      data: {
        user: currentUser
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 