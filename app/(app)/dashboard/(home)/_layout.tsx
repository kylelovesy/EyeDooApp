// # 4.1 Home Tab
// # Home secondary tabs layout


import React from 'react';
import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

const homeScreens = [
  { name: 'index', options: { title: 'General' } },
  { name: 'navigation', options: { title: 'Navigation' } },
  { name: 'key-people', options: { title: 'Key People' } },
];

export default function HomeLayout() {
  return <ThemedMaterialTopTabs screens={homeScreens} />;
}