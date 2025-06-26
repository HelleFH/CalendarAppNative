import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Variant = 'primary' | 'secondary' | 'close'; 

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export const AppIconButton: React.FC<Props> = ({
  icon,
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const styles = getStyles(variant, disabled);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={20} color={styles.icon.color} style={styles.icon} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (variant: Variant, disabled: boolean) => {
  let backgroundColor: string, textColor: string;

  switch (variant) {
    case 'primary':
      backgroundColor = disabled ? '#B2F5EA' : '#319795'; // teal
      textColor = '#FFFFFF';
      break;
    case 'secondary':
      backgroundColor = disabled ? '#CBD5E0' : '#E2E8F0'; // light gray
      textColor = '#2D3748';
      break;
    case 'close':
      backgroundColor = disabled ? '#FED7D7' : '#E53E3E'; // red for close
      textColor = '#FFFFFF';
      break;
    default:
      backgroundColor = '#319795';
      textColor = '#FFFFFF';
  }

  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    } as ViewStyle,
    icon: {
      color: textColor,
      marginRight: 8,
    } as TextStyle,
    text: {
      color: textColor,
      fontSize: 16,
      fontWeight: '600',
    } as TextStyle,
    disabledButton: {
      opacity: 0.6,
    },
  });
};
