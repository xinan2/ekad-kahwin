'use client';

import { useEffect, useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';

import { SetupSchema, SetupFormState } from '@/lib/db/schema';
import { setupAdmin } from '@/lib/actions/adminSetupActions';

// Infer form values type from Zod schema
type SetupFormValues = z.infer<typeof SetupSchema>;

const initialState: SetupFormState = {
  message: '',
  success: false,
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
    >
      {isPending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating Admin...
        </>
      ) : (
        'Create Admin Account'
      )}
    </button>
  );
}

export default function AdminSetupForm() {
  // 1. Server action state management
  const [state, formAction] = useActionState(setupAdmin, initialState);
  
  // 2. Transition for pending UI
  const [isPending, startTransition] = useTransition();
  
  // 3. Next.js router for client-side navigation
  const router = useRouter();

  // 4. React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(SetupSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 5. Effect for client-side redirection on success
  useEffect(() => {
    if (state.success) {
      // Show success message briefly, then redirect
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    }
  }, [state.success, router]);

  // 6. Form submission handler
  const processSubmit = (data: SetupFormValues) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    
    startTransition(() => {
      formAction(formData);
    });
  };

  // Success state UI
  if (state.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Setup Complete!</h1>
            <p className="text-green-600 mb-4">
              Admin account created successfully. Redirecting to login...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h1 className="text-2xl font-bold text-green-800">Admin Setup</h1>
          <p className="text-green-600 mt-2">Create your admin account</p>
        </div>

        {/* Setup Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">
              <strong>One-time setup:</strong> This page creates your admin account and should only be used once.
            </p>
          </div>

          <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
            {/* Display general errors from server action */}
            {state?.errors?.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {state.errors.general.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            {!state.success && state.message && !state.errors?.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{state.message}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-green-700 mb-2">
                Admin Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username')}
                disabled={isPending}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Choose admin username"
                aria-invalid={errors.username || state?.errors?.username ? "true" : "false"}
              />
              {/* Client-side validation error */}
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
              {/* Server-side validation error */}
              {state?.errors?.username && 
                state.errors.username.map((err, i) => (
                  <p key={i} className="mt-1 text-sm text-red-600">{err}</p>
                ))}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                disabled={isPending}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Create secure password"
                aria-invalid={errors.password || state?.errors?.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {state?.errors?.password && 
                state.errors.password.map((err, i) => (
                  <p key={i} className="mt-1 text-sm text-red-600">{err}</p>
                ))}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                disabled={isPending}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Confirm your password"
                aria-invalid={errors.confirmPassword || state?.errors?.confirmPassword ? "true" : "false"}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
              {state?.errors?.confirmPassword && 
                state.errors.confirmPassword.map((err, i) => (
                  <p key={i} className="mt-1 text-sm text-red-600">{err}</p>
                ))}
            </div>

            <SubmitButton isPending={isPending} />
          </form>
        </div>

        {/* Navigation */}
        <div className="text-center mt-6 space-y-2">
          <Link 
            href="/admin/login"
            className="block text-green-600 hover:text-green-700 text-sm transition-colors"
          >
            Already have an account? Sign in
          </Link>
          <Link 
            href="/"
            className="block text-green-600 hover:text-green-700 text-sm transition-colors"
          >
            ← Back to Wedding Invitation
          </Link>
        </div>
      </div>
    </div>
  );
} 