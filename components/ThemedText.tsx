import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

type TextVariant = keyof ReturnType<typeof useTheme>['theme']['textVariants'];

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ variant = 'body', style, children, ...props }) => {
  const { theme } = useTheme();
  const textStyle = theme.textVariants[variant];
  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};
