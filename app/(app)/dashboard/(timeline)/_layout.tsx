// # 4.2 Timeline Tab
// # Timeline secondary tabs layout
// app/(app)/dashboard/(timeline)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const timelineSubPages: SubPage[] = [
  { id: 'index', title: 'General', iconName: 'timeline-clock', route: '/timeline' },
  { id: 'notifications', title: 'Notifications', iconName: 'notifications-circle', route: '/timeline/notifications' },
  { id: 'edit', title: 'Edit/Update', iconName: 'pencil-circle', route: '/timeline/edit' },
];

export default function TimelineLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}

// import React from 'react';
// import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

// const timelineScreens = [
//   { name: 'index', options: { title: 'General' } },
//   { name: 'notifications', options: { title: 'Notifications' } },
//   { name: 'edit', options: { title: 'Edit/Update' } },
// ];

// export default function TimelineLayout() {
//   return <ThemedMaterialTopTabs screens={timelineScreens} />;
// }