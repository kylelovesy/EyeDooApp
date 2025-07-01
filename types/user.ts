import { z } from 'zod';
import { FirestoreTimestampSchema, OptionalFirestoreTimestampSchema, PhoneSchema } from './reusableSchemas';

/**
 * User type definitions for the EyeDooApp
 * Centralized user-related schemas and types
 */

// === SUBSCRIPTION ENUMS ===

/**
 * Subscription plan enum
 */
export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  PREMIUM = 'premium',
}

/**
 * Subscription feature enum
 */
export enum SubscriptionFeature {
  UNLIMITED_PROJECTS = 'unlimited_projects',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  PRIORITY_SUPPORT = 'priority_support',
  CUSTOM_BRANDING = 'custom_branding',
  API_ACCESS = 'api_access',
  TEAM_COLLABORATION = 'team_collaboration',
  BACKUP_RESTORE = 'backup_restore',
  CUSTOM_TEMPLATES = 'custom_templates',
}

// === USER PREFERENCE ENUMS ===

/**
 * Language option enum
 */
export enum LanguageOption {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  ITALIAN = 'it',
}

/**
 * Weather unit enum
 */
export enum WeatherUnit {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}


// === CONVERT ENUMS TO ARRAYS FOR DROPDOWN OPTIONS ===

export const SUBSCRIPTION_PLANS = Object.values(SubscriptionPlan);
export const SUBSCRIPTION_FEATURES = Object.values(SubscriptionFeature);
export const LANGUAGE_OPTIONS = Object.values(LanguageOption);
export const WEATHER_UNITS = Object.values(WeatherUnit);

// === USER PREFERENCE SCHEMA ===
export const UserPreferencesSchema = z.object({
  notifications: z.boolean()
    .default(true)
    .describe('Whether to receive notifications'),
  
  darkMode: z.boolean()
    .default(false)
    .describe('Dark mode preference'),
  
  language: z.nativeEnum(LanguageOption)
    .default(LanguageOption.ENGLISH)
    .describe('Preferred language'),
  
  weatherUnits: z.nativeEnum(WeatherUnit)
    .default(WeatherUnit.METRIC)
    .describe('Temperature unit preference'),
  
  emailMarketing: z.boolean()
    .default(false)
    .describe('Opt-in for marketing emails'),
  
  weekStartsOn: z.number()
    .min(0)
    .max(6)
    .default(1)
    .describe('Day of week that calendar starts on (0=Sunday, 1=Monday)'),
});

// === USER SETUP SCHEMA ===
export const UserSetupSchema = z.object({
  firstTimeSetup: z.boolean().default(true),
  showOnboarding: z.boolean().default(true),
  customKitListSetup: z.boolean().default(false),
  customTaskListSetup: z.boolean().default(false),
  customNFCBusinessCardSetup: z.boolean().default(false),
  customGroupShotsSetup: z.boolean().default(false),
  customCoupleShotsSetup: z.boolean().default(false),
});

// === SUBSCRIPTION SCHEMA ===
export const UserSubscriptionSchema = z.object({
  plan: z.nativeEnum(SubscriptionPlan)
    .default(SubscriptionPlan.FREE)
    .describe('Current subscription plan'),
  
  expiresAt: OptionalFirestoreTimestampSchema
    .describe('Subscription expiration date'),
  
  features: z.array(z.nativeEnum(SubscriptionFeature))
    .default([])
    .describe('Available features for this subscription'),
  
  isActive: z.boolean()
    .default(true)
    .describe('Whether the subscription is currently active'),
  
  autoRenew: z.boolean()
    .default(false)
    .describe('Whether subscription auto-renews'),
  
  paymentMethodId: z.string()
    .optional()
    .describe('Stripe payment method ID'),
});

// === CHECKLIST ITEM SCHEMA ===
export const ChecklistItemSchema = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long."),
  category: z.enum(['NightBefore', 'MorningOf']),
  isChecked: z.boolean().default(false),
  isPredefined: z.boolean().default(false),
});
// === MAIN USER SCHEMA ===
export const UserSchema = z.object({
  // Core identity fields
  id: z.string()
    .describe('Unique user identifier'),
  
  email: z.string()
    .email('Invalid email address')
    .describe('User email address'),
  
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be under 100 characters')
    .describe('Display name for the user'),
  
  photoURL: z.string()
    .url('Invalid photo URL')
    .optional()
    .describe('Profile photo URL'),
  
  // Timestamp fields
  createdAt: FirestoreTimestampSchema.optional().describe('Account creation timestamp'),
  
  updatedAt: FirestoreTimestampSchema.optional().describe('Last profile update timestamp'),
  
  lastLoginAt: OptionalFirestoreTimestampSchema
    .describe('Last login timestamp'),
  
  // Contact information
  phone: PhoneSchema
    .optional()
    .describe('Phone number'),
  
  // Nested objects    
  preferences: UserPreferencesSchema
    .describe('User preferences and settings'),
  
  subscription: UserSubscriptionSchema
    .describe('Subscription information'),

  setup: UserSetupSchema
    .describe('User setup information'),
  
  // Account status
  isEmailVerified: z.boolean()
    .default(false)
    .describe('Whether email is verified'),
  
  isActive: z.boolean()
    .default(true)
    .describe('Whether the account is active'),
  
  // Optional fields for future features
  referralCode: z.string()
    .optional()
    .describe('Referral code for inviting others'),
  
  referredBy: z.string()
    .optional()
    .describe('User ID of who referred this user'),
});

// === CREATE USER SCHEMA ===
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

// === UPDATE USER SCHEMA ===
export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
});

// === PUBLIC USER PROFILE SCHEMA ===
// For displaying user info to other users (limited fields)
export const PublicUserProfileSchema = UserSchema.pick({
  id: true,
  displayName: true,
  photoURL: true,
});

// === EXPORT TYPES ===
export type User = z.infer<typeof UserSchema>;
export type UserSetup = z.infer<typeof UserSetupSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUserProfile = z.infer<typeof PublicUserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

// Types are already exported above with their enum definitions

