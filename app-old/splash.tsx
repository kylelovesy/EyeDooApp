 // Example of app/splash.tsx
 import { SplashScreen, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

 SplashScreen.preventAutoHideAsync();

 export default function Splash() {
   const { user, loading } = useAuth();
   const router = useRouter();
   const theme = useTheme();

   useEffect(() => {
     if (!loading) {
       // Hide the native splash screen after auth state is determined
       SplashScreen.hideAsync();

       if (user) {
         // User is logged in, navigate to main app (Projects)
         router.replace('/projects'); 
       } else {
         // User is not logged in, navigate to authentication flow
         router.replace('/login');
       }
     }
   }, [loading, user, router]);

   return (
     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
       <ActivityIndicator size="large" color={theme.colors.primary} />
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
 });
// import { router } from 'expo-router';
// import React, { useEffect } from 'react';
// import { View } from 'react-native';
// import { LoadingState } from '../components/ui/LoadingState';
// import { HeadlineText } from '../components/ui/Typography';
// import { spacing } from '../constants/theme';
// import { useAuth } from '../contexts/AuthContext';

// export default function SplashScreen() {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       // Navigate based on authentication status
//       if (user) {
//         router.replace('/(tabs)');
//       } else {
//         router.replace('/(auth)/login');
//       }
//     }
//   }, [user, loading]);

//   return (
//     <View style={{ 
//       flex: 1, 
//       justifyContent: 'center', 
//       alignItems: 'center',
//       backgroundColor: '#66C5CC' // EyeDooApp primary color
//     }}>
//       <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
//         <HeadlineText 
//           size="large" 
//           style={{ color: 'white', marginBottom: spacing.md }}
//         >
//           EyeDooApp
//         </HeadlineText>
//         <LoadingState 
//           message="Loading..." 
//           style={{ backgroundColor: 'transparent' }}
//         />
//       </View>
//     </View>
//   );
// }