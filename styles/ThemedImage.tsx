import React from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

interface ThemedImageProps extends Omit<ImageProps, 'style'> {
  size?: 'small' | 'medium' | 'large' | 'cardSmall' | 'cardLarge'; // ✅ added
  style?: StyleProp<ImageStyle>;
}

export const ThemedImage: React.FC<ThemedImageProps> = ({
  size = 'medium',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // ✅ Use the style from theme.Image (includes cardSmall / cardLarge now)
  const imageVariant = theme.Image[size] || theme.Image.medium;

  return (
    <Image
      {...props}
      resizeMode={imageVariant.resizeMode}
      style={[imageVariant, style]} // ✅ Merge theme + custom
    />
  );
};
