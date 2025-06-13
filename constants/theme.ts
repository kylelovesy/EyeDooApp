// src/utils/theme.ts
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// EyeDooApp color palette based on the provided theme
const eyeDooAppLightColors = {
  primary: '#66C5CC', // Gentle Teal
  onPrimary: '#FFFFFF',
  primaryContainer: '#DDE2E7', // Desaturated Cool Tone
  onPrimaryContainer: '#0d141c',
  secondary: '#4AAEA5', // Bolder Teal
  onSecondary: '#FFFFFF',
  secondaryContainer: '#C8F8F2',
  onSecondaryContainer: '#00201D',
  tertiary: '#49739c',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D4E3FF',
  onTertiaryContainer: '#001C3A',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#F8F9FA', // Off-White
  onBackground: '#343A40', // Dark Grey
  surface: '#F8F9FA',
  onSurface: '#343A40',
  surfaceVariant: '#E9ECEF', // Light Grey
  onSurfaceVariant: '#6C757D', // Medium Grey
  outline: '#CEDBE8',
  outlineVariant: '#C1C8CE',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2F3033',
  inverseOnSurface: '#F1F0F4',
  inversePrimary: '#A5EAF1',
  elevation: {
    level0: 'transparent',
    level1: '#F8F9FA',
    level2: '#F1F3F4',
    level3: '#E8EAED',
    level4: '#E3E5E8',
    level5: '#DADCE0',
  },
};

const eyeDooAppDarkColors = {
  primary: '#66C5CC', // Same gentle teal for branding consistency
  onPrimary: '#00363A', // Deep teal blue for contrast
  primaryContainer: '#004F55', // Dark teal variant
  onPrimaryContainer: '#A5EAF1', // Light cyan for text visibility
  secondary: '#4AAEA5', // Bolder teal
  onSecondary: '#003731', // Deep green-teal
  secondaryContainer: '#005047', // Muted dark greenish teal
  onSecondaryContainer: '#A6FDF4',
  tertiary: '#9CCBFF', // Muted light steel blue
  onTertiary: '#00315A', // Navy blue
  tertiaryContainer: '#254766', // Desaturated dark blue
  onTertiaryContainer: '#D4E3FF',
  error: '#FFB4AB', // Lighter red-orange
  onError: '#690005', // Dark crimson
  errorContainer: '#93000A', // Deep red
  onErrorContainer: '#FFDAD6',
  background: '#121417', // Near-black with blue-gray tint
  onBackground: '#E9ECEF', // Light grey
  surface: '#1A1C1E', // Slightly lifted from background
  onSurface: '#E9ECEF',
  surfaceVariant: '#41484D', // Medium gray-blue
  onSurfaceVariant: '#C1C8CE', // Light gray for icons/text
  outline: '#8C959D', // Mid gray for dividers and outlines
  outlineVariant: '#41484D',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E9ECEF',
  inverseOnSurface: '#2F3033',
  inversePrimary: '#66C5CC',
  elevation: {
    level0: 'transparent',
    level1: '#1F2124',
    level2: '#22252A',
    level3: '#262A30',
    level4: '#282D34',
    level5: '#2B3038',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...eyeDooAppLightColors,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...eyeDooAppDarkColors,
  },
};

// Theme utilities
export const getTheme = (isDark: boolean) => isDark ? darkTheme : lightTheme;

// Common spacing and sizing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
};