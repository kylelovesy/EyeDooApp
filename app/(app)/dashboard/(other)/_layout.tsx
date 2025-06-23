// # 4.4 Other Tab
// # Other secondary tabs layout
// app/(app)/dashboard/(other)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const otherSubPages: SubPage[] = [
  { id: 'index', title: 'Notes', iconName: 'note-plus', route: '/(app)/dashboard/(other)' },
  { id: 'tags', title: 'Tags', iconName: 'tag-faces', route: '/(app)/dashboard/(other)/tags' },
  { id: 'vendors', title: 'Vendors', iconName: 'card-account-details', route: '/(app)/dashboard/(other)/vendors' },
  { id: 'preparation', title: 'Preparation', iconName: 'bag-personal', route: '/(app)/dashboard/(other)/preparation' },
];

export default function OtherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="tags" />
      <Stack.Screen name="vendors" />
      <Stack.Screen name="preparation" />
    </Stack>
  );
}