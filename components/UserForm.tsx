import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FormInput } from '@/components/FormInput';
import { AppIconButton } from '@/components/AppIconButton';
import { CountryPicker } from './CountryPicker';

interface UserFormProps {
  firstName: string;
  lastName: string;
  email: string;
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
      <FormInput label="First Name" value={firstName} onChangeText={v => onChange('firstName', v)} />
      <FormInput label="Last Name" value={lastName} onChangeText={v => onChange('lastName', v)} />
      <FormInput label="Email" value={email} onChangeText={v => onChange('email', v)} keyboardType="email-address" />

      {/* Country Picker */}
      <View style={{ marginVertical: 8 }}>
        <Text style={{ marginBottom: 4 }}>Country</Text>


        <Text style={{ marginTop: 4 }}>{country}</Text>
      </View>

      {/* Optional Fields */}
      <FormInput label="Postcode" value={postcode || ''} onChangeText={v => onChange('postcode', v)} />
      <FormInput label="City" value={city || ''} onChangeText={v => onChange('city', v)} />
      <FormInput label="Address Line 1" value={addressLine1 || ''} onChangeText={v => onChange('addressLine1', v)} />
      <FormInput label="Address Line 2" value={addressLine2 || ''} onChangeText={v => onChange('addressLine2', v)} />
     <CountryPicker
  value={country}
  onValueChange={(val) => setCountry(val)}
/>

      <FormInput label="Company" value={company || ''} onChangeText={v => onChange('company', v)} />

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <AppIconButton icon="save" label={submitLabel} onPress={onSubmit} variant="primary" />
    </ScrollView>
  );
};
