// src/types/auth.ts
import {
  User,
  UserPreferences,
  UserSubscription
} from './user';

/**
 * Authentication-related types for EyeDooApp
 * Uses standardized User types from user.ts
 */

/**
 * Authentication context interface
 * Provides all auth-related methods and state
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Profile management
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  
  // File uploads
  uploadProfileImage: (imageUri: string) => Promise<string>;
  
  // Email verification
  sendEmailVerification: () => Promise<void>;
  
  // Account management
  deleteAccount: () => Promise<void>;
  
  // Subscription management
  updateSubscription: (subscription: Partial<UserSubscription>) => Promise<void>;
}

/**
 * Sign up form data interface
 * Used for user registration
 */
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  businessName: string;
  specialties: string[];
  location: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

/**
 * Sign in form data interface
 * Used for user login
 */
export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Password reset form data interface
 */
export interface ResetPasswordFormData {
  email: string;
}

/**
 * Change password form data interface
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Authentication error types
 */
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

// Re-export User types for convenience
export type { User, UserPreferences, UserSubscription } from './user';

