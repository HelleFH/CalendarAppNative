import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Variant = 'primary' | 'secondary' | 'edit' | 'delete' | 'close';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;

}

export const AppIconButton: React.FC<Props> = ({
  icon,
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style
}) => {
  const styles = getStyles(variant, disabled);


  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={{flexDirection:'row'}}>
      <Ionicons testID="icon" name={icon} size={20} color={styles.icon.color} style={styles.icon} />
      <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (variant: Variant, disabled: boolean) => {
  let backgroundColor: string | undefined = undefined;
  let textColor: string;

  switch (variant) {
    case 'primary':
      backgroundColor = disabled ? '#0E4732' : '#0E4732'; // leafy
      textColor = '#FFFFFF';
      break;
    case 'secondary':
      backgroundColor = disabled ? '#2E7D32' : '#2E7D32'; // mint
      textColor = '#FFFFFF';
      break;
    case 'edit':
      backgroundColor = disabled ? '#1976D2' : '#1976D2'; // blue
      textColor = '#FFFFFF';
      break;
    case 'delete':
      backgroundColor = disabled ? '#D32F2F' : '#D32F2F'; // red
      textColor = '#FFFFFF';
      break;
    case 'close':
      backgroundColor = 'transparent';
      textColor = disabled ? '#FFBABA' : '#E53E3E'; // link red
      break;
    default:
      backgroundColor = '#4CAF50';
      textColor = '#FFFFFF';
  }

  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor,
      paddingVertical: 10,
      whiteSpace: 'nowrap',
      paddingHorizontal: 22,
      alignSelf: 'center',
      borderRadius: variant === 'close' ? 0 : 12,
      marginVertical: 6,
      ...(variant !== 'close' && {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
      }),
    } as ViewStyle,
    icon: {
      color: textColor,
      marginRight: 8,
      
    } as TextStyle,
    text: {
      color: textColor,
      fontSize: 16,
      fontWeight: '600',
      textDecorationLine: 'none',
    } as TextStyle,
    disabledButton: {
      opacity: 0.6,
    },
  });
};
