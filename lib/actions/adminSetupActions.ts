'use server';

import { adminAuth } from '@/lib/auth';
import { db } from '@/lib/db/connect';
import { adminUsers } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import { SetupSchema, SetupFormState } from '@/lib/db/schema';

export async function setupAdmin(
  prevState: SetupFormState, 
  formData: FormData
): Promise<SetupFormState> {
  try {
    // 1. Validate form data
    const validatedFields = SetupSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { username, password } = validatedFields.data;

    // 2. Check for existing admin users using Drizzle
    const existingAdminCount = await db
      .select({ count: count() })
      .from(adminUsers);
    
    if (existingAdminCount[0]?.count > 0) {
      return {
        message: 'Admin user already exists. Setup can only be run once.',
        errors: { general: ['Admin user already exists. Setup can only be run once.'] },
        success: false,
      };
    }

    // 3. Create admin user
    const result = await adminAuth.createAdmin(username, password);

    if (!result.success) {
      return {
        message: result.error || 'Failed to create admin user',
        errors: { general: [result.error || 'Failed to create admin user'] },
        success: false,
      };
    }

    // 4. Return success state
    return {
      message: 'Admin user created successfully!',
      success: true,
    };

  } catch (error) {
    console.error('Setup action error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: { general: ['An unexpected error occurred. Please try again.'] },
      success: false,
    };
  }
} 