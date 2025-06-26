// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registered!');
    } catch (err) {
      setError((err as any).message);
    }
    
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in!');
    } catch (err) {
      setError((err as any).message);
    }
    
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Register" onPress={register} />
      <Button title="Login" onPress={login} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
}
