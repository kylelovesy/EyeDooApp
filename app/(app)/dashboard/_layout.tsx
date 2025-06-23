// # 4.0 Selected Event Dashboard
// Bottom tab navigation with 5 main tabs
// - Tab 1: Home (house icon)
// - Tab 2: Timeline (clock icon)
// - Tab 3: Shots (camera icon)
// - Tab 4: Other (grid icon)
// - Tab 5: Settings (cog icon)

// ===== DASHBOARD LAYOUT =====
// app/(app)/dashboard/_layout.tsx
import { spacing } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormModals } from '../../../components/FormModals';


export default function DashboardLayout() {
  const theme = useTheme();
  return (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        backgroundColor: theme.colors.background 
      }} 
      edges={['bottom']}  // Only handle bottom edge for tab bar
    >
      <Tabs
        screenOptions={{          
          headerShown: false,
          tabBarStyle: {
            elevation: 0,
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outline,
            height: 85,
            paddingBottom: spacing.sm,
            paddingTop: spacing.sm,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarLabelStyle: {
            ...typography.bodyMedium,
            color: theme.colors.onSurfaceVariant,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(timeline)"
          options={{
            title: 'Timeline',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(shots)"
          options={{
            title: 'Shots',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(other)"
          options={{
            title: 'Other',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <FormModals />
    </SafeAreaView>
  );
}




//   const colorScheme = useColorScheme();
//   const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
//   return (
//     <View style={{ flex: 1 }}>
//       <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: theme.colors.background,
//           borderTopWidth: 1,
//           borderTopColor: theme.colors.outline,
//           height: 85,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
//         tabBarLabelStyle: {
//           ...typography.bodyMedium,
//           color: theme.colors.onSurfaceVariant,
//         },
//       }}
//     >
//       {/* <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: {
//             backgroundColor: theme.colors.background,
//             borderTopWidth: 1,
//             borderTopColor: theme.colors.outline,
//             height: 85,
//             paddingBottom: 20,
//             paddingTop: 8,
//           },
//           tabBarActiveTintColor: theme.colors.primary,
//           tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
//           tabBarLabelStyle: {
//             ...typography.bodyMedium,
//             color: theme.colors.onSurfaceVariant,
//           },
//         }}
//       > */}
//         <Tabs.Screen
//           name="(home)"
//           options={{
//             title: 'Home',
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="home" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="(timeline)"
//           options={{
//             title: 'Timeline',
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="time" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="(shots)"
//           options={{
//             title: 'Shots',
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="camera" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="(other)"
//           options={{
//             title: 'Other',
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="grid" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="(settings)"
//           options={{
//             title: 'Settings',
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="settings" size={size} color={color} />
//             ),
//           }}
//         />
//       </Tabs>
      
//       {/* Centralized Form Modals - Available throughout the dashboard */}
//       <FormModals />
//     </View>
//   );
// }