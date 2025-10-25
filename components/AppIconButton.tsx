import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/styles/ThemeProvider';

interface AppIconButtonProps {
  label: string;
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Delete';
  onPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>; // <-- updated
}
export const AppIconButton: React.FC<AppIconButtonProps> = ({
  label,
  variant = 'Primary',
  onPress,
  disabled = false,
  icon,
}) => {
  const { theme } = useTheme();

  const btnVariant = theme.Button[variant] || theme.Button.Primary;
  const state = disabled ? 'disabled' : 'rest';
  const btnStyle = btnVariant[state];

  // All styles now come from theme

  const iconSpacing: ViewStyle = {
    marginRight: theme.spacing.sm,
  };

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
    }
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
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
    }}
  >
    {label}
  </ThemedText>
</TouchableOpacity>

  );
};
