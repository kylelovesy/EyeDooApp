// # 4.4 Other Tab
// # Other secondary tabs layout
// app/(app)/dashboard/(other)/_layout.tsx
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const otherSubPages: SubPage[] = [
  { id: 'index', title: 'Notes', iconName: 'sticky-note', route: '/other' },
  { id: 'tags', title: 'Tags', iconName: 'tag', route: '/other/tags' },
  { id: 'vendors', title: 'Vendors', iconName: 'contact-card', route: '/other/vendors' },
  { id: 'preparation', title: 'Preparation', iconName: 'bag', route: '/other/preparation' },
];

export default function OtherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="tags" />
      <Stack.Screen name="vendors" />
      <Stack.Screen name="preparation" />
    </Stack>
  );
}
// import React from 'react';
// import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

// const otherScreens = [
//   { name: 'index', options: { title: 'Notes' } },
//   { name: 'tags', options: { title: 'Tags' } },
//   { name: 'vendors', options: { title: 'Vendors' } },
//   { name: 'preparation', options: { title: 'Preparation' } },
// ];

// export default function OtherLayout() {
//   return <ThemedMaterialTopTabs screens={otherScreens} />;
// }
