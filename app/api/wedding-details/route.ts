import { weddingDetails, requireAdmin } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET wedding details (public route)
export async function GET() {
  try {
    const details = await weddingDetails.getDetails();
    
    if (!details) {
      return Response.json(
        { error: 'Wedding details not found' }, 
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: details });
  } catch (error) {
    console.error('Error fetching wedding details:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// PUT wedding details (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const updateData = await request.json();

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.updated_at;

    const result = await weddingDetails.updateDetails(updateData);

    if (result.success) {
      return Response.json({ 
        success: true, 
        message: 'Wedding details updated successfully' 
      });
    } else {
      return Response.json(
        { error: result.error }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating wedding details:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return Response.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 