// app/_layout.tsx
// Example of app/_layout.tsx (simplified for focus on splash and auth)
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '../constants/theme';
import { fontAssets } from '../constants/typography';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
      async function loadFonts() {
        try {
          await Font.loadAsync(fontAssets);
          setFontsLoaded(true);
        } catch (error) {
          console.warn('Error loading fonts:', error);
          setFontsLoaded(true); // Continue without custom fonts
        } finally {
          await SplashScreen.hideAsync();
        }
      }
  
      loadFonts();
    }, []);
  
    if (!fontsLoaded) {
      return null;
    }
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(projects)" options={{ headerShown: false }} />
            <Stack.Screen name="(questionnaire)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Add other top-level routes like (projects), (questionnaire), (vendors) here */}
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
// import * as Font from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect } from 'react';
// import { PaperProvider } from 'react-native-paper';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { lightTheme } from '../constants/theme';
// import { fontAssets } from '../constants/typography';
// import { AuthProvider } from '../contexts/AuthContext';
// import { ProjectProvider } from '../contexts/ProjectContext';

// // Prevent the splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [fontsLoaded, setFontsLoaded] = React.useState(false);

//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync(fontAssets);
//         setFontsLoaded(true);
//       } catch (error) {
//         console.warn('Error loading fonts:', error);
//         setFontsLoaded(true); // Continue without custom fonts
//       } finally {
//         await SplashScreen.hideAsync();
//       }
//     }

//     loadFonts();
//   }, []);

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <SafeAreaProvider>
//       <PaperProvider theme={lightTheme}>
//         <AuthProvider>
//           <ProjectProvider>
//             <StatusBar style="auto" />
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//               <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//               <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
//             </Stack>
//           </ProjectProvider>
//         </AuthProvider>
//       </PaperProvider>
//     </SafeAreaProvider>
//   );
// }