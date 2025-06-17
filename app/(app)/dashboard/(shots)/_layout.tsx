// # 4.3 Shots Tab
// # Shots secondary tabs layout
// app/(app)/dashboard/(shots)/_layout.tsx
import React from 'react';
import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

const shotsScreens = [
  { name: 'index', options: { title: 'Groups' } },
  { name: 'requested', options: { title: 'Requested' } },
  { name: 'other', options: { title: 'Other' } },
];

export default function ShotsLayout() {
  return <ThemedMaterialTopTabs screens={shotsScreens} />;
}