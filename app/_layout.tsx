import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { PaperProvider } from 'react-native-paper';
import { enGB, registerTranslation } from 'react-native-paper-dates';
// import { darkTheme, lightTheme } from '../constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fontAssets } from '../constants/typography';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
// import { ThemeProvider } from '../contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

    useEffect(() => {
      registerTranslation('en', enGB);
    }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/(app)/projects');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

const RootLayout = () => {
  const [fontsLoaded] = useFonts(fontAssets);
  // const colorScheme = useColorScheme();
  // const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
   <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
   </GestureHandlerRootView>
  );
};

export default RootLayout;

// return (
//   // Wrap the entire app in GestureHandlerRootView for gesture support
//   <GestureHandlerRootView style={{ flex: 1 }}>
//     {/* <ThemeProvider>
//       <AuthProvider>
//         <InitialLayout />
//       </AuthProvider>
//     </ThemeProvider> */}
//     <PaperProvider theme={theme}>
//       <AuthProvider>
//         <InitialLayout />
//       </AuthProvider>
//     </PaperProvider>
//   </GestureHandlerRootView>
// );


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


