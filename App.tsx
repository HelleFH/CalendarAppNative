import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

import IndexScreen from './app/(tabs)/Welcome';
import LoginScreen from './app/LoginScreen';
import Calendar from './app/(tabs)/Calendar';
import AllEntriesScreen from './app/(tabs)/AllEntriesScreen';
import ProfileScreen from './app/ProfileScreen';

export type RootStackParamList = {
  IndexScreen: undefined;
  LoginScreen: undefined;
  Calendar: undefined;
  AllEntriesScreen: undefined;
  ProfileScreen: undefined;

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
        initialRouteName={user ? 'Calendar' : 'IndexScreen'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="IndexScreen" component={IndexScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="AllEntriesScreen" component={AllEntriesScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
