// # Root layout
// Authentication check and global providers
// - SplashScreen management
// - Authentication state provider
// - Theme provider
// - Navigation container


// ===== ROOT LAYOUT =====
// app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '../constants/theme';
import { fontAssets } from '../constants/typography';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    // <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          )}
        </Stack>
      </PaperProvider>
    // </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

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


