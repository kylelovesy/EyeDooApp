// # 2.0 Authentication Group
// # Auth stack layout
// - Header: hidden or minimal
// - Screens: login, register, reset-password
// - Transition: slide animation


import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
    const theme = useTheme();
  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="reset-password" />
    </Stack>
    </SafeAreaView>
  );
}