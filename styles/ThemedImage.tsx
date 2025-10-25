// ThemedImage.tsx
import React from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';
;


interface ThemedImageProps extends Omit<ImageProps, 'style'> {
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ImageStyle>;
}

export const ThemedImage: React.FC<ThemedImageProps> = ({ size = 'medium', style, ...props }) => {
  
  

  return <Image {...props} />;
};
