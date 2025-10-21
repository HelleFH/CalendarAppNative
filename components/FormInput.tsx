import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, required, style, ...props }) => {
  const { theme } = useTheme();
  const inputState = props.editable === false ? 'disabled' : 'rest';

  const inputStyle = theme.TextInput[inputState];

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{ fontSize: theme.fontSize.md, marginBottom: theme.spacing.xs, fontWeight: '600', color: theme.colors.text }}>
        {label}
        {required && <Text style={{ color: theme.colors.error }}> *</Text>}
      </Text>
      <TextInput
        {...props}
        style={[
          {
            borderWidth: 1,
            borderColor: inputState === 'disabled' ? inputStyle.border : inputStyle.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.fontSize.lg,
            color: inputStyle.text,
            backgroundColor: inputStyle.background,
          },
          style,
        ]}
        placeholder={props.placeholder || label}
        placeholderTextColor={inputStyle.placeholder}
      />
      {error && <Text style={{ color: theme.colors.error, fontSize: theme.fontSize.sm, marginTop: theme.spacing.xs }}>{error}</Text>}
    </View>
  );
};
