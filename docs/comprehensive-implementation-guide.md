# Days 1 & 2 Implementation Guide - Wedding Photographer's Assistant App

## Overview

This comprehensive guide covers the complete implementation of Days 1 and 2 of the Wedding Photographer's Assistant app development. It includes all code samples, step-by-step instructions, testing procedures, and troubleshooting guides.

## Project Architecture

### Technology Stack
- **Framework**: Expo SDK 53 with React Native 0.79
- **Language**: TypeScript
- **Authentication**: Firebase Auth with Google Sign-In
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Navigation**: Expo Router with React Navigation
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Testing**: Jest with React Native Testing Library

### Project Structure
```
WeddingPhotographerAssistant/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Dashboard
│   │   ├── projects.tsx
│   │   ├── timeline.tsx
│   │   └── profile.tsx
│   └── _layout.tsx               # Root layout
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   ├── forms/                # Form components
│   │   └── auth/                 # Auth-specific components
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx
│   ├── services/                 # API and service layers
│   │   ├── firebase.ts
│   │   ├── authService.ts
│   │   ├── profileService.ts
│   │   └── googleSignInService.ts
│   ├── hooks/                    # Custom hooks
│   │   └── useAuthGuard.ts
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts
│   └── utils/                    # Utility functions
│       ├── theme.ts
│       ├── styles.ts
│       └── errorHandler.ts
├── assets/                       # Static assets
└── __tests__/                    # Test files
```

## Complete Implementation Workflow

### Phase 1: Project Foundation (Day 1)

#### 1.1 Environment Setup
```bash
# Install required tools
npm install -g @expo/cli eas-cli

# Create project
npx create-expo-app WeddingPhotographerAssistant --template typescript
cd WeddingPhotographerAssistant

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-paper react-native-vector-icons
npm install firebase @react-native-async-storage/async-storage
npm install @react-native-google-signin/google-signin
npm install expo-image-picker expo-media-library
npm install react-hook-form @hookform/resolvers zod
npm install react-native-safe-area-context react-native-screens
```

#### 1.2 Configuration Files
Essential configuration files that need to be created:

**app.json** - Expo configuration
**eas.json** - EAS Build configuration  
**babel.config.js** - Babel configuration
**metro.config.js** - Metro bundler configuration
**.env** - Environment variables

#### 1.3 Core Services Setup
- Firebase configuration and initialization
- Authentication service with email/password
- Error handling utilities
- Theme and styling system

#### 1.4 Navigation Structure
- Expo Router setup with file-based routing
- Tab navigation for main app sections
- Authentication flow routing
- Protected route implementation

### Phase 2: Authentication System (Day 2)

#### 2.1 Enhanced Authentication
- Google Sign-In integration
- Email verification
- Password reset functionality
- Account deletion
- Re-authentication for sensitive operations

#### 2.2 User Profile Management
- Profile data structure
- Profile editing interface
- Image upload functionality
- Preferences management
- Portfolio management

#### 2.3 Security & Guards
- Authentication guards for protected routes
- Automatic navigation based on auth state
- Session persistence
- Secure token handling

## Key Features Implementation

### Authentication Flow

#### Email/Password Authentication
```typescript
// Sign up flow
const handleSignUp = async (email: string, password: string, displayName: string) => {
  try {
    const userData = await AuthService.signUp(email, password, displayName);
    // User is automatically signed in and redirected
  } catch (error) {
    // Handle and display error
  }
};

// Sign in flow
const handleSignIn = async (email: string, password: string) => {
  try {
    const userData = await AuthService.signIn(email, password);
    // User is redirected to main app
  } catch (error) {
    // Handle and display error
  }
};
```

#### Google Sign-In Integration
```typescript
// Google Sign-In flow (requires development build)
const handleGoogleSignIn = async () => {
  try {
    await GoogleSignInService.configure();
    const userData = await GoogleSignInService.signIn();
    // User is signed in and redirected
  } catch (error) {
    // Handle Google Sign-In specific errors
  }
};
```

### Profile Management

#### Profile Data Structure
```typescript
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  businessName?: string;
  specialties?: string[];
  portfolio?: string[];
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}
```

#### Profile Operations
```typescript
// Update profile
await ProfileService.updateProfile(userId, {
  displayName: 'New Name',
  bio: 'Updated bio',
  location: 'New Location'
});

// Upload profile image
const imageUrl = await ProfileService.uploadProfileImage(userId, imageUri);

// Add portfolio image
const portfolioUrl = await ProfileService.addPortfolioImage(userId, imageUri);
```

### Navigation & Routing

#### Protected Routes
```typescript
// Using authentication guard
function ProtectedScreen() {
  const { user, loading } = useAuthGuard();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <LoginPrompt />;
  
  return <MainContent />;
}
```

#### Navigation State Management
```typescript
// Auth context handles navigation automatically
const AuthContext = createContext({
  user: null,
  signIn: async (email, password) => {
    await AuthService.signIn(email, password);
    router.replace('/(tabs)'); // Auto-redirect
  },
  signOut: async () => {
    await AuthService.signOut();
    router.replace('/(auth)/login'); // Auto-redirect
  }
});
```

## Testing Strategy

### Unit Testing
```typescript
// Service testing
describe('AuthService', () => {
  it('should sign up user successfully', async () => {
    const userData = await AuthService.signUp('test@example.com', 'password123', 'Test User');
    expect(userData.email).toBe('test@example.com');
  });
});

// Component testing
describe('LoginScreen', () => {
  it('should render login form', () => {
    render(<LoginScreen />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });
});
```

### Integration Testing
```typescript
// Auth flow testing
describe('Authentication Flow', () => {
  it('should complete sign up and sign in flow', async () => {
    // Test complete user journey
    await signUp('test@example.com', 'password123');
    await signOut();
    await signIn('test@example.com', 'password123');
    expect(getCurrentUser()).toBeTruthy();
  });
});
```

### Manual Testing Checklist

#### Day 1 Testing
- [ ] Project builds and runs without errors
- [ ] Navigation between tabs works
- [ ] Firebase connection established
- [ ] Basic UI components render correctly
- [ ] Theme is applied consistently

#### Day 2 Testing
- [ ] Email registration and login work
- [ ] Google Sign-In works (development build)
- [ ] Profile management functions correctly
- [ ] Image upload works
- [ ] Password reset email is sent
- [ ] Authentication guards protect routes
- [ ] Error handling displays user-friendly messages

## Performance Optimization

### Code Splitting
```typescript
// Lazy load screens
const ProfileScreen = lazy(() => import('./ProfileScreen'));
const ProjectsScreen = lazy(() => import('./ProjectsScreen'));

// Use Suspense for loading states
<Suspense fallback={<LoadingScreen />}>
  <ProfileScreen />
</Suspense>
```

### Image Optimization
```typescript
// Optimize image uploads
const optimizeImage = async (uri: string) => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulatedImage.uri;
};
```

### Caching Strategy
```typescript
// Cache user data
const cacheUserData = async (userData: User) => {
  await AsyncStorage.setItem('user_cache', JSON.stringify(userData));
};

// Retrieve cached data
const getCachedUserData = async (): Promise<User | null> => {
  const cached = await AsyncStorage.getItem('user_cache');
  return cached ? JSON.parse(cached) : null;
};
```

## Security Best Practices

### Data Validation
```typescript
// Input validation with Zod
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(50),
});

// Validate before processing
const validateUserInput = (data: unknown) => {
  return userSchema.parse(data);
};
```

### Secure Storage
```typescript
// Store sensitive data securely
import * as SecureStore from 'expo-secure-store';

const storeSecureData = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const getSecureData = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};
```

### Firebase Security Rules
```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects are accessible to their owners
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Deployment Preparation

### Environment Configuration
```bash
# Production environment variables
EXPO_PUBLIC_FIREBASE_API_KEY=prod_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=prod_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=prod_project_id
```

### Build Configuration
```json
// eas.json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Firebase security rules updated
- [ ] App icons and splash screens added
- [ ] Privacy policy and terms of service prepared
- [ ] App store metadata ready
- [ ] Testing completed on physical devices

## Troubleshooting Guide

### Common Issues and Solutions

#### Firebase Connection Issues
**Problem**: Firebase not connecting
**Solution**: 
1. Check environment variables
2. Verify Firebase project configuration
3. Ensure internet connectivity
4. Check Firebase console for project status

#### Google Sign-In Not Working
**Problem**: Google Sign-In button not responding
**Solution**:
1. Ensure using development build (not Expo Go)
2. Check Google Sign-In configuration in Firebase
3. Verify client IDs in app.json
4. Test on physical device

#### Navigation Issues
**Problem**: Navigation not working properly
**Solution**:
1. Check Expo Router setup
2. Verify file structure matches routing
3. Ensure authentication guards are properly implemented
4. Check for circular navigation dependencies

#### Image Upload Failures
**Problem**: Profile images not uploading
**Solution**:
1. Check Firebase Storage configuration
2. Verify permissions for camera/media library
3. Ensure proper image format and size
4. Check network connectivity

#### Performance Issues
**Problem**: App running slowly
**Solution**:
1. Optimize image sizes
2. Implement lazy loading
3. Use React.memo for expensive components
4. Profile with Flipper or React DevTools

### Debug Tools and Commands

```bash
# Clear Metro cache
npx expo start --clear

# Run with debugging
npx expo start --dev-client

# Check bundle size
npx expo export --dump-assetmap

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Next Steps and Roadmap

### Day 3 Preparation
- Review Day 1 & 2 implementation
- Ensure all features are working correctly
- Prepare for UI component library development
- Plan project management system architecture

### Week 2 Goals
- Advanced UI components and animations
- Project management with CRUD operations
- Questionnaire system implementation
- Timeline management features
- Offline functionality

### Long-term Roadmap
- Maps integration for venue locations
- Advanced photo management
- Client communication features
- Analytics and reporting
- Multi-language support

This comprehensive guide provides everything needed to successfully implement Days 1 and 2 of the Wedding Photographer's Assistant app. The foundation established here will support all future development phases.

