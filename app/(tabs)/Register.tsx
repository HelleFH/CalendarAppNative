import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.js';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage("✅ Registered successfully!");
      console.log("User:", userCredential.user);
    } catch (error: unknown) {
      // Type guard: Ensure error is an instance of Error before accessing message
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
        console.error("Registration Error:", error);
      } else {
        setMessage("❌ Unknown error occurred");
        console.error("Unknown Error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={registerUser} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
