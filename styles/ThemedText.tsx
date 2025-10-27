import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

type VariantKey =
  | keyof ReturnType<typeof useTheme>['theme']['textVariants']
  | 'modalTitle'
  | 'menuItemText';

interface ThemedTextProps extends TextProps {
  variant?: VariantKey;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  let textStyle: TextStyle;

  switch (variant) {
    case 'modalTitle':
      textStyle = theme.layout.modal.title;
      break;
    case 'menuItemText':
      textStyle = theme.layout.topMenu.menuItemText;
      break;
    default:
      textStyle = theme.textVariants[variant];
  }

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};
