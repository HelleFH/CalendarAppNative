// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { formStyles } from '@/FormStyles';
import { AppIconButton } from '@/components/AppIconButton';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const register = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registered!');
    } catch (err) {
      setError((err as any).message);
    }
  };

  const login = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in!');
    } catch (err) {
      setError((err as any).message);
    }
  };

  return (
    <View style={formStyles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={formStyles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={formStyles.input}
      />

      <AppIconButton icon="add" label="Register" onPress={register} />
      <AppIconButton icon="log-in" label="Login" onPress={login} />

      {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
    </View>
  );
}
