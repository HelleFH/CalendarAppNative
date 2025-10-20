import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { UserForm } from '@/components/UserForm';

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        country,
        postcode,
        createdAt: serverTimestamp(),
        emailVerified: user.emailVerified,
      });

      alert('Registered! Please verify your email before logging in.');
      navigation.navigate('LoginScreen');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <UserForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        country={country}
        postcode={postcode}
        onChange={(field, value) => {
          switch (field) {
            case 'firstName': setFirstName(value); break;
            case 'lastName': setLastName(value); break;
            case 'email': setEmail(value); break;
            case 'password': setPassword(value); break;
            case 'confirmPassword': setConfirmPassword(value); break;
            case 'country': setCountry(value); break;
            case 'postcode': setPostcode(value); break;
          }
        }}
        onSubmit={register}
        submitLabel="Register"
        error={error}
      />
    </KeyboardAvoidingView>
  );
}
