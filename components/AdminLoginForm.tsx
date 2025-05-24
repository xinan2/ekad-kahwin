'use client';

import { useEffect, useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormState } from '@/lib/db/schema';
import { loginUser } from '@/lib/actions/adminLoginActions';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Define the type for form values based on Zod schema
type LoginFormValues = z.infer<typeof LoginSchema>;

const initialState: LoginFormState = {
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
          Signing in...
        </>
      ) : (
        'Sign In'
      )}
    </button>
  );
}

export default function AdminLoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (state.success) {
      router.push('/admin');
    }
  }, [state.success, router]);

  const processSubmit = (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <form 
        onSubmit={handleSubmit(processSubmit)}
        className="space-y-6"
      >
        {state?.errors?.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {state.errors.general.map((error, index) => <p key={index}>{error}</p>)}
          </div>
        )}
        {!state.success && state.message && !state.errors?.general && (
             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{state.message}</p>
            </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-green-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register('username')}
            disabled={isPending}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors 
                        ${errors.username || state?.errors?.username ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-green-200 focus:ring-green-500 focus:border-green-500'}`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
          )}
          {state?.errors?.username && (
            state.errors.username.map((error, index) => (
              <p key={index} className="text-xs text-red-600 mt-1">{error}</p>
            ))
          )
          }
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors 
                        ${errors.password || state?.errors?.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-green-200 focus:ring-green-500 focus:border-green-500'}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
           {state?.errors?.password && (
            state.errors.password.map((error, index) => (
              <p key={index} className="text-xs text-red-600 mt-1">{error}</p>
            ))
          )
          }
        </div>
        
        <SubmitButton isPending={isPending} />
      </form>
    </div>
  );
} 