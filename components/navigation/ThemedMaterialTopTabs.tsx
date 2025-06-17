import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../constants/theme';
import { typography } from '../../constants/typography';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

interface TabScreen {
  name: string;
  options: {
    title: string;
  };
}

interface ThemedMaterialTopTabsProps {
  screens: TabScreen[];
}

export const ThemedMaterialTopTabs: React.FC<ThemedMaterialTopTabsProps> = ({
  screens,
}) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outline,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarLabelStyle: {
            ...typography.labelLarge,
            textTransform: 'none',
          },
          swipeEnabled: true,
        }}
      >
        {screens.map((screen) => (
          <MaterialTopTabs.Screen
            key={screen.name}
            name={screen.name}
            options={screen.options}
          />
        ))}
      </MaterialTopTabs>
    </SafeAreaView>
  );
}; 