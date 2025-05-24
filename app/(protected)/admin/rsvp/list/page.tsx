import RSVPListComponent from '@/components/RSVPListComponent';
import { adminAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RSVPListPage() {
  // Check if user is authenticated
  const isAuthenticated = await adminAuth.isAuthenticatedReadOnly();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  // Get current user
  const user = await adminAuth.getCurrentUser();

  return <RSVPListComponent user={user} />;
} 