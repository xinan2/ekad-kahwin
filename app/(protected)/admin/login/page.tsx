import AdminLoginForm from '@/components/AdminLoginForm';
import { adminAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLoginPage() {
  // If user is already authenticated, redirect to admin dashboard
  const isAuthenticated = await adminAuth.isAuthenticated();
  if (isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-green-800">Admin Login</h1>
          <p className="text-green-600 mt-2">Access your wedding management dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
} 