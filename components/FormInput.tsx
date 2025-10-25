import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedText } from './ThemedText';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required,
  style,
  editable = true,
  ...props
}) => {
  const { theme } = useTheme();

  const inputState: 'rest' | 'disabled' = editable ? 'rest' : 'disabled';
  const inputVariant = theme.TextInput[inputState];

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <ThemedText variant="body" style={{ marginBottom: theme.spacing.xs }}>
        {label}
        {required && <ThemedText variant="body" style={{ color: theme.colors.error }}> *</ThemedText>}
      </ThemedText>

      <TextInput
        {...props}
        editable={editable}
        placeholder={props.placeholder || label}
        placeholderTextColor={inputVariant.placeholder}
        style={[
          inputVariant.style,
          style, // allow additional style overrides
        ]}
      />

      {error && (
        <ThemedText variant="note" style={{ color: theme.colors.error, marginTop: theme.spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};
