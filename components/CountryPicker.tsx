import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CountryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Denmark', value: 'DK' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  // ... add more countries
];

export const CountryPicker: React.FC<CountryPickerProps> = ({ value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Country</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={countries}
        value={value}
        placeholder={{ label: 'Select your country', value: '' }}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: '600' },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
  },
});
