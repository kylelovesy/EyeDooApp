// # 4.1 Home Tab
// # Home secondary tabs layout

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#007AFF',
            height: 3,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
          },
          swipeEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{ title: 'General' }}
        />
        <MaterialTopTabs.Screen
          name="navigation"
          options={{ title: 'Navigation' }}
        />
        <MaterialTopTabs.Screen
          name="key-people"
          options={{ title: 'Key People' }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}