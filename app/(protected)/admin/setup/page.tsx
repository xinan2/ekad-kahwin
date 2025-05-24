import AdminSetupForm from '@/components/AdminSetupForm';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/connect';
import { adminUsers } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export default async function AdminSetupPage() {
  // Check if admin users already exist
  try {
    const existingAdminCount = await db
      .select({ count: count() })
      .from(adminUsers);
    
    // If admin already exists, redirect to login
    if (existingAdminCount[0]?.count > 0) {
      redirect('/admin/login');
    }
  } catch (error) {
    console.error('Database error during setup check:', error);
    // Continue to render the form - the server action will handle the error
  }

  return <AdminSetupForm />;
} 