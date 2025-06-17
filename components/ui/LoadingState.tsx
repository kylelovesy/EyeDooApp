// src/components/ui/LoadingState.tsx
import React from 'react';
import { StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { darkTheme, lightTheme, spacing } from '../../constants/theme';
import { BodyText } from './Typography';


interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
  style?: ViewStyle;
  testID?: string;
}



export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  overlay = false,
  style,
  testID,
}) => {
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(overlay && styles.overlay),
    backgroundColor: overlay 
        ? 'rgba(0, 0, 0, 0.5)' 
        : 'transparent',
    ...style,
    };

  const contentStyle: ViewStyle = {
    backgroundColor: overlay ? theme.colors.surface : 'transparent',
    borderRadius: overlay ? 12 : 0,
    padding: overlay ? spacing.lg : spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: overlay ? 120 : undefined,
  };

  return (
    <View style={containerStyle} testID={testID}>
      <View style={contentStyle}>
        <ActivityIndicator
          size={size}
          color={theme.colors.primary}
          accessibilityLabel="Loading indicator"
        />
        {message && (
          <BodyText
            size="medium"
            style={[
              styles.message,
              { 
                color: overlay 
                  ? theme.colors.onSurface 
                  : theme.colors.onBackground 
              },
            ]}
            textAlign="center"
          >
            {message}
          </BodyText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  message: {
    marginTop: spacing.md,
  },
});

export default LoadingState;