import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ProjectProvider } from '../contexts/ProjectContext';

const InitialLayout = () => {
  const { user, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && !inAuthGroup) {
      router.replace('/(app)/projects');
    } else if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, initialized, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

const RootLayout = () => {
  return (
    // Wrap the entire app in GestureHandlerRootView for gesture support
    <GestureHandlerRootView style={{ flex: 1 }}>
        {/* **FIXED**: PaperProvider must wrap everything for dropdowns and other components to work correctly */}
        <PaperProvider>
            <AuthProvider>
                <ProjectProvider>
                    <InitialLayout />
                </ProjectProvider>
            </AuthProvider>
        </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;

// // # Root layout
// // Authentication check and global providers
// // - SplashScreen management
// // - Authentication state provider
// // - Theme provider
// // - Navigation container


// // ===== ROOT LAYOUT =====
// // app/_layout.tsx
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect } from 'react';
// import { useColorScheme } from 'react-native';
// import { PaperProvider } from 'react-native-paper';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { enGB, registerTranslation } from 'react-native-paper-dates';
// import { darkTheme, lightTheme } from '../constants/theme';
// import { fontAssets } from '../constants/typography';
// import { AuthProvider, useAuth } from '../contexts/AuthContext';

// // Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// function RootLayoutNav() {
//   const { user, loading } = useAuth();
//   const colorScheme = useColorScheme();
//   const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

//   // Register the English locale for react-native-paper-dates
//   useEffect(() => {
//     registerTranslation('en', enGB);
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       SplashScreen.hideAsync();
//     }
//   }, [loading]);

//   if (loading) {
//     return null;
//   }

//   return (
//     // <SafeAreaProvider>
//       <PaperProvider theme={theme}>
//         <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
//         <Stack screenOptions={{ headerShown: false }}>
//           {!user ? (
//             <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//           ) : (
//             <Stack.Screen name="(app)" options={{ headerShown: false }} />
//           )}
//         </Stack>
//       </PaperProvider>
//     // </SafeAreaProvider>
//   );
// }

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts(fontAssets);

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <AuthProvider>
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }

// NEW STRUCTURE BASE
// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import { AuthProvider, useAuth } from '../hooks/useAuth';
// import { StatusBar } from 'expo-status-bar';

// // Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// function RootLayoutNav() {
//   const { isAuthenticated, isLoading } = useAuth();

//   useEffect(() => {
//     if (!isLoading) {
//       SplashScreen.hideAsync();
//     }
//   }, [isLoading]);

//   if (isLoading) {
//     return null;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {!isAuthenticated ? (
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//       ) : (
//         <Stack.Screen name="(app)" options={{ headerShown: false }} />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     // Add your custom fonts here
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <AuthProvider>
//       <StatusBar style="auto" />
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }


