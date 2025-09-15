import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

import IndexScreen from './app/(tabs)/Welcome';
import LoginScreen from './app/(tabs)/LoginScreen';
import HomeScreen from './app/(tabs)/HomeScreen';
import AllEntriesScreen from './app/(tabs)/AllEntriesScreen';

export type RootStackParamList = {
  IndexScreen: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  AllEntriesScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
  <Stack.Navigator
    initialRouteName={user ? 'HomeScreen' : 'IndexScreen'}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="IndexScreen" component={IndexScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="AllEntriesScreen" component={AllEntriesScreen} />
  </Stack.Navigator>
</NavigationContainer>
  );
}
