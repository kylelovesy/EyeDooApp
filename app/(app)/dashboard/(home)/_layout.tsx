// # 4.1 Home Tab
// # Home secondary tabs layout
import { Stack } from 'expo-router';
import { SubPage } from '../../../../components/navigation/DashboardAppbar';

// Define subpages for the home tab
export const homeSubPages: SubPage[] = [
  { id: 'index', title: 'Home', iconName: 'home', route: '/(app)/dashboard/(home)' },
  { id: 'directions', title: 'Directions', iconName: 'directions-fork', route: '/(app)/dashboard/(home)/directions' },
  { id: 'key-people', title: 'Key People', iconName: 'account-key', route: '/(app)/dashboard/(home)/key-people' },
];

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll use our custom AppBar instead
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="directions" />
      <Stack.Screen name="key-people" />
    </Stack>
  );
}



// import React from 'react';
// import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

// const homeScreens = [
//   { name: 'index', options: { title: 'General' } },
//   { name: 'navigation', options: { title: 'Navigation' } },
//   { name: 'key-people', options: { title: 'Key People' } },
// ];

// export default function HomeLayout() {
//   return <ThemedMaterialTopTabs screens={homeScreens} />;
// }