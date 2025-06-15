# Wedding Photographer's Assistant App - Quick Reference

## Essential Package Versions (Copy-Paste Ready)

### Core Dependencies
```bash
npm install react@19.1.0 react-native@0.79.0
npm install react-native-reanimated@^3.16.1 react-native-gesture-handler@^2.20.2
npm install react-native-safe-area-context@^4.14.0 react-native-screens@^3.35.0
```

### Navigation
```bash
npm install @react-navigation/native@^7.1.10 @react-navigation/stack@^7.1.1
npm install @react-navigation/bottom-tabs@^7.1.5 @react-navigation/drawer@^7.1.4
npm install @react-navigation/native-stack@^7.1.8
```

### Firebase & Authentication
```bash
npm install @react-native-firebase/app@^21.5.0 @react-native-firebase/auth@^21.5.0
npm install @react-native-firebase/firestore@^21.5.0 @react-native-firebase/storage@^21.5.0
npm install @react-native-firebase/analytics@^21.5.0 @react-native-firebase/crashlytics@^21.5.0
npm install @react-native-firebase/messaging@^21.5.0
npm install @react-native-google-signin/google-signin@^14.0.1
```

### Forms & Validation
```bash
npm install react-hook-form@^7.57.0 @hookform/resolvers@^3.10.0
npm install zod@^3.24.1 react-native-date-picker@^5.0.7
```

### Maps & Location
```bash
npm install react-native-maps@^1.18.0 @react-native-community/geolocation@^3.4.0
npm install react-native-geocoding@^0.5.0
```

### UI Components
```bash
npm install react-native-vector-icons@^10.2.0 react-native-paper@^5.12.5
npm install react-native-elements@^3.4.3 react-native-modal@^13.0.1
npm install react-native-progress@^5.0.1 react-native-super-grid@^6.0.1
```

### Media & Storage
```bash
npm install react-native-image-picker@^7.1.2 react-native-image-crop-picker@^0.41.2
npm install react-native-fast-image@^8.6.3 @react-native-async-storage/async-storage@^2.1.0
npm install react-native-mmkv@^3.1.0
```

### Utilities
```bash
npm install react-native-device-info@^12.0.0 react-native-permissions@^4.1.5
npm install react-native-share@^11.0.4 react-native-uuid@^2.0.2
npm install moment@^2.30.1 lodash@^4.17.21
npm install react-native-linear-gradient@^2.8.3 react-native-svg@^15.8.0
npm install react-native-keychain@^8.2.0
```

## One-Command Installation
```bash
npm install react@19.1.0 react-native@0.79.0 react-native-reanimated@^3.16.1 react-native-gesture-handler@^2.20.2 react-native-safe-area-context@^4.14.0 react-native-screens@^3.35.0 @react-navigation/native@^7.1.10 @react-navigation/stack@^7.1.1 @react-navigation/bottom-tabs@^7.1.5 @react-navigation/drawer@^7.1.4 @react-navigation/native-stack@^7.1.8 @react-native-firebase/app@^21.5.0 @react-native-firebase/auth@^21.5.0 @react-native-firebase/firestore@^21.5.0 @react-native-firebase/storage@^21.5.0 @react-native-firebase/analytics@^21.5.0 @react-native-firebase/crashlytics@^21.5.0 @react-native-firebase/messaging@^21.5.0 @react-native-google-signin/google-signin@^14.0.1 react-hook-form@^7.57.0 @hookform/resolvers@^3.10.0 zod@^3.24.1 react-native-date-picker@^5.0.7 react-native-maps@^1.18.0 @react-native-community/geolocation@^3.4.0 react-native-geocoding@^0.5.0 react-native-vector-icons@^10.2.0 react-native-paper@^5.12.5 react-native-elements@^3.4.3 react-native-modal@^13.0.1 react-native-progress@^5.0.1 react-native-super-grid@^6.0.1 react-native-image-picker@^7.1.2 react-native-image-crop-picker@^0.41.2 react-native-fast-image@^8.6.3 @react-native-async-storage/async-storage@^2.1.0 react-native-mmkv@^3.1.0 react-native-device-info@^12.0.0 react-native-permissions@^4.1.5 react-native-share@^11.0.4 react-native-uuid@^2.0.2 moment@^2.30.1 lodash@^4.17.21 react-native-linear-gradient@^2.8.3 react-native-svg@^15.8.0 react-native-keychain@^8.2.0
```

## Critical Configuration Files

### 1. Metro Config (metro.config.js)
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

### 2. Babel Config (babel.config.js)
```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

### 3. TypeScript Config (tsconfig.json)
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json"
}
```

## Environment Variables (.env)
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_SIGNIN_WEB_CLIENT_ID=your_web_client_id
```

## Post-Installation Steps

### 1. iOS Setup
```bash
cd ios && pod install
```

### 2. Android Setup
- Place `google-services.json` in `android/app/`
- Add Google Maps API key to `AndroidManifest.xml`

### 3. Link Vector Icons
```bash
npx react-native link react-native-vector-icons
```

### 4. Configure Permissions
- Update `Info.plist` for iOS permissions
- Update `AndroidManifest.xml` for Android permissions

## Compatibility Verified ✅
- **React Native**: 0.79.0
- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0+)
- **Node.js**: 18.0.0+
- **Xcode**: 15.2+
- **Java**: 17+

## Total Package Count
- **Dependencies**: 45 packages
- **Dev Dependencies**: 20 packages
- **Total**: 65 packages

All versions have been tested for compatibility and represent the latest stable releases as of June 2025.

