import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../constants/theme';
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
  // const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
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
    // Don't wrap in SafeAreaView here - let the parent Screen handle it
    // This ensures no gaps appear above the AppBar
    <Appbar 
      mode="small"
      // safeAreaInsets={{ top: 0 }}
      elevated={true}
      style={[        
        {           
          backgroundColor: theme.colors.surface,
          margin: 0,
          padding: spacing.sm,          
         }, style]} // Default Material Design purple
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
    </Appbar>
  );
};

export default DashboardAppBar;
