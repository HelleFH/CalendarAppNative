import { View, type ViewProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import React from 'react';

export type ThemedViewProps = ViewProps & {
  variant?: keyof typeof themeVariants; // optional variant key
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
};

// Map of variant keys to style extractor functions
const themeVariants = {
  modalOverlay: (theme: ReturnType<typeof useTheme>['theme']) => theme.layout.modal.overlay,
  modalContent: (theme: ReturnType<typeof useTheme>['theme']) => theme.layout.modal.content,
  screenContainer: (theme: ReturnType<typeof useTheme>['theme']) => theme.layout.screenContainer,
  cardSmall: (theme: ReturnType<typeof useTheme>['theme']) => theme.layout.card.small,
  cardLarge: (theme: ReturnType<typeof useTheme>['theme']) => theme.layout.card.large,
};

export function ThemedView({ style, variant, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { theme } = useTheme();

  let variantStyle: ViewStyle | undefined = undefined;
  if (variant && themeVariants[variant]) {
    variantStyle = themeVariants[variant](theme);
  }

  const backgroundColor = lightColor || darkColor || (variantStyle?.backgroundColor ?? theme.colors.background);

  return <View style={[variantStyle, { backgroundColor }, style]} {...otherProps} />;
}
