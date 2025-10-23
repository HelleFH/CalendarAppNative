// ThemedImage.tsx
import React from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { getImageStyle } from '@/styles/ThemeHelpers';

interface ThemedImageProps extends Omit<ImageProps, 'style'> {
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ImageStyle>;
}

export const ThemedImage: React.FC<ThemedImageProps> = ({ size = 'medium', style, ...props }) => {
  const { theme } = useTheme();
  const themeStyle = getImageStyle(theme, size);

  return <Image {...props} style={[themeStyle, style]} />;
};
