import { Stack } from 'expo-router';
import { FormProviders } from '../../contexts/ProviderWrappers';

// export default function AppLayout() {
//   const theme = useTheme();
//   return (
//     <FormProviders.All>
//       <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
//         <Stack 
//         screenOptions={{ 
//           headerShown: false,
//           animation: 'slide_from_right',
//         }}>
//           {/* <Stack.Screen name="theming" /> */}
//           <Stack.Screen name="projects" />
//           <Stack.Screen name="dashboard" />          
//         </Stack>
//       </SafeAreaView>
//     </FormProviders.All>
//   );
// }
export default function AppLayout() {
  // const theme = useTheme();
  return (
    <FormProviders.All>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}> */}
        <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}>
          <Stack.Screen name="setup" />
          {/* <Stack.Screen name="theming" /> */}
          <Stack.Screen name="projects" />
          <Stack.Screen name="dashboard" />          
        </Stack>
      {/* </SafeAreaView> */}
    </FormProviders.All>
  );
}


// // # Main app group (protected routes)
// // # Main app layout
// // app/(app)/_layout.tsx
// import { Stack } from 'expo-router';
// // import { useColorScheme } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { darkTheme, lightTheme } from '../../constants/theme';
// // import { ProjectProvider } from '../../contexts/ProjectContext';
// import { ProjectFormProvider } from '../../contexts/Form1EssentialInfoContext';
// import { ProjectProvider } from '../../contexts/ProjectContext';


// export default function AppLayout() {
//   // const colorScheme = useColorScheme();
//   // const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
//   return (
//     <ProjectProvider>
//       <ProjectFormProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="projects" />
//           <Stack.Screen name="dashboard" />
//         </Stack>
//       </ProjectFormProvider>
//     </ProjectProvider>
//     // <ProjectProvider>
//     //   <SafeAreaView style={{ 
//     //     flex: 1, 
//     //     backgroundColor: theme.colors.primary 
//     //     }}>
//     //   <Stack
//     //     screenOptions={{
//     //       headerShown: false,
//     //       contentStyle: { backgroundColor: theme.colors.primary },
//     //     }}
//     //   >
//     //     <Stack.Screen name="projects" />
//     //     <Stack.Screen name="dashboard" />
//     //   </Stack>
//     // </SafeAreaView>
//     // </ProjectProvider>
    
//   );
// }