import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FormInput } from './FormInput';
import { CountryPicker } from './CountryPicker';
import { ThemedText } from '../styles/ThemedText';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedScrollView } from '@/styles/ThemedScrollView';
import { ThemedView } from './ThemedView';

interface UserFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  postcode?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  company?: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  error?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  postcode,
  city,
  addressLine1,
  addressLine2,
  company,
  onChange,
  onSubmit,
  submitLabel,
  error,
}) => {
  const { theme } = useTheme();
  const [country, setCountry] = useState('');

    return (
    <ScrollView contentContainerStyle={theme.layout.screenContainer}>
      {/* Required Fields */}
      <FormInput
        label="First Name *"
        value={firstName}
        onChangeText={v => onChange('firstName', v)}
      />
      <FormInput
        label="Last Name *"
        value={lastName}
        onChangeText={v => onChange('lastName', v)}
      />
      <FormInput
        label="Email *"
        value={email}
        onChangeText={v => onChange('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Fields */}
      <FormInput
        label="Password *"
        value={password}
        onChangeText={v => onChange('password', v)}
        secureTextEntry
      />
      <FormInput
        label="Confirm Password *"
        value={confirmPassword}
        onChangeText={v => onChange('confirmPassword', v)}
        secureTextEntry
      />

      {/* Country Picker */}
      <View style={theme.layout.card.small}>
        <ThemedText variant="body">Country *</ThemedText>
        <CountryPicker
          value={country}
          onValueChange={val => {
            setCountry(val);
            onChange('country', val);
          }}
        />
        <ThemedText variant="body">{country}</ThemedText>
      </View>

      {/* Optional Fields */}
      <FormInput
        label="Postcode"
        value={postcode || ''}
        onChangeText={v => onChange('postcode', v)}
      />
      <FormInput
        label="City"
        value={city || ''}
        onChangeText={v => onChange('city', v)}
      />
      <FormInput
        label="Address Line 1"
        value={addressLine1 || ''}
        onChangeText={v => onChange('addressLine1', v)}
      />
      <FormInput
        label="Address Line 2"
        value={addressLine2 || ''}
        onChangeText={v => onChange('addressLine2', v)}
      />
      <FormInput
        label="Company"
        value={company || ''}
        onChangeText={v => onChange('company', v)}
      />

      {/* Error */}
      {error && (
        <ThemedText variant="note" style={{ color: theme.colors.error }}>
          {error}
        </ThemedText>
      )}

      {/* Submit */}
      <ThemedButton
        icon="save"
        label={submitLabel}
        onPress={onSubmit}
        variant="Primary"
      />
    </ScrollView>
  );
};