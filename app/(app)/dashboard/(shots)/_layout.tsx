// # 4.3 Shots Tab
// # Shots secondary tabs layout
// app/(app)/dashboard/(shots)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const shotsSubPages: SubPage[] = [
  { id: 'index', title: 'Group Shots', iconName: 'camera-iris', route: '/(app)/dashboard/(shots)' },
  { id: 'requested', title: 'Requested Shots', iconName: 'camera-account', route: '/(app)/dashboard/(shots)/requested' },
  { id: 'other', title: 'Other Shots', iconName: 'camera-plus', route: '/(app)/dashboard/(shots)/other' },
];

export default function ShotsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="requested" />
      <Stack.Screen name="other" />
    </Stack>
  );
}
