import React, { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text, Alert, View } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FormInput } from '@/components/FormInput';
import { AppIconButton } from '@/components/AppIconButton';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // 👈 Import navigation
import { Ionicons } from '@expo/vector-icons'; // 👈 For a close icon

export default function ProfileScreen() {
  const navigation = useNavigation(); // 👈 Hook
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userRef = user ? doc(db, 'users', user.uid) : null;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userRef) return;
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setCountry(data.country || '');
          setPostcode(data.postcode || '');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!user || !userRef) return;
    setError('');

    try {
      await setDoc(
        userRef,
        {
          firstName,
          lastName,
          country,
          postcode,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (email !== user.email) {
        await updateEmail(user, email);
        Alert.alert('Email updated', 'You may need to re-verify your email.');
      }

      Alert.alert('Profile saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const reauthenticate = async (currentPassword: string) => {
    if (!user?.email) throw new Error('No email found for user');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await reauthenticate(currentPassword);
      await updatePassword(user!, newPassword);
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        alert('Please log out and log in again before changing your password.');
      } else {
        alert(err.message);
      }
    }
  };

  if (loading) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <Ionicons
            name="close"
            size={28}
            color="#333"
            onPress={() => navigation.goBack()}   
          />
        </View>

        <FormInput label="First Name" value={firstName} onChangeText={setFirstName} />
        <FormInput label="Last Name" value={lastName} onChangeText={setLastName} />
        <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormInput label="Country" value={country} onChangeText={setCountry} />
        <FormInput label="Postcode" value={postcode} onChangeText={setPostcode} />

        <Text style={{ fontWeight: '600', marginTop: 20 }}>Change Password</Text>

        <FormInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <FormInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <FormInput
          label="Confirm New Password"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />

        <AppIconButton
          icon="key"
          label="Change Password"
          onPress={handleChangePassword}
        />

        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        <AppIconButton icon="save" label="Save Changes" onPress={saveProfile} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
