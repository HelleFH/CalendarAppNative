import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { FormInput } from '@/components/FormInput';
import { AppIconButton } from '@/components/AppIconButton';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

const googleProvider = new GoogleAuthProvider();

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (!user.emailVerified) {
        alert('Please verify your email before logging in!');
        return;
      }

      alert('Logged in!');
      navigation.navigate('HomeScreen');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // For web, you can use signInWithPopup; for React Native, use expo-auth-session or react-native-google-signin
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const [firstName, ...rest] = (user.displayName || '').split(' ');
        const lastName = rest.join(' ');
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          firstName: firstName || '',
          lastName: lastName || '',
          country: '',
          postcode: '',
          createdAt: serverTimestamp(),
          emailVerified: user.emailVerified,
        });
      }

      alert('Logged in with Google!');
      navigation.navigate('HomeScreen');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        <AppIconButton icon="log-in" label="Login" onPress={login} variant="primary" />
        <GoogleSignInButton onPress={signInWithGoogle} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
