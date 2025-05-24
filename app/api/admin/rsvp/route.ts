import { rsvpResponses, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    // Require admin authentication - this will throw if not authenticated
    await requireAdmin();
    
    const responses = await rsvpResponses.getAllResponses();
    const stats = await rsvpResponses.getStats();
    
    return Response.json({
      success: true,
      data: {
        responses,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching RSVP data:', error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return Response.json(
        { error: 'Unauthorized - Admin access required' }, 
        { status: 401 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 