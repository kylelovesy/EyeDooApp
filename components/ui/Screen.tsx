// components/ui/Screen.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  padding?: keyof typeof spacing | 'none';
  backgroundColor?: string;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  testID?: string;
  // Add these new props for better control
  safeArea?: boolean;
  paddingTop?: number;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  padding = 'md',
  backgroundColor,
  statusBarStyle = 'auto',
  edges = ['top', 'bottom'],
  testID,
  safeArea = true,
  paddingTop,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.background,
    paddingTop: paddingTop,
    ...style,
  };

  // Handle 'none' padding specifically
  const getPaddingValue = () => {
    if (padding === 'none') return 0;
    if (!padding) return 0;
    return spacing[padding as keyof typeof spacing];
  };

  const contentStyle: ViewStyle = {
    flex: scrollable ? undefined : 1,
    padding: getPaddingValue(),
    ...contentContainerStyle,
  };

  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable 
    ? { 
        contentContainerStyle: contentStyle,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled' as const,
      }
    : { style: contentStyle };

  const content = (
    <>
      <StatusBar style={statusBarStyle as any} />
      <Container {...containerProps}>
        {children}
      </Container>
    </>
  );

  if (safeArea) {
    return (
      <SafeAreaView style={containerStyle} edges={edges} testID={testID}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {content}
    </View>
  );
};
