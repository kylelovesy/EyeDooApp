// # 4.5 Settings Tab
// # Settings secondary tabs layout
// app/(app)/dashboard/(settings)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const settingsSubPages: SubPage[] = [
  { id: 'index', title: 'Account', iconName: 'account-circle', route: '/settings' },
  { id: 'calendar', title: 'Calendar', iconName: 'calendar', route: '/settings/calendar' },
  { id: 'edit-project', title: 'Edit Project', iconName: 'project', route: '/settings/edit-project' },
  { id: 'settings', title: 'Settings', iconName: 'account-cog', route: '/settings/settings' },
];

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="edit-project" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
// import { Stack } from 'expo-router';
// import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// // Define subpages for the home tab
// export const settingsSubPages: SubPage[] = [
//   { id: 'account', title: 'Account', iconName: 'account', route: '/settings' },
//   { id: 'calendar', title: 'Calendar', iconName: 'cog', route: '/settings/calendar' },
//   { id: 'edit-project', title: 'Edit Project', iconName: 'bell', route: '/settings/edit-project' },
//   { id: 'settings', title: 'Settings', iconName: 'bell', route: '/settings/settings' },
// ];

// export default function HomeLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false, // We'll use our custom AppBar instead
//       }}
//     >
//       <Stack.Screen name="index" />
//       <Stack.Screen name="calendar" />
//       <Stack.Screen name="edit-project" />
//       <Stack.Screen name="settings" />
//     </Stack>
//   );
// }
// import React from 'react';
// import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

// const settingsScreens = [
//   { name: 'index', options: { title: 'Account' } },
//   { name: 'calendar', options: { title: 'Calendar' } },
//   { name: 'edit-project', options: { title: 'Edit Project' } },
//   { name: 'settings', options: { title: 'Settings' } },
// ];

// export default function SettingsLayout() {
//   return <ThemedMaterialTopTabs screens={settingsScreens} />;
// }