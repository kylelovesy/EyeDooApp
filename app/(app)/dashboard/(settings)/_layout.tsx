// # 4.5 Settings Tab
// # Settings secondary tabs layout
// app/(app)/dashboard/(settings)/_layout.tsx
import React from 'react';
import { ThemedMaterialTopTabs } from '../../../../components/navigation/ThemedMaterialTopTabs';

const settingsScreens = [
  { name: 'index', options: { title: 'Account' } },
  { name: 'calendar', options: { title: 'Calendar' } },
  { name: 'edit-project', options: { title: 'Edit Project' } },
  { name: 'settings', options: { title: 'Settings' } },
];

export default function SettingsLayout() {
  return <ThemedMaterialTopTabs screens={settingsScreens} />;
}