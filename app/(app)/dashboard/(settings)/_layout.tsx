// # 4.5 Settings Tab
// # Settings secondary tabs layout
// app/(app)/dashboard/(settings)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const settingsSubPages: SubPage[] = [
  { id: 'index', title: 'Account', iconName: 'account-circle', route: '/(app)/dashboard/(settings)' },
  { id: 'calendar', title: 'Calendar', iconName: 'calendar-clock', route: '/(app)/dashboard/(settings)/calendar' },
  { id: 'edit-project', title: 'Edit Project', iconName: 'folder-swap', route: '/(app)/dashboard/(settings)/edit-project' },
  { id: 'settings', title: 'Settings', iconName: 'cog', route: '/(app)/dashboard/(settings)/settings' },
];

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="edit-project" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}