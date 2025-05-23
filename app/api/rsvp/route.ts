import { rsvpResponses } from '@/lib/auth';

export async function GET() {
  try {
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
    return Response.json(
      { success: false, error: 'Failed to fetch RSVP data' },
      { status: 500 }
    );
  }
} 