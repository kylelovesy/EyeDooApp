// # 4.3 Shots Tab
// # Shots secondary tabs layout
// app/(app)/dashboard/(shots)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const shotsSubPages: SubPage[] = [
  { id: 'index', title: 'Groups Shots', iconName: 'photo-camera', route: '/shots' },
  { id: 'requested', title: 'Requested Shots', iconName: 'photograph', route: '/shots/requested' },
  { id: 'other', title: 'Other Shots', iconName: 'photo-library', route: '/shots/other' },
];

export default function ShotsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="requested" />
      <Stack.Screen name="other" />
    </Stack>
  );
}

// import React from 'react';
// import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

// const shotsScreens = [
//   { name: 'index', options: { title: 'Groups' } },
//   { name: 'requested', options: { title: 'Requested' } },
//   { name: 'other', options: { title: 'Other' } },
// ];

// export default function ShotsLayout() {
//   return <ThemedMaterialTopTabs screens={shotsScreens} />;
// }