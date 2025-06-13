// src/components/ui/CustomButton.tsx
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import { borderRadius, spacing } from '../../constants/theme';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  contentStyle,
  labelStyle,
  disabled = false,
  loading = false,
  testID,
  ...props
}) => {
  const theme = useTheme();

  const getButtonMode = (): ButtonProps['mode'] => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained-tonal';
      case 'outline':
        return 'outlined';
      case 'text':
        return 'text';
      case 'danger':
        return 'contained';
      default:
        return 'contained';
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'danger':
        return theme.colors.error;
      default:
        return undefined;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { 
          paddingVertical: spacing.xs, 
          paddingHorizontal: spacing.sm,
          minHeight: 32,
        };
      case 'large':
        return { 
          paddingVertical: spacing.md, 
          paddingHorizontal: spacing.lg,
          minHeight: 56,
        };
      default:
        return { 
          paddingVertical: spacing.sm, 
          paddingHorizontal: spacing.md,
          minHeight: 44,
        };
    }
  };

  const getLabelStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 12, lineHeight: 16 };
      case 'large':
        return { fontSize: 16, lineHeight: 24 };
      default:
        return { fontSize: 14, lineHeight: 20 };
    }
  };

  const buttonStyles: ViewStyle[] = [
    {
      borderRadius: borderRadius.md,
      ...(fullWidth && { width: '100%' }),
    },
    style as ViewStyle,
  ];

  const buttonContentStyles: ViewStyle[] = [
    getSizeStyles(),
    contentStyle as ViewStyle,
  ];

  const buttonLabelStyles: TextStyle[] = [
    getLabelStyles(),
    labelStyle as TextStyle,
  ];

  return (
    <Button
      mode={getButtonMode()}
      buttonColor={getButtonColor()}
      style={buttonStyles}
      contentStyle={buttonContentStyles}
      labelStyle={buttonLabelStyles}
      disabled={disabled || loading}
      loading={loading}
      icon={icon && iconPosition === 'left' ? icon : undefined}
      {...props}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {title}
    </Button>
  );
};

export default CustomButton;