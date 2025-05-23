import AdminSetupForm from '@/components/AdminSetupForm';
import { redirect } from 'next/navigation';
import Database from 'better-sqlite3';

export default async function AdminSetupPage() {
  // Check if admin users already exist
  try {
    const db = new Database("admin.db");
    const existingAdmin = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
    
    // If admin already exists, redirect to login
    if (existingAdmin.count > 0) {
      redirect('/admin/login');
    }
  } catch (error) {
    console.error('Database error during setup check:', error);
    // Continue to render the form - the server action will handle the error
  }

  return <AdminSetupForm />;
} 