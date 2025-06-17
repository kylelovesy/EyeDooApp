// # 4.2 Timeline Tab
// # Timeline secondary tabs layout
// app/(app)/dashboard/(timeline)/_layout.tsx
import React from 'react';
import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

const timelineScreens = [
  { name: 'index', options: { title: 'General' } },
  { name: 'notifications', options: { title: 'Notifications' } },
  { name: 'edit', options: { title: 'Edit/Update' } },
];

export default function TimelineLayout() {
  return <ThemedMaterialTopTabs screens={timelineScreens} />;
}
