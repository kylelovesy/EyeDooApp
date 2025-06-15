// # Main app group (protected routes)
// # Main app layout
// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: theme.colors.background 
        }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="events" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </SafeAreaView>
  );
}