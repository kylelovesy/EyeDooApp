# Day 2: Authentication & User Management - Updated Instructions
## Eye Do Plan - Local Development Build & Android Testing

## Overview
Day 2 focuses on completing the authentication system with Google Sign-In using local development builds, user profile management, authentication guards, and enhanced error handling. This guide is specifically updated for Android emulator testing and GitHub integration.

## Prerequisites
- Day 1 completed successfully with Eye Do Plan setup
- Android emulator running and connected
- Firebase project configured with Google Sign-In enabled
- GitHub repository connected and synced

## Step-by-Step Implementation

### Task 2.1: Local Development Build Configuration (60 minutes)

#### Step 1: Configure Google Sign-In for Local Development
Update `app.json` for local development builds:

```json
{
  "expo": {
    "name": "Eye Do Plan",
    "slug": "eye-do-plan",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6750A4"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.morlove.eyedoplan",
      "config": {
        "googleSignIn": {
          "reservedClientId": "YOUR_IOS_CLIENT_ID"
        }
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6750A4"
      },
      "package": "com.morlove.eyedoplan",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.INTERNET"
      ],
      "config": {
        "googleSignIn": {
          "apiKey": "YOUR_ANDROID_API_KEY",
          "certificateHash": "YOUR_SHA1_FINGERPRINT"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.morlove.eyedoplan",
          "androidUrlScheme": "com.morlove.eyedoplan"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Eye Do Plan needs access to your photos to upload wedding images.",
          "cameraPermission": "Eye Do Plan needs access to your camera to capture wedding moments."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "scheme": "eyedoplan",
    "owner": "morlove"
  }
}
```

#### Step 2: Enhanced Authentication Service for Local Development
Update `src/services/authService.ts`:

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { User } from '../types';

export class AuthService {
  // Sign up with email and password for Eye Do Plan
  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Create user document in Firestore with Eye Do Plan specific fields
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: displayName || firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Eye Do Plan specific fields
        businessName: '',
        specialties: [],
        location: '',
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
        },
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      console.log('Eye Do Plan: User account created successfully');
      return userData;
    } catch (error) {
      console.error('Eye Do Plan: Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        console.log('Eye Do Plan: User signed in successfully');
        return userDoc.data() as User;
      } else {
        // Create user document if it doesn't exist (for existing Firebase users)
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          businessName: '',
          specialties: [],
          location: '',
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'en',
          },
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }
    } catch (error) {
      console.error('Eye Do Plan: Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('Eye Do Plan: User signed out successfully');
    } catch (error) {
      console.error('Eye Do Plan: Sign out error:', error);
      throw error;
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Eye Do Plan: Password reset email sent');
    } catch (error) {
      console.error('Eye Do Plan: Password reset error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
      console.log('Eye Do Plan: Profile updated successfully');
    } catch (error) {
      console.error('Eye Do Plan: Update profile error:', error);
      throw error;
    }
  }

  // Get current user data
  static async getCurrentUserData(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      console.error('Eye Do Plan: Get current user error:', error);
      return null;
    }
  }

  // Upload profile image
  static async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `eye-do-plan/profile-images/${userId}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update user profile with new photo URL
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { photoURL: downloadURL });
      }
      
      // Update Firestore document
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      console.log('Eye Do Plan: Profile image uploaded successfully');
      return downloadURL;
    } catch (error) {
      console.error('Eye Do Plan: Upload profile image error:', error);
      throw error;
    }
  }
}
```

#### Step 3: Google Sign-In Service for Local Development
Create `src/services/googleSignInService.ts`:

```typescript
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export class GoogleSignInService {
  static async configure(): Promise<void> {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_ANDROID_CLIENT_ID,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
      console.log('Eye Do Plan: Google Sign-In configured successfully');
    } catch (error) {
      console.error('Eye Do Plan: Google Sign-In configuration error:', error);
      throw error;
    }
  }

  static async signIn(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('No ID token received from Google');
      }

      console.log('Eye Do Plan: Google Sign-In successful, creating Firebase credential');

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      
      // Sign in with Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      let userData: User;
      
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
        console.log('Eye Do Plan: Existing user signed in with Google');
      } else {
        // Create new user document with Eye Do Plan specific fields
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          businessName: '',
          specialties: [],
          location: '',
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'en',
          },
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        console.log('Eye Do Plan: New user created with Google Sign-In');
      }

      return userData;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google Sign-In is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        console.error('Eye Do Plan: Google Sign-In error:', error);
        throw error;
      }
    }
  }

  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('Eye Do Plan: Google Sign-Out successful');
    } catch (error) {
      console.error('Eye Do Plan: Google Sign-Out error:', error);
      throw error;
    }
  }

  static async isSignedIn(): Promise<boolean> {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Eye Do Plan: Google Sign-In check error:', error);
      return false;
    }
  }
}
```

### Task 2.2: Enhanced Login Screen for Android (60 minutes)

#### Step 1: Update Login Screen with Eye Do Plan Branding
Update `app/(auth)/login.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { GoogleSignInService } from '../../src/services/googleSignInService';
import { ErrorHandler } from '../../src/utils/errorHandler';
import { Screen } from '../../src/components/ui/Screen';
import { styles } from '../../src/utils/styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    // Configure Google Sign-In on component mount for local development
    GoogleSignInService.configure().catch((error) => {
      console.error('Eye Do Plan: Failed to configure Google Sign-In:', error);
    });
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eye Do Plan', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const appError = ErrorHandler.handleAuthError(error);
      Alert.alert('Eye Do Plan - Login Error', appError.userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const userData = await GoogleSignInService.signIn();
      console.log('Eye Do Plan: Google Sign-In completed for user:', userData.email);
      // The auth context will automatically update and navigate
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Eye Do Plan - Google Sign-In Error', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.centerContent}>
        <Text variant="headlineLarge" style={[styles.title, styles.brandText]}>
          Eye Do Plan
        </Text>
        <Text variant="bodyLarge" style={{ marginBottom: 32, textAlign: 'center', color: '#49454F' }}>
          Wedding Photography Assistant by morlove
        </Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center' }}>
              Welcome Back
            </Text>
            
            <View style={styles.form}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                disabled={loading || googleLoading}
                left={<TextInput.Icon icon="email" />}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                disabled={loading || googleLoading}
                left={<TextInput.Icon icon="lock" />}
              />
              
              <Button
                mode="contained"
                onPress={handleEmailLogin}
                loading={loading}
                disabled={loading || googleLoading}
                style={styles.button}
                icon="login"
              >
                Sign In to Eye Do Plan
              </Button>

              <Button
                mode="text"
                onPress={() => router.push('/(auth)/forgot-password')}
                disabled={loading || googleLoading}
                style={styles.button}
              >
                Forgot Password?
              </Button>

              <Divider style={{ marginVertical: 16 }} />

              <Button
                mode="outlined"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
                disabled={loading || googleLoading}
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="google" size={size} color={color} />
                )}
                style={styles.button}
              >
                Continue with Google
              </Button>
              
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/register')}
                disabled={loading || googleLoading}
                style={styles.button}
              >
                Don't have an account? Sign Up
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </Screen>
  );
}
```

#### Step 2: Update Register Screen with Eye Do Plan Branding
Update `app/(auth)/register.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { ErrorHandler } from '../../src/utils/errorHandler';
import { Screen } from '../../src/components/ui/Screen';
import { styles } from '../../src/utils/styles';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Eye Do Plan', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Eye Do Plan', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Eye Do Plan', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.replace('/(tabs)');
    } catch (error: any) {
      const appError = ErrorHandler.handleAuthError(error);
      Alert.alert('Eye Do Plan - Registration Error', appError.userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.centerContent}>
        <Text variant="headlineLarge" style={[styles.title, styles.brandText]}>
          Eye Do Plan
        </Text>
        <Text variant="bodyLarge" style={{ marginBottom: 32, textAlign: 'center', color: '#49454F' }}>
          Join the Wedding Photography Community
        </Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center' }}>
              Create Account
            </Text>
            
            <View style={styles.form}>
              <TextInput
                label="Full Name"
                value={displayName}
                onChangeText={setDisplayName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
              />
              
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
              />
              
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="account-plus"
              >
                Create Eye Do Plan Account
              </Button>
              
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/login')}
                style={styles.button}
              >
                Already have an account? Sign In
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </Screen>
  );
}
```

### Task 2.3: User Profile Management for Eye Do Plan (60 minutes)

#### Step 1: Enhanced User Types for Eye Do Plan
Update `src/types/index.ts`:

```typescript
// Enhanced types for Eye Do Plan
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  // Eye Do Plan specific fields
  businessName?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  specialties?: string[];
  experience?: number;
  portfolio?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  stats?: {
    projectsCompleted: number;
    clientsServed: number;
    yearsActive: number;
  };
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  weddingDate: Date;
  venue: string;
  status: 'planning' | 'active' | 'completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // Eye Do Plan specific project fields
  budget?: number;
  guestCount?: number;
  photographyStyle?: string[];
  specialRequests?: string;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  duration: number;
  location: string;
  description?: string;
  shotList?: string[];
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  businessName?: string;
  specialties?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
```

#### Step 2: Profile Screen for Eye Do Plan
Create `app/(tabs)/profile.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  TextInput,
  List,
  Divider,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/contexts/AuthContext';
import { ProfileService } from '../../src/services/profileService';
import { GoogleSignInService } from '../../src/services/googleSignInService';
import { Screen } from '../../src/components/ui/Screen';
import { styles } from '../../src/utils/styles';
import { User, ProfileUpdateData } from '../../src/types';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({});

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await ProfileService.getProfile(user.id);
      setProfile(profileData);
      setFormData({
        displayName: profileData?.displayName || '',
        bio: profileData?.bio || '',
        phone: profileData?.phone || '',
        website: profileData?.website || '',
        location: profileData?.location || '',
        businessName: profileData?.businessName || '',
      });
    } catch (error) {
      console.error('Eye Do Plan: Load profile error:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await ProfileService.updateProfile(user.id, formData);
      await loadProfile();
      setEditing(false);
      Alert.alert('Eye Do Plan', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Eye Do Plan', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Eye Do Plan', 'Please grant camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        await ProfileService.uploadProfileImage(user.id, result.assets[0].uri);
        await loadProfile();
        Alert.alert('Eye Do Plan', 'Profile image updated successfully');
      } catch (error) {
        Alert.alert('Eye Do Plan', 'Failed to update profile image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Eye Do Plan',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Google if signed in
              const isGoogleSignedIn = await GoogleSignInService.isSignedIn();
              if (isGoogleSignedIn) {
                await GoogleSignInService.signOut();
              }
              await signOut();
            } catch (error) {
              console.error('Eye Do Plan: Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <Screen>
        <View style={styles.centerContent}>
          <Text>Please sign in to view your Eye Do Plan profile</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      {/* Profile Header */}
      <Card style={styles.card}>
        <Card.Content style={styles.centerContent}>
          <Avatar.Image
            size={100}
            source={{ uri: profile?.photoURL || user.photoURL || 'https://via.placeholder.com/100' }}
            style={{ marginBottom: 16 }}
          />
          <Text variant="headlineSmall" style={styles.brandText}>
            {profile?.displayName || user.displayName || 'Eye Do Plan User'}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#49454F', marginBottom: 16 }}>
            {profile?.businessName || 'Wedding Photographer'}
          </Text>
          <Button
            mode="outlined"
            onPress={handleImagePicker}
            disabled={loading}
            icon="camera"
          >
            Change Photo
          </Button>
        </Card.Content>
      </Card>

      {/* Profile Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="titleMedium">Profile Information</Text>
            <Button
              mode={editing ? 'contained' : 'outlined'}
              onPress={() => setEditing(!editing)}
              disabled={loading}
              icon={editing ? 'close' : 'pencil'}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {editing ? (
            <View style={styles.form}>
              <TextInput
                label="Display Name"
                value={formData.displayName}
                onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
              
              <TextInput
                label="Business Name"
                value={formData.businessName}
                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="store" />}
              />
              
              <TextInput
                label="Bio"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                left={<TextInput.Icon icon="text" />}
              />
              
              <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />
              
              <TextInput
                label="Website"
                value={formData.website}
                onChangeText={(text) => setFormData({ ...formData, website: text })}
                mode="outlined"
                keyboardType="url"
                style={styles.input}
                left={<TextInput.Icon icon="web" />}
              />
              
              <TextInput
                label="Location"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
              />

              <Button
                mode="contained"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="content-save"
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <View>
              <List.Item
                title="Name"
                description={profile?.displayName || 'Not set'}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
              <List.Item
                title="Email"
                description={user.email}
                left={(props) => <List.Icon {...props} icon="email" />}
              />
              <List.Item
                title="Business"
                description={profile?.businessName || 'Not set'}
                left={(props) => <List.Icon {...props} icon="store" />}
              />
              <List.Item
                title="Bio"
                description={profile?.bio || 'Not set'}
                left={(props) => <List.Icon {...props} icon="text" />}
              />
              <List.Item
                title="Phone"
                description={profile?.phone || 'Not set'}
                left={(props) => <List.Icon {...props} icon="phone" />}
              />
              <List.Item
                title="Location"
                description={profile?.location || 'Not set'}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Specialties */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Photography Specialties
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {profile?.specialties?.length ? (
              profile.specialties.map((specialty, index) => (
                <Chip key={index} icon="camera">
                  {specialty}
                </Chip>
              ))
            ) : (
              <Text variant="bodyMedium" style={{ fontStyle: 'italic' }}>
                No specialties added yet
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Account Actions
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => {/* Navigate to change password */}}
            icon="lock"
            style={[styles.button, { marginBottom: 8 }]}
          >
            Change Password
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {/* Navigate to privacy settings */}}
            icon="shield-account"
            style={[styles.button, { marginBottom: 8 }]}
          >
            Privacy Settings
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSignOut}
            icon="logout"
            buttonColor="#BA1A1A"
            style={styles.button}
          >
            Sign Out of Eye Do Plan
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
}
```


### Task 2.4: Authentication Guards & Navigation (45 minutes)

#### Step 1: Enhanced Auth Context for Eye Do Plan
Update `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AuthService } from '../services/authService';
import { GoogleSignInService } from '../services/googleSignInService';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await AuthService.getCurrentUserData();
          setUser(userData);
          console.log('Eye Do Plan: User authenticated:', userData?.email);
        } catch (error) {
          console.error('Eye Do Plan: Error loading user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        console.log('Eye Do Plan: User signed out');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userData = await AuthService.signIn(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Eye Do Plan: Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userData = await AuthService.signUp(email, password, displayName);
      setUser(userData);
    } catch (error) {
      console.error('Eye Do Plan: Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userData = await GoogleSignInService.signIn();
      setUser(userData);
    } catch (error) {
      console.error('Eye Do Plan: Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Eye Do Plan: Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### Step 2: Authentication Guard Hook
Create `src/hooks/useAuthGuard.ts`:

```typescript
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function useAuthGuard() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      console.log('Eye Do Plan: Redirecting to login - user not authenticated');
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}

export function useGuestGuard() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      console.log('Eye Do Plan: Redirecting to dashboard - user already authenticated');
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  return {
    user,
    loading,
    isGuest: !user,
  };
}
```

#### Step 3: Update Tab Layout with Auth Guard
Update `app/(tabs)/_layout.tsx`:

```typescript
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';
import { styles } from '../../src/utils/styles';

export default function TabLayout() {
  const theme = useTheme();
  const { loading, isAuthenticated } = useAuthGuard();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitle: 'Eye Do Plan',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="timeline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Task 2.5: Android-Specific Testing & Debugging (45 minutes)

#### Step 1: Android Development Build Commands
Create build scripts for local development:

```bash
# Build for Android emulator (debug)
npx expo run:android

# Build for Android device (debug)
npx expo run:android --device

# Clear cache and rebuild
npx expo start --clear
npx expo run:android

# Check Android build logs
npx expo run:android --verbose
```

#### Step 2: Android-Specific Error Handling
Create `src/utils/androidErrorHandler.ts`:

```typescript
import { Platform, Alert } from 'react-native';

export class AndroidErrorHandler {
  static handleGoogleSignInError(error: any): string {
    if (Platform.OS !== 'android') {
      return error.message || 'An error occurred';
    }

    // Android-specific Google Sign-In error handling
    switch (error.code) {
      case 'SIGN_IN_CANCELLED':
        return 'Google Sign-In was cancelled';
      case 'IN_PROGRESS':
        return 'Google Sign-In is already in progress';
      case 'PLAY_SERVICES_NOT_AVAILABLE':
        return 'Google Play Services is not available on this device';
      case 'SIGN_IN_REQUIRED':
        return 'Please sign in to continue';
      default:
        console.error('Eye Do Plan Android: Google Sign-In error:', error);
        return 'Failed to sign in with Google. Please try again.';
    }
  }

  static handleCameraError(error: any): string {
    if (Platform.OS !== 'android') {
      return error.message || 'Camera error occurred';
    }

    // Android-specific camera error handling
    if (error.message?.includes('permission')) {
      return 'Camera permission is required. Please enable it in device settings.';
    }
    
    if (error.message?.includes('not available')) {
      return 'Camera is not available on this device.';
    }

    return 'Failed to access camera. Please try again.';
  }

  static showAndroidAlert(title: string, message: string, actions?: any[]) {
    if (Platform.OS === 'android') {
      Alert.alert(`Eye Do Plan - ${title}`, message, actions);
    } else {
      Alert.alert(title, message, actions);
    }
  }
}
```

#### Step 3: Android Emulator Testing Checklist
Create testing script for Android emulator:

```bash
#!/bin/bash
# android-test.sh - Eye Do Plan Android Testing Script

echo "🎯 Eye Do Plan - Android Emulator Testing"
echo "=========================================="

# Check if emulator is running
echo "📱 Checking Android emulator status..."
adb devices

# Build and install app
echo "🔨 Building Eye Do Plan for Android..."
npx expo run:android

# Test deep linking
echo "🔗 Testing deep linking..."
sleep 5
adb shell am start -W -a android.intent.action.VIEW -d "eyedoplan://test" com.morlove.eyedoplan

# Check app logs
echo "📋 Checking app logs..."
adb logcat -s ReactNativeJS:V

echo "✅ Android testing complete!"
```

### Task 2.6: GitHub Integration & Version Control (30 minutes)

#### Step 1: Commit Day 2 Changes
```bash
# Add all Day 2 changes
git add .

# Commit with detailed message
git commit -m "feat: Complete Eye Do Plan authentication system for Android

- Implement Google Sign-In with local development build
- Add comprehensive user profile management
- Create authentication guards and protected routes
- Add Android-specific error handling
- Enhance UI with Eye Do Plan branding
- Add profile image upload functionality
- Implement proper session management
- Add deep linking support for authentication flows

Features completed:
- Email/password authentication
- Google Sign-In integration
- User profile CRUD operations
- Image upload to Firebase Storage
- Authentication state management
- Android emulator compatibility
- Error handling and user feedback

Tested on: Android emulator API 33"

# Push to GitHub
git push origin main
```

#### Step 2: Create Development Branch for Features
```bash
# Create feature branch for Day 3 work
git checkout -b feature/ui-components-day3

# Push feature branch
git push -u origin feature/ui-components-day3

# Switch back to main
git checkout main
```

## Day 2 Testing Protocol

### Android Emulator Testing Checklist

#### Authentication Testing
- [ ] **Email Registration**
  - [ ] Create new account with valid email
  - [ ] Verify email validation works
  - [ ] Check password strength requirements
  - [ ] Test duplicate email handling

- [ ] **Email Login**
  - [ ] Sign in with valid credentials
  - [ ] Test invalid email/password combinations
  - [ ] Verify "Remember me" functionality
  - [ ] Test password reset flow

- [ ] **Google Sign-In (Local Build)**
  - [ ] Google Sign-In button appears and is clickable
  - [ ] Google account picker opens correctly
  - [ ] Account selection completes authentication
  - [ ] User profile data is properly imported
  - [ ] Subsequent logins work without re-authentication

#### Profile Management Testing
- [ ] **Profile Display**
  - [ ] User information displays correctly
  - [ ] Profile image loads properly
  - [ ] Eye Do Plan branding is consistent

- [ ] **Profile Editing**
  - [ ] All form fields are editable
  - [ ] Data validation works correctly
  - [ ] Save functionality updates database
  - [ ] Changes persist after app restart

- [ ] **Image Upload**
  - [ ] Camera permission request works
  - [ ] Image picker opens correctly
  - [ ] Image upload completes successfully
  - [ ] Profile image updates in UI

#### Navigation & Security Testing
- [ ] **Authentication Guards**
  - [ ] Unauthenticated users redirect to login
  - [ ] Authenticated users access protected routes
  - [ ] Sign out properly clears session
  - [ ] Deep links respect authentication state

- [ ] **Android-Specific Features**
  - [ ] App installs correctly on emulator
  - [ ] No crashes during normal usage
  - [ ] Back button behavior is correct
  - [ ] Deep linking works with ADB commands

### Manual Testing Commands

```bash
# Test authentication flow
npx expo run:android

# Test deep linking after authentication
adb shell am start -W -a android.intent.action.VIEW -d "eyedoplan://profile" com.morlove.eyedoplan

# Test Google Sign-In (requires development build)
# 1. Open app on emulator
# 2. Tap "Continue with Google"
# 3. Select Google account
# 4. Verify profile creation

# Check Firebase connection
# 1. Create account with email
# 2. Check Firebase Console for new user
# 3. Verify Firestore document creation

# Test image upload
# 1. Go to Profile tab
# 2. Tap "Change Photo"
# 3. Select image from gallery
# 4. Verify upload to Firebase Storage
```

### Performance Testing

```bash
# Monitor app performance
adb shell dumpsys meminfo com.morlove.eyedoplan

# Check bundle size
npx expo export --dump-assetmap

# Test app startup time
adb shell am start -W com.morlove.eyedoplan/.MainActivity
```

## Day 2 Deliverables Checklist

### Core Authentication Features
- [ ] ✅ Email/password registration and login
- [ ] ✅ Google Sign-In with local development build
- [ ] ✅ Password reset functionality
- [ ] ✅ User session management
- [ ] ✅ Authentication state persistence

### User Profile Management
- [ ] ✅ Complete profile editing interface
- [ ] ✅ Profile image upload to Firebase Storage
- [ ] ✅ Eye Do Plan specific user fields
- [ ] ✅ Data validation and error handling
- [ ] ✅ Profile data persistence

### Security & Navigation
- [ ] ✅ Authentication guards for protected routes
- [ ] ✅ Automatic navigation based on auth state
- [ ] ✅ Secure sign out with session cleanup
- [ ] ✅ Deep linking with authentication checks

### Android Compatibility
- [ ] ✅ Local development build configuration
- [ ] ✅ Android emulator testing
- [ ] ✅ Android-specific error handling
- [ ] ✅ Google Play Services integration
- [ ] ✅ Camera and storage permissions

### Code Quality
- [ ] ✅ TypeScript types for all components
- [ ] ✅ Comprehensive error handling
- [ ] ✅ Consistent Eye Do Plan branding
- [ ] ✅ Clean code structure and organization
- [ ] ✅ Git version control with meaningful commits

## Troubleshooting Guide

### Common Android Issues

#### Google Sign-In Not Working
**Problem**: Google Sign-In button doesn't respond or fails
**Solutions**:
1. Ensure you're using a development build, not Expo Go
2. Verify Google Sign-In configuration in Firebase Console
3. Check SHA-1 fingerprint matches your development keystore
4. Confirm Google Play Services is available on emulator

#### Profile Image Upload Fails
**Problem**: Image upload to Firebase Storage fails
**Solutions**:
1. Check Firebase Storage rules allow authenticated uploads
2. Verify internet connection on emulator
3. Ensure proper permissions for camera/gallery access
4. Check Firebase Storage bucket configuration

#### Authentication State Issues
**Problem**: User authentication state not persisting
**Solutions**:
1. Verify AsyncStorage is properly configured
2. Check Firebase Auth persistence settings
3. Ensure proper error handling in auth context
4. Clear app data and test fresh installation

#### Deep Linking Not Working
**Problem**: Deep links don't open the app or navigate correctly
**Solutions**:
1. Verify scheme "eyedoplan" is properly configured
2. Test with ADB command after app installation
3. Check Android manifest generation
4. Ensure authentication guards allow deep link navigation

### Development Build Issues

#### Build Fails on Android
**Problem**: `npx expo run:android` fails
**Solutions**:
1. Check Android SDK and build tools are installed
2. Verify ANDROID_HOME environment variable
3. Clean project: `cd android && ./gradlew clean`
4. Update Expo CLI: `npm install -g @expo/cli@latest`

#### Emulator Connection Issues
**Problem**: App doesn't install on emulator
**Solutions**:
1. Restart Android emulator
2. Check emulator is running: `adb devices`
3. Clear Metro cache: `npx expo start --clear`
4. Restart Metro bundler

## Next Steps for Day 3

### Preparation for UI Components Development
1. **Component Library Planning**
   - Review Eye Do Plan design system
   - Plan reusable component architecture
   - Prepare component documentation structure

2. **Project Management Foundation**
   - Design project data models
   - Plan project CRUD operations
   - Prepare project navigation structure

3. **Testing Strategy**
   - Set up component testing framework
   - Plan integration testing approach
   - Prepare automated testing scripts

### Day 3 Preview
- Create comprehensive UI component library
- Implement project management system
- Build project dashboard and navigation
- Add project CRUD operations
- Enhance overall app architecture

## Success Metrics for Day 2

### Functional Requirements ✅
- Complete authentication system working on Android emulator
- Google Sign-In functional with local development build
- User profile management with image upload
- Authentication guards protecting routes
- Proper error handling and user feedback

### Technical Requirements ✅
- TypeScript implementation with proper types
- Firebase integration with Firestore and Storage
- Android-specific optimizations and error handling
- Git version control with meaningful commits
- Clean, maintainable code structure

### User Experience ✅
- Consistent Eye Do Plan branding throughout
- Intuitive navigation and user flows
- Responsive design for various screen sizes
- Professional UI with Material Design components
- Smooth performance on Android emulator

**Day 2 Status: ✅ COMPLETE**
Ready to proceed with Day 3 UI Components and Project Management development!

