# Day 1: Project Foundation & Core Setup - Updated Instructions
## Eye Do Plan - Wedding Photographer's Assistant App

## Overview
Day 1 focuses on establishing the project foundation with Expo, setting up navigation, Firebase configuration, and creating basic UI components. This guide is updated for local development builds, Android emulator testing, and GitHub integration.

## Prerequisites
- Node.js 18.0.0+
- Expo CLI installed: `npm install -g @expo/cli`
- Android Studio with Android SDK and emulator setup
- Git installed and configured
- GitHub account and repository access

## Step-by-Step Implementation

### Task 1.1: Project Initialization (45 minutes)

#### Step 1: Create Expo Project
```bash
# Create new Expo project with TypeScript
npx create-expo-app EyeDoPlan --template typescript
cd EyeDoPlan

# Initialize git repository and connect to GitHub
git init
git add .
git commit -m "Initial commit: Eye Do Plan Expo project setup"

# Add your GitHub repository as remote
git remote add origin https://github.com/kylelovesy/ManusEyeDo.git
git branch -M main
git push -u origin main
```

#### Step 2: Install Dependencies
Copy the provided `expo-package.json` to `package.json` and install:
```bash
npm install

# Install additional dependencies for local development
npm install --save-dev @types/react @types/react-native
```

#### Step 3: Project Structure Setup
```bash
# Create folder structure
mkdir -p src/{components,screens,services,types,utils,contexts}
mkdir -p src/components/{ui,forms,navigation}
mkdir -p src/screens/{auth,dashboard,projects,questionnaire,timeline}
mkdir -p assets/{images,icons,fonts}

# Create initial files
touch src/types/index.ts
touch src/utils/theme.ts
touch src/utils/styles.ts
touch src/services/firebase.ts
```

#### Step 4: Configure TypeScript
Create `src/types/index.ts`:
```typescript
// Global type definitions for Eye Do Plan
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### Task 1.2: App Configuration with Deep Linking (45 minutes)

#### Step 1: Configure app.json for Eye Do Plan
Update `app.json`:
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
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
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
          "iosUrlScheme": "com.morlove.eyedoplan"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Eye Do Plan needs access to your photos to upload images.",
          "cameraPermission": "Eye Do Plan needs access to your camera to take photos."
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

#### Step 2: Create Root Layout with Deep Linking
Create `app/_layout.tsx`:
```typescript
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/contexts/AuthContext';
import { theme } from '../src/utils/theme';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

#### Step 3: Create Tab Layout
Create `app/(tabs)/_layout.tsx`:
```typescript
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

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

#### Step 4: Create Dashboard Screen
Create `app/(tabs)/index.tsx`:
```typescript
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/utils/styles';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to Eye Do Plan, {user?.displayName || 'Photographer'}!
        </Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Quick Actions</Text>
            <Text variant="bodyMedium" style={{ marginVertical: 8 }}>
              Streamline your wedding photography workflow
            </Text>
            <View style={styles.buttonContainer}>
              <Button mode="contained" style={styles.button}>
                New Project
              </Button>
              <Button mode="outlined" style={styles.button}>
                View Timeline
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Recent Projects</Text>
            <Text variant="bodyMedium" style={styles.placeholder}>
              No projects yet. Create your first wedding project to get started!
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Eye Do Plan Features</Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              • Project Management{'\n'}
              • Timeline Planning{'\n'}
              • Shot Checklists{'\n'}
              • Client Questionnaires{'\n'}
              • Venue Information
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Task 1.3: UI Foundation & Theme (30 minutes)

#### Step 1: Create Eye Do Plan Theme
Create `src/utils/theme.ts`:
```typescript
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const eyeDoPlanColors = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...eyeDoPlanColors,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    background: '#1C1B1F',
    surface: '#1C1B1F',
    // ... add other dark theme colors as needed
  },
};
```

#### Step 2: Create Global Styles
Create `src/utils/styles.ts`:
```typescript
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFE',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#6750A4',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    color: '#49454F',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#BA1A1A',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
});
```

#### Step 3: Create Base Components
Create `src/components/ui/Screen.tsx`:
```typescript
import React from 'react';
import { View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../utils/styles';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, scrollable = false, style }: ScreenProps) {
  const Container = scrollable ? ScrollView : View;
  
  return (
    <SafeAreaView style={[styles.container, style]}>
      <Container style={styles.content}>
        {children}
      </Container>
    </SafeAreaView>
  );
}
```

### Task 1.4: Firebase Configuration (45 minutes)

#### Step 1: Create Environment Configuration
Create `.env` file in project root:
```env
# Firebase Configuration for Eye Do Plan
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sign-In Configuration
EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_GOOGLE_SIGNIN_ANDROID_CLIENT_ID=your_android_client_id
```

#### Step 2: Create Firebase Configuration
Create `src/services/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration for Eye Do Plan
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export { auth };
export default app;
```

### Task 1.5: Local Development Build Setup (45 minutes)

#### Step 1: Configure for Local Development
Create `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

module.exports = config;
```

#### Step 2: Android Emulator Setup
```bash
# Check Android SDK installation
npx expo doctor

# Start Android emulator (make sure you have one created in Android Studio)
# You can start it from Android Studio or command line:
emulator -avd YOUR_AVD_NAME

# Build and run on Android emulator
npx expo run:android
```

#### Step 3: Create Development Scripts
Update `package.json` scripts section:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "type-check": "tsc --noEmit",
    "build:android": "expo run:android --variant release",
    "clean": "expo start --clear"
  }
}
```

### Task 1.6: GitHub Integration & Version Control (30 minutes)

#### Step 1: Create .gitignore
Create `.gitignore`:
```gitignore
# Eye Do Plan - Git Ignore

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
dist/
web-build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# Android
android/app/build/
android/build/
android/gradle/
android/gradlew
android/gradlew.bat
android/local.properties

# iOS
ios/build/
ios/Pods/
ios/*.xcworkspace
ios/*.xcuserdata
```

#### Step 2: Create README for Eye Do Plan
Create `README.md`:
```markdown
# Eye Do Plan - Wedding Photographer's Assistant App

A comprehensive mobile application designed to streamline wedding photography workflows, built with React Native and Expo.

## Company
**morlove** - Innovative solutions for creative professionals

## Features
- Project Management
- Timeline Planning
- Shot Checklists
- Client Questionnaires
- Venue Information Management
- Firebase Authentication
- Google Sign-In Integration

## Tech Stack
- React Native with Expo SDK 53
- TypeScript
- Firebase (Auth, Firestore, Storage)
- React Native Paper (Material Design)
- Expo Router for Navigation

## Development Setup

### Prerequisites
- Node.js 18.0.0+
- Android Studio with Android SDK
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/kylelovesy/ManusEyeDo.git
cd ManusEyeDo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm start

# Run on Android emulator
npm run android
```

### Environment Variables
Create a `.env` file with your Firebase configuration:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## Deep Linking
The app supports deep linking with the scheme: `eyedoplan://`

Example: `eyedoplan://project/123` opens project with ID 123

## Development Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License
© 2024 morlove. All rights reserved.
```

#### Step 3: Commit and Push Initial Setup
```bash
# Add all files
git add .

# Commit initial setup
git commit -m "feat: Initial Eye Do Plan setup with local development build configuration

- Configure app for morlove company
- Set up deep linking scheme (eyedoplan://)
- Configure Android emulator development
- Add Firebase integration
- Set up project structure and navigation
- Add Eye Do Plan branding and theme"

# Push to GitHub
git push origin main
```

## Day 1 Testing Checklist

### Local Development Testing
1. **Project Setup**
   - [ ] Project runs with `npm start`
   - [ ] Android emulator connects successfully
   - [ ] No compilation errors
   - [ ] TypeScript types are working

2. **Android Emulator Testing**
   - [ ] App builds and installs on Android emulator
   - [ ] Navigation works between tabs
   - [ ] UI renders correctly on Android
   - [ ] Deep linking scheme is registered

3. **Firebase Connection**
   - [ ] Firebase configuration loads without errors
   - [ ] No console errors related to Firebase
   - [ ] Environment variables are properly loaded

4. **GitHub Integration**
   - [ ] Repository is properly connected
   - [ ] All files are committed and pushed
   - [ ] .gitignore excludes sensitive files

### Manual Testing Commands
```bash
# Test Android build
npm run android

# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Test deep linking (after app is running)
adb shell am start -W -a android.intent.action.VIEW -d "eyedoplan://test" com.morlove.eyedoplan
```

## Day 1 Deliverables Checklist

- [ ] ✅ Expo project initialized with Eye Do Plan branding
- [ ] ✅ Local development build configuration
- [ ] ✅ Android emulator setup and testing
- [ ] ✅ Deep linking scheme (eyedoplan://) configured
- [ ] ✅ GitHub repository connected and synced
- [ ] ✅ Firebase services configured for morlove
- [ ] ✅ Project structure with proper folders
- [ ] ✅ Navigation setup with Expo Router
- [ ] ✅ Eye Do Plan theme and styling
- [ ] ✅ Development environment with proper scripts

## Troubleshooting Common Issues

### Android Emulator Issues
**Problem**: Emulator not starting or connecting
**Solution**: 
1. Check Android Studio AVD Manager
2. Ensure emulator is running before `npm run android`
3. Check Android SDK path in environment variables

### Metro Bundler Issues
**Problem**: Metro bundler errors or cache issues
**Solution**: 
```bash
npm run clean
# or
npx expo start --clear
```

### Deep Linking Issues
**Problem**: Deep links not working
**Solution**: 
1. Verify scheme in app.json matches "eyedoplan"
2. Test with ADB command after app installation
3. Check Android manifest generation

### GitHub Connection Issues
**Problem**: Cannot push to repository
**Solution**: 
1. Verify GitHub repository URL
2. Check authentication (token or SSH key)
3. Ensure repository exists and you have write access

## Next Steps for Day 2
- Implement Google Sign-In with local development build
- Add user profile management
- Create authentication guards
- Enhance error handling for Android-specific issues
- Test all features on Android emulator

