import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import { ThemeProvider } from '@/styles/ThemeProvider';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/Home');
    }, 1000); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
});
