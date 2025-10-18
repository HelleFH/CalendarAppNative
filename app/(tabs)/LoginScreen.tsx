import React, { useState } from 'react';
import { ScrollView, TextInput, Text, Image } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { formStyles } from '@/styles/FormStyles';
import { AppIconButton } from '@/components/AppIconButton';
import Images from '@/assets/images';
import { commonStyles } from '@/styles/SharedStyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; 
import { RouteProp, uqseRoute } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registered!');
    
      navigation.navigate('HomeScreen');
    } catch (err) { 
      setError((err as any).message);
    }
  };

  const login = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in!');
      navigation.navigate('HomeScreen'); 
    } catch (err) {
      setError((err as any).message);
    }
  };

  return (
    <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.container}>
      <Image source={Images.HomeScreenBG} style={commonStyles.image} />

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

      <AppIconButton icon="add" label="Register" onPress={register} variant="primary" />
      <AppIconButton icon="log-in" label="Login" onPress={login} variant="edit" />

      {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
    </ScrollView>
  );
}
