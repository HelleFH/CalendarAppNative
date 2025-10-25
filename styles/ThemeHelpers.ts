// themeHelpers.ts
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from './ThemeProvider';

// Generic helpers for spacing, radius, font size
export const spacing = (theme: Theme, size: keyof Theme['spacing']): number => theme.spacing[size];
export const radius = (theme: Theme, size: keyof Theme['radius']): number => theme.radius[size];
export const fontSize = (theme: Theme, size: keyof Theme['fontSize']): number => theme.fontSize[size];

// Predefined layout styles
export const container = (theme: Theme): ViewStyle => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing.md,
  backgroundColor: theme.colors.background,
});

export const scrollContent = (theme: Theme, width: number): ViewStyle => ({
  padding: theme.spacing.md,
  width,
  flexDirection: 'column',
  gap: theme.spacing.md,
  justifyContent: 'center',
  alignItems: 'center',
});

export const buttonStyle = (theme: Theme, width: number = 175): ViewStyle => ({
  borderRadius: theme.radius.md,
  width,
  justifyContent: 'center',
  alignItems: 'center',
});

export const textError = (theme: Theme): TextStyle => ({
  color: theme.colors.error,
});

export const themedText = (theme: Theme, variant: keyof Theme['textVariants']): TextStyle => ({
  ...theme.textVariants[variant],
  color: theme.colors.text,
});

export const imageStyle = (theme: Theme, variant: keyof Theme['Image']): ImageStyle => ({
  ...theme.Image[variant],
});

export const getImageStyle = (theme: Theme, size: 'small' | 'medium' | 'large') => ({
  width: theme.Image[size].width,
  height: theme.Image[size].height,
  borderRadius: theme.Image[size].borderRadius,
  resizeMode: theme.Image[size].resizeMode,
});
