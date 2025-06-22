// # 3.0 Events
// Stack navigation for event management
// - Header: "Events" 
// - Modal presentation for questionnaires

// app/(app)/events/_layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProjectsLayout() {
  const theme = useTheme();
  const { signOut } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      // screenOptions={{
      //   headerStyle: {
      //     backgroundColor: theme.colors.background,
      //   },
      //   headerTintColor: theme.colors.onSurface,
      //   headerTitleStyle: {
      //     ...typography.headlineMedium,
      //     color: theme.colors.onSurface,
      //   },
      // }}
    >
      <Stack.Screen
        name="index"
        // options={{
        //   title: 'My Projects',
        //   headerLargeTitle: true,
        //   headerTitleStyle: {
        //     ...typography.headlineMedium,
        //     color: theme.colors.onSurface,
        //   },
        //   headerRight: () => (
        //     <CustomButton
        //       title="Sign Out"
        //       variant="text"
        //       onPress={signOut}
        //     />
        //   ),
        // }}
      />      
    </Stack>
  );
}