// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  updatedAt: Date;
  
  // EyeDooApp specific fields
  businessName: string;
  specialties: string[];
  location: string;
  preferences: UserPreferences;
  subscription: UserSubscription;
}

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  weatherUnits: 'metric' | 'imperial';
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'premium';
  expiresAt: Date | null;
  features: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfileImage: (imageUri: string) => Promise<string>;
}