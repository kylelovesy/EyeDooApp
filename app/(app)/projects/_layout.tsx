// # 3.0 Events
// Stack navigation for event management
// - Header: "Events" 
// - Modal presentation for questionnaires

// app/(app)/events/_layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { typography } from '../../../constants/typography';

export default function EventsLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          ...typography.headlineLarge,
          color: theme.colors.onSurface,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Events',
          headerLargeTitle: true,
          headerTitleStyle: {
            ...typography.headlineLarge,
            color: theme.colors.onSurface,
          },
        }}
      />
      <Stack.Screen
        name="delete"
        options={{
          title: 'Delete Event',
          presentation: 'modal',
          headerTitleStyle: {
            ...typography.titleMedium,
            color: theme.colors.onSurface,
          },
        }}
      />
    </Stack>
  );
}