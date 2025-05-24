import { adminAuth } from '@/lib/auth';

export async function GET() {
  try {
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