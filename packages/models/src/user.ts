import { z } from 'zod';

// Base User schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  avatar: z.string().url().optional(),
  isEmailVerified: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User creation schema (without optional fields)
export const CreateUserSchema = UserSchema.omit({
  _id: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
});

// User update schema (all fields optional except _id)
export const UpdateUserSchema = UserSchema.partial().required({
  _id: true,
});

// Public user schema (without sensitive data)
export const PublicUserSchema = UserSchema.omit({
  email: true,
});

// Types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
