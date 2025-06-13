// src/components/ui/Screen.tsx
import React from 'react';
import { ScrollView, StatusBar, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  padding?: keyof typeof spacing;
  backgroundColor?: string;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  testID?: string;
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
}) => {
  const theme = useTheme();
  
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.background,
    ...style,
  };

  const contentStyle: ViewStyle = {
    flex: scrollable ? undefined : 1,
    padding: spacing[padding],
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

  return (
    <SafeAreaView style={containerStyle} edges={edges} testID={testID}>
      <StatusBar 
        barStyle={statusBarStyle === 'auto' ? undefined : statusBarStyle as any}
        backgroundColor={backgroundColor || theme.colors.background}
        />
      <Container {...containerProps}>
        {children}
      </Container>
    </SafeAreaView>
  );
};