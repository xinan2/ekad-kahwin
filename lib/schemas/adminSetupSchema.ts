import { z } from 'zod';

// Define the schema for admin setup form validation
export const SetupSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SetupFormState = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[]; // For errors not specific to a field
  };
  success: boolean;
}; 