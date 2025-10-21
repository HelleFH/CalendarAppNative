import React, { useState } from 'react';
import { ScrollView, Dimensions, KeyboardAvoidingView, Platform, Text, Image, View } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { FormInput } from '@/components/FormInput';
import { AppIconButton } from '@/components/AppIconButton';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import Images from '@/assets/images';
import { useTheme } from '../styles/ThemeProvider';
import { commonStyles } from '@/styles/SharedStyles';

const googleProvider = new GoogleAuthProvider();
const screenWidth = Dimensions.get('window').width;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme(); // <-- get theme here

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = () => {
    navigation.navigate('RegisterScreen');
  };

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
      navigation.navigate('Calendar');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
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
      navigation.navigate('Calendar');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.background,
      }}
    >
      <Image source={Images.HomeScreenBG} style={commonStyles.image} />
      <Image source={Images.Logo} style={commonStyles.image} />
      <Text style={{ textAlign: 'center', color: theme.colors.text, marginBottom: theme.spacing.md }}>
        Sign in with your email and password to continue.
      </Text>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.md,
          width: screenWidth,
          flexDirection: 'column',
          gap: theme.spacing.md,
          justifyContent:'center',
          alignItems:'center'
        }}
      >
        <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <FormInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {error ? <Text style={{ color: theme.colors.error, marginBottom: theme.spacing.sm }}>{error}</Text> : null}

        <AppIconButton
          icon="log-in"
          label="Login"
          style={{
            borderRadius: theme.radius.md,
            width: 175,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={login}
        />

        <GoogleSignInButton onPress={signInWithGoogle} />
        <Text style={{ textAlign: 'left', fontWeight: '500', color: theme.colors.text }}>
          Don't have an account yet?
        </Text>

        <AppIconButton
          icon="clipboard"
          label="Register"
          style={{
            borderRadius: theme.radius.md,
            width: 175,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={register}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
