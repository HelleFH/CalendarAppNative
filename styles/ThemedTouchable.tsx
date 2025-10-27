// ThemedButton.tsx
import React from 'react';
import { ViewStyle, StyleProp, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedText } from '@/styles/ThemedText';
import { ThemedView } from '@/styles/ThemedView';

interface ThemedButtonProps {
  label?: string; // optional now
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Delete';
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}


export const ThemedButton: React.FC<ThemedButtonProps> = ({
  label,
  icon,
  variant = 'Primary',
  onPress,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const btnVariant = theme.Button[variant];
  const state = disabled ? 'disabled' : 'rest';
  const btnStyle = btnVariant[state];

  return (
    <ThemedView style={{ marginVertical: theme.spacing.xs }}>
      <ThemedView>
        <Ionicons />
      </ThemedView>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          {
            backgroundColor: btnStyle.background,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.radius.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={btnStyle.text}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <ThemedText
          style={{
            color: btnStyle.text,
            fontSize: theme.fontSize.md,
            fontWeight: '600',
          }}
        >
          {label}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};
