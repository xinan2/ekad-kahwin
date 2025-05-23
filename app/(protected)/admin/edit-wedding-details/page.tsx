import { getWeddingDetails } from '@/lib/actions/weddingDetailsActions';
import WeddingDetailsForm from '@/components/WeddingDetailsForm'; // This component will be created next
import { adminAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EditWeddingDetailsPage() {
  // Ensure user is authenticated
  const isAuthenticated = await adminAuth.isAuthenticated();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const initialDetails = await getWeddingDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-green-100">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800">Edit Wedding Details</h1>
            <p className="text-green-600 mt-1">Manage all the information for the wedding invitation.</p>
          </div>
          <WeddingDetailsForm initialDetails={initialDetails} />
        </div>
      </div>
    </div>
  );
} 