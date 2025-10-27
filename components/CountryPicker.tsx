import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
;
import { ThemedText } from '../styles/ThemedText';

import { useTheme } from '@/styles/ThemeProvider';


interface CountryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Denmark', value: 'DK' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
];

export const CountryPicker: React.FC<CountryPickerProps> = ({ value, onValueChange }) => {
  const {theme} = useTheme();

  const inputStyle = theme.TextInput.rest;

  return (
    <View>
      <ThemedText>
        Country
      </ThemedText>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={countries}
        value={value}
        placeholder={{ label: 'Select your country', value: '' }}
        style={{
          inputIOS: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.sm,
            borderWidth: 1,
            borderColor: inputStyle.border,
            borderRadius: theme.radius.md,
            fontSize: theme.fontSize.lg,
            color: inputStyle.text,
            backgroundColor: inputStyle.background,
          },
          inputAndroid: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.sm,
            borderWidth: 1,
            borderColor: inputStyle.border,
            borderRadius: theme.radius.md,
            fontSize: theme.fontSize.lg,
            color: inputStyle.text,
            backgroundColor: inputStyle.background,
          },
          placeholder: { color: inputStyle.placeholder },
        }}
      />
    </View>
  );
};
