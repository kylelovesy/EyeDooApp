import React from 'react';
import { Appbar } from 'react-native-paper';

// Define the structure for each subpage/icon
export interface SubPage {
  id: string;
  title: string;
  iconName: string;
  route: string;
}

// Simplified navigation interface that works with Expo Router
export interface NavigationProp {
  goBack: () => void;
  navigate: (route: string) => void;
  push?: (route: string) => void;
  replace?: (route: string) => void;
}

// Props interface for the dynamic AppBar
interface DashboardAppBarProps {
  // Navigation prop for handling back and navigation actions
  navigation: NavigationProp;
  
  // Current page title to display
  title: string;
  
  // Array of all available subpages for this tab
  subPages: SubPage[];
  
  // ID of the currently active/selected subpage
  currentSubPageId: string;
  
  // Optional: Custom logic to determine if an icon should be visible
  // If not provided, will hide only the current subpage icon
  isIconVisible?: (subPage: SubPage, currentId: string) => boolean;
  
  // Optional: Custom back button handler
  onBackPress?: () => void;
  
  // Optional: Additional styling
  style?: object;
}

const DashboardAppBar: React.FC<DashboardAppBarProps> = ({
  navigation,
  title,
  subPages,
  currentSubPageId,
  isIconVisible,
  onBackPress,
  style,
}) => {
  // Default visibility logic - hide current subpage icon
  const defaultIsIconVisible = (subPage: SubPage, currentId: string): boolean => {
    return subPage.id !== currentId;
  };

  // Use custom visibility logic if provided, otherwise use default
  const checkIconVisibility = isIconVisible || defaultIsIconVisible;

  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Handle icon press to navigate to subpage
  const handleIconPress = (subPage: SubPage) => {
    navigation.navigate(subPage.route);
  };

  return (
    <Appbar.Header 
      elevated={true}
      style={[{ backgroundColor: '#DDDDDD' }, style]} // Default Material Design purple
    >
      {/* Back button */}
      <Appbar.BackAction onPress={handleBackPress} />
      
      {/* Page title */}
      <Appbar.Content title={title} />
      
      {/* Dynamic right-aligned icons */}
      {subPages.map((subPage) => {
        // Only render icon if it should be visible
        if (checkIconVisibility(subPage, currentSubPageId)) {
          return (
            <Appbar.Action
              key={subPage.id}
              icon={subPage.iconName}
              onPress={() => handleIconPress(subPage)}
              accessibilityLabel={`Navigate to ${subPage.title}`}
            />
          );
        }
        return null;
      })}
    </Appbar.Header>
  );
};

export default DashboardAppBar;

// Example usage with Expo Router:
/*
// app/(app)/dashboard/(home)/index.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DynamicAppBar, { NavigationProp } from '../../../../components/navigation/DashboardAppbar';

// Define your subpages for dashboard
const dashboardSubPages = [
  { id: 'home', title: 'Home', iconName: 'home', route: '/(app)/dashboard/(home)' },
  { id: 'analytics', title: 'Analytics', iconName: 'chart-line', route: '/(app)/dashboard/analytics' },
  { id: 'reports', title: 'Reports', iconName: 'file-chart', route: '/(app)/dashboard/reports' },
  { id: 'settings', title: 'Settings', iconName: 'cog', route: '/(app)/dashboard/settings' },
];

export default function DashboardHomeScreen() {
  const router = useRouter();
  
  // Create navigation object that matches the expected interface
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
    push: (route: string) => router.push(route as any),
    replace: (route: string) => router.replace(route as any),
  };

  return (
    <View style={{ flex: 1 }}>
      <DynamicAppBar
        navigation={navigation}
        title="Dashboard"
        subPages={dashboardSubPages}
        currentSubPageId="home"
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Dashboard Overview</Text>
        <Card style={{ marginTop: 16 }}>
          <Card.Content>
            <Text>Dashboard content goes here...</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

// For analytics page:
// app/(app)/dashboard/analytics.tsx
export default function AnalyticsScreen() {
  const router = useRouter();
  
  const navigation: NavigationProp = {
    goBack: () => router.back(),
    navigate: (route: string) => router.push(route as any),
  };

  return (
    <View style={{ flex: 1 }}>
      <DynamicAppBar
        navigation={navigation}
        title="Analytics"
        subPages={dashboardSubPages}
        currentSubPageId="analytics"
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="headlineMedium">Analytics</Text>
      </ScrollView>
    </View>
  );
}
*/

// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import React from 'react';
// import { Appbar } from 'react-native-paper';

// // Define the structure for each subpage/icon
// export interface SubPage {
//   id: string;
//   title: string;
//   iconName: string;
//   route: string;
// }

// // Props interface for the dynamic AppBar
// interface DashboardAppBarProps {
//   // Navigation prop for handling back and navigation actions
//   navigation: NativeStackNavigationProp<any>;
  
//   // Current page title to display
//   title: string;
  
//   // Array of all available subpages for this tab
//   subPages: SubPage[];
  
//   // ID of the currently active/selected subpage
//   currentSubPageId: string;
  
//   // Optional: Custom logic to determine if an icon should be visible
//   // If not provided, will hide only the current subpage icon
//   isIconVisible?: (subPage: SubPage, currentId: string) => boolean;
  
//   // Optional: Custom back button handler
//   onBackPress?: () => void;
  
//   // Optional: Additional styling
//   style?: object;
// }

// const DashboardAppBar: React.FC<DashboardAppBarProps> = ({
//   navigation,
//   title,
//   subPages,
//   currentSubPageId,
//   isIconVisible,
//   onBackPress,
//   style,
// }) => {
//   // Default visibility logic - hide current subpage icon
//   const defaultIsIconVisible = (subPage: SubPage, currentId: string): boolean => {
//     return subPage.id !== currentId;
//   };

//   // Use custom visibility logic if provided, otherwise use default
//   const checkIconVisibility = isIconVisible || defaultIsIconVisible;

//   // Handle back button press
//   const handleBackPress = () => {
//     if (onBackPress) {
//       onBackPress();
//     } else {
//       navigation.goBack();
//     }
//   };

//   // Handle icon press to navigate to subpage
//   const handleIconPress = (subPage: SubPage) => {
//     navigation.navigate(subPage.route);
//   };

//   return (
//     <Appbar.Header 
//       elevated={true}
//       style={[{ backgroundColor: '#6200ee' }, style]} // Default Material Design purple
//     >
//       {/* Back button */}
//       <Appbar.BackAction onPress={handleBackPress} />
      
//       {/* Page title */}
//       <Appbar.Content title={title} />
      
//       {/* Dynamic right-aligned icons */}
//       {subPages.map((subPage) => {
//         // Only render icon if it should be visible
//         if (checkIconVisibility(subPage, currentSubPageId)) {
//           return (
//             <Appbar.Action
//               key={subPage.id}
//               icon={subPage.iconName}
//               onPress={() => handleIconPress(subPage)}
//               accessibilityLabel={`Navigate to ${subPage.title}`}
//             />
//           );
//         }
//         return null;
//       })}
//     </Appbar.Header>
//   );
// };

// export default DashboardAppBar;

// Example usage in a screen component:
/*
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import DynamicAppBar, { SubPage } from './DynamicAppBar';

// Define your subpages for this tab
const profileSubPages: SubPage[] = [
  { id: 'profile', title: 'Profile', iconName: 'account', route: 'ProfileScreen' },
  { id: 'settings', title: 'Settings', iconName: 'cog', route: 'SettingsScreen' },
  { id: 'notifications', title: 'Notifications', iconName: 'bell', route: 'NotificationsScreen' },
];

const ProfileScreen = ({ navigation, route }) => {
  // You can get the current page from route params or use a state management solution
  const currentSubPage = route.params?.currentSubPage || 'profile';
  
  return (
    <View style={{ flex: 1 }}>
      <DynamicAppBar
        navigation={navigation}
        title="Profile"
        subPages={profileSubPages}
        currentSubPageId={currentSubPage}
      />
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Profile Screen Content</Text>
      </View>
    </View>
  );
};

// Example with custom visibility logic
const SettingsScreen = ({ navigation, route }) => {
  const currentSubPage = route.params?.currentSubPage || 'settings';
  
  // Custom logic: hide settings icon and profile icon when on settings page
  const customVisibilityLogic = (subPage: SubPage, currentId: string): boolean => {
    if (currentId === 'settings') {
      return subPage.id !== 'settings' && subPage.id !== 'profile';
    }
    return subPage.id !== currentId;
  };
  
  return (
    <View style={{ flex: 1 }}>
      <DynamicAppBar
        navigation={navigation}
        title="Settings"
        subPages={profileSubPages}
        currentSubPageId={currentSubPage}
        isIconVisible={customVisibilityLogic}
      />
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Settings Screen Content</Text>
      </View>
    </View>
  );
};

// Example for a different tab with different subpages
const shopSubPages: SubPage[] = [
  { id: 'browse', title: 'Browse', iconName: 'shopping', route: 'BrowseScreen' },
  { id: 'cart', title: 'Cart', iconName: 'cart', route: 'CartScreen' },
  { id: 'orders', title: 'Orders', iconName: 'package-variant', route: 'OrdersScreen' },
  { id: 'wishlist', title: 'Wishlist', iconName: 'heart', route: 'WishlistScreen' },
];

const ShopScreen = ({ navigation, route }) => {
  const currentSubPage = route.params?.currentSubPage || 'browse';
  
  return (
    <View style={{ flex: 1 }}>
      <DynamicAppBar
        navigation={navigation}
        title="Shop"
        subPages={shopSubPages}
        currentSubPageId={currentSubPage}
        style={{ backgroundColor: '#4caf50' }} // Custom green color
      />
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Shop Screen Content</Text>
      </View>
    </View>
  );
};
*/