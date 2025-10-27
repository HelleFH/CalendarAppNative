import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

type ThemedViewProps = ViewProps & {
  variant?:
    | keyof ReturnType<typeof useTheme>['theme']['layout']['viewVariants']
    | 'cardSmall'
    | 'cardLarge'
    | 'cardShadow'
    | 'modalOverlay'
    | 'modalContent'
    | 'screenContainer'
    | 'buttonRow';
};

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const { layout } = theme;

  let variantStyle = {};

  if (variant) {
    if (layout.viewVariants && variant in layout.viewVariants) {
      variantStyle =
        layout.viewVariants[variant as keyof typeof layout.viewVariants];
    }

    // ✅ card variants
    else if (variant.startsWith('card')) {
      const key = variant.replace('card', '').toLowerCase() as
        | 'small'
        | 'large'
        | 'shadow';
      if (layout.card[key]) variantStyle = layout.card[key];
    }

    // ✅ modal variants
    else if (variant.startsWith('modal')) {
      const key = variant.replace('modal', '').toLowerCase() as
        | 'overlay'
        | 'content';
      if (layout.modal[key]) variantStyle = layout.modal[key];
    }

    // ✅ common layout keys
    else if (variant in layout) {
      variantStyle = (layout as any)[variant];
    }
  }

  return (
    <View style={StyleSheet.flatten([variantStyle, style])} {...rest}>
      {children}
    </View>
  );
};
