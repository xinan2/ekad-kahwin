import { z } from 'zod';

// Define the schema for login form validation
export const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormState = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string[]; // For errors not specific to a field
  };
  success: boolean;
}; 