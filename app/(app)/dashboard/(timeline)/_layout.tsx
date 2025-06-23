// # 4.2 Timeline Tab
// # Timeline secondary tabs layout
// app/(app)/dashboard/(timeline)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const timelineSubPages: SubPage[] = [
  { id: 'index', title: 'Timeline', iconName: 'timeline-clock-outline', route: '/(app)/dashboard/(timeline)' },
  { id: 'notifications', title: 'Notifications', iconName: 'bell-outline', route: '/(app)/dashboard/(timeline)/notifications' },
  { id: 'edit', title: 'Update', iconName: 'clock-edit-outline', route: '/(app)/dashboard/(timeline)/edit' },
];

export default function TimelineLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}
