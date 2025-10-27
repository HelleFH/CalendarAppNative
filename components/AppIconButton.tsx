import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/styles/ThemeProvider';

type Variant = 'Primary' | 'Secondary' | 'Tertiary' | 'Edit' | 'Delete' | 'Close';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppIconButton: React.FC<Props> = ({
  icon,
  label,
  onPress,
  variant = 'Primary',
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);

const baseLayout: ViewStyle = {
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 6,
};

const positionStyle: ViewStyle =
  variant === 'Tertiary'
    ? { position: 'absolute', top: 10, right: 10 }
    : {};

const gradientColors = variant === 'Primary'
  ? pressed
    ? ['#4c8bf5', '#3b6df0'] as const
    : ['#6ea0f8', '#4c8bf5'] as const
  : ['transparent', 'transparent'] as const;


  const textColor =
    variant === 'Primary'
      ? '#fff'
      : variant === 'Tertiary'
      ? theme.colors.text // simple bold text
      : theme.colors.primary;

  const borderColor =
    variant === 'Secondary' ? theme.colors.primary : 'transparent';

  
  const shadowStyle =
    variant === 'Tertiary' || variant === 'Secondary'
      ? {}
      : {
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
          elevation: 3,
        };

  
  const ButtonContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons
        name={icon}
        size={20}
        color={textColor}
        style={{ marginRight: label ? 8 : 0 }}
      />
      {label && (
        <Text
          style={{
            color: textColor,
            fontSize: theme.fontSize.md,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[baseLayout, shadowStyle, positionStyle, style]}
    >
      {variant === 'Primary' ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {ButtonContent}
        </LinearGradient>
      ) : (
        <View
          style={{
            borderWidth: variant === 'Secondary' ? 2 : 0,
            borderColor,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {ButtonContent}
        </View>
      )}
    </TouchableOpacity>
  );
};
