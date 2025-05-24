# Standard Form Implementation with Next.js Server Components & Actions

This document outlines a standard pattern for implementing forms in a Next.js application using Server Components, Server Actions, React Hook Form for form management, and Zod for validation.

## 1. Directory Structure

We recommend the following directory structure to organize your form-related code:

```
.
├── lib/
│   ├── actions/                     # Server Actions
│   │   └── adminLoginActions.ts     # Example: Login action
│   ├── schemas/                     # Zod schemas and related types
│   │   └── adminLoginSchema.ts    # Example: Login schema and form state type
│   └── auth.ts                      # Example: Authentication logic (used by actions)
├── components/
│   └── AdminLoginForm.tsx           # Example: Client component for the login form
├── app/
│   └── (protected)/                 # Example route group
│       └── admin/
│           └── login/
│               └── page.tsx         # Server Component page rendering the form
└── ... other files and folders
```

## 2. Schema Definition (`lib/schemas/<schemaName>Schema.ts`)

Create a file for your Zod schema and related form state types. This keeps validation logic and type definitions separate and reusable.

**Example: `lib/schemas/adminLoginSchema.ts`**

```typescript
import { z } from 'zod';

// Zod schema for form validation
export const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Type for the form values, inferred from the Zod schema
// export type LoginFormValues = z.infer<typeof LoginSchema>; // (Usually defined in the client component)

// Type for the state returned by the server action
export type LoginFormState = {
  message: string;       // General message (e.g., success or error summary)
  errors?: {
    username?: string[];  // Field-specific errors
    password?: string[];
    general?: string[];   // Errors not tied to a specific field
  };
  success: boolean;      // Indicates if the action was successful
};
```

## 3. Server Action (`lib/actions/<actionName>Actions.ts`)

Server actions handle the form submission logic on the server.

**Example: `lib/actions/adminLoginActions.ts`**

```typescript'use server';import { adminAuth } from '@/lib/auth'; // Your business logic (e.g., DB interaction)import { LoginSchema, LoginFormState } from '@/lib/db/schema';

export async function loginUser(
  prevState: LoginFormState, 
  formData: FormData
): Promise<LoginFormState> {
  try {
    // 1. Validate form data
    const validatedFields = LoginSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { username, password } = validatedFields.data;

    // 2. Perform business logic (e.g., authenticate user)
    const loginResult = await adminAuth.login(username, password);

    if (!loginResult.success) {
      return {
        message: loginResult.error || 'Invalid credentials',
        errors: { general: [loginResult.error || 'Invalid username or password'] },
        success: false,
      };
    }

    // 3. Return success state (client will handle redirect)
    return {
      message: 'Login successful!',
      success: true,
    };

  } catch (error) {
    console.error('Login action error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: { general: ['An unexpected error occurred. Please try again.'] },
      success: false,
    };
  }
}
```

**Key Points:**
- Must start with `'use server';`.
- Functions must be `async`.
- Receives `prevState` (from `useActionState`) and `formData`.
- Returns a promise of the `FormState` type.
- Handles data validation using the Zod schema.
- Interacts with backend services/databases.
- Returns structured error messages or a success indicator.

## 4. Client Component Form (`components/<FormName>.tsx`)

The client component handles the UI, client-side validation, and interaction with the server action.

**Example: `components/AdminLoginForm.tsx`**

```typescript
'use client';

import { useEffect, useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod'; // For type inference if needed

import { LoginSchema, LoginFormState } from '@/lib/db/schema';
import { loginUser } from '@/lib/actions/adminLoginActions';

// Infer form values type from Zod schema
type LoginFormValues = z.infer<typeof LoginSchema>;

const initialState: LoginFormState = {
  message: '',
  success: false,
};

// Optional: Separate SubmitButton to manage pending state text/icon
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button type="submit" disabled={isPending} className="your-button-styles">
      {isPending ? 'Processing...' : 'Submit'}
    </button>
  );
}

export default function AdminLoginForm() {
  // 1. Server action state management
  const [state, formAction] = useActionState(loginUser, initialState);
  
  // 2. Transition for pending UI (disabling form elements)
  const [isPending, startTransition] = useTransition();
  
  // 3. Next.js router for client-side navigation
  const router = useRouter();

  // 4. React Hook Form setup
  const {
    register,    // For registering input fields
    handleSubmit,  // Handles form submission and validation
    formState: { errors }, // Client-side validation errors from Zod
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema), // Integrate Zod for client-side validation
    defaultValues: {
      username: '', // Initialize form fields
      password: '',
    },
  });

  // 5. Effect for client-side redirection on success
  useEffect(() => {
    if (state.success) {
      // router.refresh(); // Optional: refresh server components if needed
      router.push('/admin'); // Redirect to a new page
    }
  }, [state.success, router]);

  // 6. Form submission handler
  const processSubmit = (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    startTransition(() => { // Wrap server action call in startTransition
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      {/* Display general errors from server action */}
      {state?.errors?.general && (
        <div className="error-message">
          {state.errors.general.map((error, index) => <p key={index}>{error}</p>)}
        </div>
      )}
      {!state.success && state.message && !state.errors?.general && (
        <div className="error-message"><p>{state.message}</p></div>
      )}

      <div>
        <label htmlFor="username">Username</label>
        <input 
          id="username" 
          type="text" 
          {...register('username')} 
          disabled={isPending}
          aria-invalid={errors.username || state?.errors?.username ? "true" : "false"}
        />
        {/* Client-side validation error */}
        {errors.username && <p className="error-text">{errors.username.message}</p>}
        {/* Server-side validation error */}
        {state?.errors?.username && 
          state.errors.username.map((err, i) => <p key={i} className="error-text">{err}</p>)}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          type="password" 
          {...register('password')} 
          disabled={isPending}
          aria-invalid={errors.password || state?.errors?.password ? "true" : "false"}
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
        {state?.errors?.password && 
          state.errors.password.map((err, i) => <p key={i} className="error-text">{err}</p>)}
      </div>

      <SubmitButton isPending={isPending} />
    </form>
  );
}
```

**Key Points:**
- Must start with `'use client';`.
- `useActionState` (from `react`) to manage state from the server action.
- `useTransition` (from `react`) to manage pending UI states during action execution.
- `useForm` (from `react-hook-form`) for form handling.
- `zodResolver` to integrate Zod for client-side validation.
- `handleSubmit` calls a wrapper function (`processSubmit`) which then calls `formAction` inside `startTransition`.
- Displays both client-side Zod validation errors and server-side errors from `state`.
- Uses `useEffect` to perform client-side actions (like redirection) based on the server action's success state.

## 5. Server Component Page (`app/.../page.tsx`)

This server component simply renders the client form component.

**Example: `app/(protected)/admin/login/page.tsx`**

```typescript
import AdminLoginForm from '@/components/AdminLoginForm';
import { adminAuth } from '@/lib/auth'; // Optional: for pre-checks
import { redirect } from 'next/navigation'; // Optional: for pre-checks

export default async function AdminLoginPage() {
  // Optional: Redirect if already authenticated
  const isAuthenticated = await adminAuth.isAuthenticated();
  if (isAuthenticated) {
    redirect('/admin'); // Or to the intended destination
  }

  return (
    <div className="page-container-styles">
      <div className="form-wrapper-styles">
        {/* Header/Title */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
```

This pattern provides a robust way to handle forms with strong typing, validation on both client and server, and clear separation of concerns. 