import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, style, ...props }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      style={[styles.input, style, error ? styles.inputError : null]}
      placeholder={props.placeholder || label}
      placeholderTextColor="#aaa"
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: 'red' },
  error: { marginTop: 5, color: 'red', fontSize: 12 },
});
