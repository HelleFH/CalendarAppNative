import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';  
import { auth } from './firebase';
import { View } from 'react-native';
import LoginScreen from './app/(tabs)/LoginScreen';
import HomeScreen from './app/(tabs)/HomeScreen';
import IndexScreen from './app/(tabs)';
import AllEntriesScreen from './app/(tabs)/AllEntriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    window.onbeforeunload = null;

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) return null;

  return (
  <View style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
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

  </View>
  );
}
