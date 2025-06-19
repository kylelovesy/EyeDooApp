// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from '../types/auth';
import { LanguageOption, SubscriptionPlan, WeatherUnit } from '../types/user';
import { auth, db, storage } from './firebase';
import { convertTimestampFields } from './utils/timestampHelpers';

export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
}

export class AuthService {
  /**
   * Sign up with email and password for EyeDooApp
   */
  static async signUp(
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Create user document in Firestore with EyeDooApp specific fields
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: displayName || firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date() as any, // Will be converted by timestampHelpers when reading from DB
        updatedAt: new Date() as any, // Will be converted by timestampHelpers when reading from DB
        preferences: {
          notifications: true,
          darkMode: false,
          language: LanguageOption.ENGLISH,
          weatherUnits: WeatherUnit.METRIC,
          emailMarketing: false,
          weekStartsOn: 1,
        },
        subscription: {
          plan: SubscriptionPlan.FREE,
          expiresAt: null,
          features: [],
          isActive: true,
          autoRenew: false,
        },
        isEmailVerified: false,
        isActive: true,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('EyeDooApp: User account created successfully');
      return userData;
    } catch (error: any) {
      console.error('EyeDooApp: Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('EyeDooApp: User signed in successfully');
        
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLoginAt: serverTimestamp(),
        });
        
        return convertTimestampFields(
          { ...userData } as User,
          ['createdAt', 'updatedAt', 'lastLoginAt']
        );
      } else {
        // Create user document if it doesn't exist (for existing Firebase users)
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date() as any, // Will be converted by timestampHelpers when reading from DB
          updatedAt: new Date() as any, // Will be converted by timestampHelpers when reading from DB
          lastLoginAt: new Date() as any, // Will be converted by timestampHelpers when reading from DB
          preferences: {
            notifications: true,
            darkMode: false,
            language: LanguageOption.ENGLISH,
            weatherUnits: WeatherUnit.METRIC,
            emailMarketing: false,
            weekStartsOn: 1,
          },
          subscription: {
            plan: SubscriptionPlan.FREE,
            expiresAt: null,
            features: [],
            isActive: true,
            autoRenew: false,
          },
          isEmailVerified: firebaseUser.emailVerified || false,
          isActive: true,
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        
        return userData;
      }
    } catch (error: any) {
      console.error('EyeDooApp: Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('EyeDooApp: User signed out successfully');
    } catch (error: any) {
      console.error('EyeDooApp: Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('EyeDooApp: Password reset email sent');
    } catch (error: any) {
      console.error('EyeDooApp: Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('EyeDooApp: Profile updated successfully');
    } catch (error: any) {
      console.error('EyeDooApp: Update profile error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user data
   */
  static async getCurrentUserData(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Convert timestamp fields using standardized helper
        return convertTimestampFields(
          { ...userData } as User,
          ['createdAt', 'updatedAt', 'lastLoginAt']
        );
      }
      return null;
    } catch (error: any) {
      console.error('EyeDooApp: Get current user error:', error);
      return null;
    }
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `eyedooapp/profile-images/${userId}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update user profile with new photo URL
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { photoURL: downloadURL });
      }
      
      // Update Firestore document
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      console.log('EyeDooApp: Profile image uploaded successfully');
      return downloadURL;
    } catch (error: any) {
      console.error('EyeDooApp: Upload profile image error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getCurrentUserData();
        callback(userData);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Handle authentication errors with user-friendly messages
   */
  private static handleAuthError(error: any): AuthError {
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        userMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        userMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        userMessage = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        userMessage = 'Password should be at least 6 characters long.';
        break;
      case 'auth/invalid-email':
        userMessage = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        userMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        userMessage = 'Network error. Please check your connection.';
        break;
    }

    return {
      code: error.code || 'unknown',
      message: error.message || 'Unknown error',
      userMessage,
    };
  }
}