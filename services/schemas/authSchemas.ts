import { z } from 'zod';
import { FirestoreTimestampSchema, OptionalFirestoreTimestampSchema } from '../../types/reusableSchemas';
import { CommonSchemas } from '../utils/validationHelpers';

/**
 * EyeDooApp Auth Service Validation Schemas
 * Comprehensive validation for authentication operations
 */

// Base user registration schema
export const RegisterInputSchema = z.object({
  email: CommonSchemas.email,
  password: CommonSchemas.password,
  displayName: CommonSchemas.displayName,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Login credentials schema
export const LoginInputSchema = z.object({
  email: CommonSchemas.email,
  password: z.string().min(1, 'Password is required')
});

// Password reset schema
export const PasswordResetInputSchema = z.object({
  email: CommonSchemas.email
});

// Change password schema
export const ChangePasswordInputSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: CommonSchemas.password,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

// Update profile schema
export const UpdateProfileInputSchema = z.object({
  displayName: CommonSchemas.displayName.optional(),
  email: CommonSchemas.email.optional(),
  photoURL: CommonSchemas.url.optional().or(z.literal('')),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  // At least one field must be provided for update
  return data.displayName || data.email || data.photoURL !== undefined || data.phoneNumber !== undefined;
}, {
  message: "At least one field must be provided for update"
});

// User preferences schema
export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false)
  }).default({}),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private']).default('private'),
    allowDataCollection: z.boolean().default(false)
  }).default({}),
  locale: z.string().min(2).max(10).default('en'),
  timezone: z.string().min(3).max(50).default('UTC'),  
});

export const UserSetupSchema = z.object({
  firstTimeSetup: z.boolean().default(true),
  showOnboarding: z.boolean().default(true),
  customKitListSetup: z.boolean().default(false),
  customTaskListSetup: z.boolean().default(false),
  customNFCBusinessCardSetup: z.boolean().default(false),
  customGroupShotsSetup: z.boolean().default(false),
  customCoupleShotsSetup: z.boolean().default(false),  
});

// User subscription schema (for future premium features)
export const UserSubscriptionSchema = z.object({
  planType: z.enum(['free', 'premium', 'enterprise']).default('free'),
  isActive: z.boolean().default(false),
  expiresAt: z.date().optional(),
  autoRenew: z.boolean().default(false),
  features: z.array(z.string()).default([])
});

// Complete user profile schema for Firebase user creation
export const CreateUserProfileSchema = z.object({
  uid: CommonSchemas.userId,
  email: CommonSchemas.email,
  displayName: CommonSchemas.displayName,
  photoURL: CommonSchemas.url.optional().or(z.literal('')),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  createdAt: FirestoreTimestampSchema,
  updatedAt: FirestoreTimestampSchema,
  lastLoginAt: OptionalFirestoreTimestampSchema,
  isEmailVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  preferences: UserPreferencesSchema.default({}),
  subscription: UserSubscriptionSchema.default({})
});

// User update schema (for existing users)
export const UpdateUserProfileSchema = CreateUserProfileSchema.partial().extend({
  uid: CommonSchemas.userId, // UID is always required
  updatedAt: z.date() // updatedAt is always required for updates
});

// Social login schema (Google, Apple, etc.)
export const SocialLoginSchema = z.object({
  provider: z.enum(['google', 'apple', 'facebook', 'twitter']),
  accessToken: z.string().min(1, 'Access token is required'),
  idToken: z.string().min(1, 'ID token is required').optional(),
  refreshToken: z.string().optional()
});

// Email verification schema
export const EmailVerificationSchema = z.object({
  email: CommonSchemas.email,
  verificationCode: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers')
});

// Two-factor authentication schemas
export const Setup2FASchema = z.object({
  userId: CommonSchemas.userId,
  secret: z.string().min(16, 'Invalid 2FA secret'),
  verificationCode: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers')
});

export const Verify2FASchema = z.object({
  userId: CommonSchemas.userId,
  verificationCode: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers')
});

// Account deletion schema
export const DeleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required for account deletion'),
  confirmDeletion: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm account deletion' })
  }),
  reason: z.string()
    .min(10, 'Please provide a reason for deletion (minimum 10 characters)')
    .max(500, 'Reason too long (maximum 500 characters)')
    .optional()
});

// Session management schemas
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  deviceId: z.string().min(1, 'Device ID is required').optional()
});

export const LogoutSchema = z.object({
  allDevices: z.boolean().default(false),
  deviceId: z.string().optional()
});

// Type exports for use in services
export type UserSetup = z.infer<typeof UserSetupSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetInputSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
export type SocialLogin = z.infer<typeof SocialLoginSchema>;
export type EmailVerification = z.infer<typeof EmailVerificationSchema>;
export type Setup2FA = z.infer<typeof Setup2FASchema>;
export type Verify2FA = z.infer<typeof Verify2FASchema>;
export type DeleteAccount = z.infer<typeof DeleteAccountSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type Logout = z.infer<typeof LogoutSchema>; 