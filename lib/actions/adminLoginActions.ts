'use server';

import { adminAuth } from '@/lib/auth';
// Definitions are now in lib/schemas/adminLoginSchema.ts
import { LoginSchema, LoginFormState } from '@/lib/schemas/adminLoginSchema';

export async function loginUser(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  try {
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

    const loginResult = await adminAuth.login(username, password);

    if (!loginResult.success) {
      return {
        message: loginResult.error || 'Invalid credentials',
        errors: { general: [loginResult.error || 'Invalid username or password'] },
        success: false,
      };
    }
    
  } catch (error) {
    console.error('Login action error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: { general: ['An unexpected error occurred. Please try again.'] },
      success: false,
    };
  }
  
  return {
    message: 'Login successful!',
    success: true,
  };
} 