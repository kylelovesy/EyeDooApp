// src/components/ui/Toast.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  duration: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface UseToastOptions {
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onDismiss,
  duration = 4000,
  action,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          color: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          color: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9800',
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: theme.colors.inverseSurface,
          color: theme.colors.inverseOnSurface,
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      default:
        return 'information';
    }
  };

  const toastStyle = getToastStyle();

  if (!message) return null;

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      style={[
        styles.snackbar,
        { backgroundColor: toastStyle.backgroundColor }
      ]}
      theme={{
        colors: {
          inverseOnSurface: toastStyle.color,
          inverseSurface: toastStyle.backgroundColor,
        }
      }}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name={getIcon()}
          size={20}
          color={toastStyle.color}
          style={styles.icon}
        />
        {message}
      </View>
    </Snackbar>
  );
};

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastState>({
    message: null,
    type: 'info',
    visible: false,
    duration: 4000,
  });

  const hideToast = useCallback(() => {
    setToastState(prev => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    options?: UseToastOptions
  ) => {
    setToastState({
      message,
      type,
      visible: true,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }, []);

  const showSuccess = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ) => {
    const fullMessage = message ? `${title}: ${message}` : title;
    showToast(fullMessage, 'success', options);
  }, [showToast]);

  const showError = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ) => {
    const fullMessage = message ? `${title}: ${message}` : title;
    showToast(fullMessage, 'error', options);
  }, [showToast]);

  const showWarning = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ) => {
    const fullMessage = message ? `${title}: ${message}` : title;
    showToast(fullMessage, 'warning', options);
  }, [showToast]);

  const showInfo = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ) => {
    const fullMessage = message ? `${title}: ${message}` : title;
    showToast(fullMessage, 'info', options);
  }, [showToast]);

  const toastProps = toastState.visible ? {
    message: toastState.message,
    type: toastState.type,
    visible: toastState.visible,
    onDismiss: hideToast,
    duration: toastState.duration,
    action: toastState.action,
  } : null;

  return {
    toastProps,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };
};

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

export default Toast;

