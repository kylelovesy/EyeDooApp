import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { typography } from '../../constants/typography';

type TypographyVariant =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  numberOfLines?: number;
  onPress?: () => void;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  style,
  color,
  textAlign = 'left',
  numberOfLines,
  onPress,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const typographyStyle = typography[variant];

  if (!typographyStyle) {
    console.warn(`Typography variant "${variant}" not found`);
    return null;
  }

  const combinedStyle: TextStyle = {
    ...typographyStyle,
    color,
    textAlign,
    ...(style as TextStyle),
  };

  return (
    <Text
      style={combinedStyle}
      numberOfLines={numberOfLines}
      onPress={onPress}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={onPress ? 'button' : 'text'}
      testID={testID}
    >
      {children}
    </Text>
  );
};

// Convenience components for common typography patterns
export const DisplayText: React.FC<Omit<TypographyProps, 'variant'> & { 
  size?: 'large' | 'medium' | 'small' 
}> = ({ size = 'medium', ...props }) => (
  <Typography variant={`display${size.charAt(0).toUpperCase() + size.slice(1)}` as TypographyVariant} {...props} />
);

export const HeadlineText: React.FC<Omit<TypographyProps, 'variant'> & { 
  size?: 'large' | 'medium' | 'small' 
}> = ({ size = 'medium', ...props }) => (
  <Typography variant={`headline${size.charAt(0).toUpperCase() + size.slice(1)}` as TypographyVariant} {...props} />
);

export const TitleText: React.FC<Omit<TypographyProps, 'variant'> & { 
  size?: 'large' | 'medium' | 'small' 
}> = ({ size = 'medium', ...props }) => (
  <Typography variant={`title${size.charAt(0).toUpperCase() + size.slice(1)}` as TypographyVariant} {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'> & { 
  size?: 'large' | 'medium' | 'small' 
}> = ({ size = 'medium', ...props }) => (
  <Typography variant={`body${size.charAt(0).toUpperCase() + size.slice(1)}` as TypographyVariant} {...props} />
);

export const LabelText: React.FC<Omit<TypographyProps, 'variant'> & { 
  size?: 'large' | 'medium' | 'small' 
}> = ({ size = 'medium', ...props }) => (
  <Typography variant={`label${size.charAt(0).toUpperCase() + size.slice(1)}` as TypographyVariant} {...props} />
);
