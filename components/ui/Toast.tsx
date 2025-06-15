// components/ui/Toast.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, spacing, useAppTheme } from '../../constants/theme';
import { typography } from '../../constants/typography';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
  onDismiss?: () => void;
}

interface ToastProps extends ToastConfig {
  visible: boolean;
  onHide: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const TOAST_WIDTH = screenWidth - 32; // 16px margin on each side

/**
 * Toast notification component for displaying temporary messages
 * Supports different types: success, error, warning, info
 * Can be positioned at top or bottom of screen
 * Includes auto-dismiss functionality and manual dismiss option
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  type,
  title,
  message,
  duration = 4000,
  onPress,
  onDismiss,
  onHide,
}) => {
  const theme = useAppTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
          textColor: theme.colors.onPrimaryContainer,
          icon: 'checkmark-circle' as const,
          iconColor: theme.colors.primary,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.errorContainer,
          borderColor: theme.colors.error,
          textColor: theme.colors.onErrorContainer,
          icon: 'close-circle' as const,
          iconColor: theme.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.tertiaryContainer,
          borderColor: theme.colors.tertiary,
          textColor: theme.colors.onTertiaryContainer,
          icon: 'warning' as const,
          iconColor: theme.colors.tertiary,
        };
      case 'info':
        return {
          backgroundColor: theme.colors.secondaryContainer,
          borderColor: theme.colors.secondary,
          textColor: theme.colors.onSecondaryContainer,
          icon: 'information-circle' as const,
          iconColor: theme.colors.secondary,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          textColor: theme.colors.onSurface,
          icon: 'information-circle' as const,
          iconColor: theme.colors.onSurfaceVariant,
        };
    }
  };

  const config = getToastConfig();

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          hideToast();
        }, duration);
      }
    } else {
      hideToast();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    hideToast();
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    hideToast();
  };

  if (!visible) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      left: 16,
      right: 16,
      zIndex: 9999,
    },
    toast: {
      backgroundColor: config.backgroundColor,
      borderLeftWidth: 4,
      borderLeftColor: config.borderColor,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      marginRight: spacing.sm,
      marginTop: 2,
    },
    content: {
      flex: 1,
      marginRight: spacing.sm,
    },
    title: {
      ...typography.titleMedium,
      color: config.textColor,
      marginBottom: message ? spacing.xs : 0,
    },
    message: {
      ...typography.bodyMedium,
      color: config.textColor,
      opacity: 0.9,
    },
    dismissButton: {
      padding: spacing.xs,
      marginTop: -spacing.xs,
      marginRight: -spacing.xs,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={onPress ? handlePress : undefined}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={config.icon}
            size={24}
            color={config.iconColor}
          />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close"
            size={20}
            color={config.textColor}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Hook for managing toast state
export const useToast = () => {
  const [toastConfig, setToastConfig] = React.useState<ToastConfig | null>(null);
  const [visible, setVisible] = React.useState(false);

  const showToast = (config: ToastConfig) => {
    setToastConfig(config);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
    // Clear config after animation completes
    setTimeout(() => {
      setToastConfig(null);
    }, 300);
  };

  const showSuccess = (title: string, message?: string, options?: Partial<ToastConfig>) => {
    showToast({ type: 'success', title, message, ...options });
  };

  const showError = (title: string, message?: string, options?: Partial<ToastConfig>) => {
    showToast({ type: 'error', title, message, ...options });
  };

  const showWarning = (title: string, message?: string, options?: Partial<ToastConfig>) => {
    showToast({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title: string, message?: string, options?: Partial<ToastConfig>) => {
    showToast({ type: 'info', title, message, ...options });
  };

  return {
    // Toast component props
    toastProps: toastConfig ? {
      ...toastConfig,
      visible,
      onHide: hideToast,
    } : null,
    
    // Toast control methods
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

/**
 * Usage Example:
 * 
 * import { Toast, useToast } from '../components/ui/Toast';
 * 
 * const MyComponent = () => {
 *   const { toastProps, showError, showSuccess } = useToast();
 * 
 *   const handleError = () => {
 *     showError('Login Failed', 'Please check your credentials and try again.');
 *   };
 * 
 *   const handleSuccess = () => {
 *     showSuccess('Success!', 'You have been logged in successfully.');
 *   };
 * 
 *   return (
 *     <View>
 *       <Button onPress={handleError} title="Show Error" />
 *       <Button onPress={handleSuccess} title="Show Success" />
 *       {toastProps && <Toast {...toastProps} />}
 *     </View>
 *   );
 * };
 */