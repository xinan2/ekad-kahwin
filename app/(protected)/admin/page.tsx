import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  try {
    // Check authentication
    const isAuthenticated = await adminAuth.isAuthenticatedReadOnly();
    if (!isAuthenticated) {
      redirect('/admin/login');
    }

    // Get current user
    const currentUser = await adminAuth.getCurrentUser();
    
    // Ensure we have a valid user with required properties
    if (!currentUser || !currentUser.id || !currentUser.username) {
      redirect('/admin/login');
    }
    
    const user = {
      id: currentUser.id,
      username: currentUser.username
    };
    
    return (
      <div className="h-screen overflow-y-auto overflow-x-hidden">
        <AdminDashboard user={user} />
      </div>
    );
  } catch (error) {
    console.error('Admin page error:', error);
    redirect('/admin/login');
  }
} 