// ThemedScrollView.tsx
import React from 'react';
import { ScrollView, ScrollViewProps, ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';
import { scrollContent } from './ThemeHelpers';

interface ThemedScrollViewProps extends ScrollViewProps {
  variant?: 'screenContainer' | 'custom';
  width?: number;
}

export const ThemedScrollView: React.FC<ThemedScrollViewProps> = ({
  variant = 'screenContainer',
  width,
  contentContainerStyle,
  ...props
}) => {
  const { theme } = useTheme();
  let style: ViewStyle;

  if (variant === 'screenContainer') style = theme.layout.screenContainer;
  else if (width) style = scrollContent(theme, width);
  else style = {};

  return <ScrollView contentContainerStyle={[style, contentContainerStyle]} {...props} />;
};
