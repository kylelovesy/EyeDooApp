// # 4.4 Other Tab
// # Other secondary tabs layout
// app/(app)/dashboard/(other)/_layout.tsx
import React from 'react';
import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

const otherScreens = [
  { name: 'index', options: { title: 'Notes' } },
  { name: 'tags', options: { title: 'Tags' } },
  { name: 'vendors', options: { title: 'Vendors' } },
  { name: 'preparation', options: { title: 'Preparation' } },
];

export default function OtherLayout() {
  return <ThemedMaterialTopTabs screens={otherScreens} />;
}
