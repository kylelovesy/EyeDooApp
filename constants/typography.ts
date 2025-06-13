// src/utils/typography.ts
import { TextStyle } from 'react-native';

// Jakarta Sans font configuration
const JakartaSansConfig = {
  light: 'PlusJakartaSans-Light',
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
};

// Font weight mapping
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
} as const;

// Typography scale following Material Design 3 guidelines
type TypographyVariant =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

export const typography: Record<TypographyVariant, TextStyle> = {
  // Display typography for hero sections and major headings
  displayLarge: {
    fontFamily: JakartaSansConfig.bold,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
    fontWeight: fontWeights.bold,
  },
  displayMedium: {
    fontFamily: JakartaSansConfig.bold,
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: fontWeights.bold,
  },
  displaySmall: {
    fontFamily: JakartaSansConfig.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: fontWeights.bold,
  },
  
  // Headline typography for section headers and important content
  headlineLarge: {
    fontFamily: JakartaSansConfig.semiBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: fontWeights.semiBold,
  },
  headlineMedium: {
    fontFamily: JakartaSansConfig.semiBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: fontWeights.semiBold,
  },
  headlineSmall: {
    fontFamily: JakartaSansConfig.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: fontWeights.semiBold,
  },
  
  // Title typography for card headers and subsections
  titleLarge: {
    fontFamily: JakartaSansConfig.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: fontWeights.bold,
  },
  titleMedium: {
    fontFamily: JakartaSansConfig.semiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: fontWeights.semiBold,
  },
  titleSmall: {
    fontFamily: JakartaSansConfig.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: fontWeights.medium,
  },
  
  // Body typography for main content and descriptions
  bodyLarge: {
    fontFamily: JakartaSansConfig.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: fontWeights.regular,
  },
  bodyMedium: {
    fontFamily: JakartaSansConfig.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontFamily: JakartaSansConfig.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: fontWeights.regular,
  },
  
  // Label typography for form labels and metadata
  labelLarge: {
    fontFamily: JakartaSansConfig.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: fontWeights.medium,
  },
  labelMedium: {
    fontFamily: JakartaSansConfig.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: fontWeights.medium,
  },
  labelSmall: {
    fontFamily: JakartaSansConfig.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: fontWeights.medium,
  },
};

// Typography utility functions
export const getTypographyStyle = (variant: TypographyVariant): TextStyle => {
  return typography[variant];
};

// Responsive typography scaling
export const getResponsiveTypography = (
  variant: TypographyVariant,
  scale: number = 1
): TextStyle => {
  const baseStyle = typography[variant];
  return {
    ...baseStyle,
    fontSize: (baseStyle.fontSize || 14) * scale,
    lineHeight: (baseStyle.lineHeight || 20) * scale,
  };
};

// Font loading utility
export const fontAssets = {
  'PlusJakartaSans-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
  'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
};