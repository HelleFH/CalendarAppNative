import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

interface AppIconButtonProps {
  label: string;
  variant?: 'Primary' | 'Secondary';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string; // optional if you use icon library
}
export const AppIconButton: React.FC<AppIconButtonProps> = ({ label, variant = 'Primary', onPress, disabled, style }) => {
  const { theme } = useTheme();

  // Ensure variant exists, default to Primary if not
  const btnVariant = theme.Button[variant] || theme.Button.Primary;

  const state = disabled ? 'disabled' : 'rest';
  const btnStyle = btnVariant[state] || btnVariant.rest; // fallback to rest

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: btnStyle.background,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.md,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: btnStyle.text, fontSize: theme.fontSize.lg, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
