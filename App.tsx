import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';  
import { auth } from './firebase';

import LoginScreen from './app/(tabs)/LoginScreen';
import HomeScreen from './app/(tabs)/HomeScreen';
import IndexScreen from './app/(tabs)';
import SignUpScreen from './app/(tabs)/Register'; 
import AllEntriesScreen from './app/(tabs)/AllEntriesScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  // Type the user state to accept User or null
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // user can be either a User or null here
      setLoading(false);
    });

    return unsubscribe; // cleanup listener
  }, []);

  if (loading) return null; // Optionally, show a splash screen here

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Index" component={IndexScreen} />
            <Stack.Screen name="AllEntries" component={AllEntriesScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
