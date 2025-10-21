import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useTheme } from '@/styles/ThemeProvider';

interface AppIconButtonProps {
  label: string;
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Delete';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap; 
}
export const AppIconButton: React.FC<AppIconButtonProps> = ({
  label,
  variant = 'Primary',
  onPress,
  disabled,
  style,
  icon,
}) => {
  const { theme } = useTheme();

  const btnVariant = theme.Button[variant] || theme.Button.Primary;
  const state = disabled ? 'disabled' : 'rest';
  const btnStyle = btnVariant[state] || btnVariant.rest;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: btnStyle.background,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.sm,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          opacity: disabled ? 0.7 : 1,
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
      <Text
        style={{
          color: btnStyle.text,
          fontSize: theme.fontSize.lg,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
