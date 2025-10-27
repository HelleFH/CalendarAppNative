// ThemedScrollView.tsx
import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';

type ThemedScrollViewProps = ScrollViewProps & {
  variant?:
    | keyof ReturnType<typeof useTheme>['theme']['layout']['viewVariants']
    | 'screenContainer'
    | 'buttonRow'
    | keyof ReturnType<typeof useTheme>['theme']['layout']['card'];
};

export const ThemedScrollView: React.FC<ThemedScrollViewProps> = ({
  variant,
  style,
  contentContainerStyle,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  let variantStyle: ViewStyle = {};

  if (variant && theme.layout) {
    const { layout } = theme;
    if (layout.viewVariants && variant in layout.viewVariants) {
      variantStyle = layout.viewVariants[variant as keyof typeof layout.viewVariants];
    } else if (layout.card && variant in layout.card) {
      variantStyle = layout.card[variant as keyof typeof layout.card];
    } else if (variant in layout) {
      variantStyle = (layout as any)[variant];
    }
  }

  // Split variant style into container and content styles
  const containerStyle: Partial<ViewStyle> = {};
  const contentStyle: Partial<ViewStyle> = {};

  Object.entries(variantStyle).forEach(([key, value]) => {
    if (
      [
        'alignItems',
        'justifyContent',
        'flexDirection',
        'gap',
        'rowGap',
        'columnGap',
        'flexWrap',
      ].includes(key)
    ) {
      contentStyle[key as keyof ViewStyle] = value;
    } else {
      containerStyle[key as keyof ViewStyle] = value;
    }
  });

  return (
    <ScrollView
      style={StyleSheet.flatten([{ backgroundColor: theme.colors.background }, containerStyle, style])}
      contentContainerStyle={StyleSheet.flatten([contentStyle, contentContainerStyle])}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};
