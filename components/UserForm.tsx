import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FormInput } from '@/components/FormInput';
import { AppIconButton } from '@/components/AppIconButton';
import { CountryPicker } from './CountryPicker';

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
  const [showPicker, setShowPicker] = useState(false);
  const [country, setCountry] = useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* Required Fields */}

      {/* 🔐 Password Fields */}
      <FormInput
        label="Password"
        value={password}
        onChangeText={v => onChange('password', v)}
        secureTextEntry
        placeholder="Create a password"
      />

      <FormInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={v => onChange('confirmPassword', v)}
        secureTextEntry
        placeholder="Re-enter your password"
      />

      {/* Country Picker */}
      <View style={{ marginVertical: 8 }}>
        <Text style={{ marginBottom: 4 }}>Country</Text>
        <CountryPicker
          value={country}
          onValueChange={(val) => {
            setCountry(val);
            onChange('country', val);
          }}
        />
        <Text style={{ marginTop: 4 }}>{country}</Text>
      </View>

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

<FormInput
  label="Password *"
  value={password}
  onChangeText={v => onChange('password', v)}
  secureTextEntry
  placeholder="Create a password"
/>

<FormInput
  label="Confirm Password *"
  value={confirmPassword}
  onChangeText={v => onChange('confirmPassword', v)}
  secureTextEntry
  placeholder="Re-enter your password"
/>

<View style={{ marginVertical: 8 }}>
  <Text style={{ marginBottom: 4 }}>Country *</Text>
  <CountryPicker
    value={country}
    onValueChange={(val) => {
      setCountry(val);
      onChange('country', val);
    }}
  />
  <Text style={{ marginTop: 4 }}>{country}</Text>
</View>

<FormInput
  label="Postcode *"
  value={postcode || ''}
  onChangeText={v => onChange('postcode', v)}
/>

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <AppIconButton icon="save" label={submitLabel} onPress={onSubmit} variant="Primary" />
    </ScrollView>
  );
};
