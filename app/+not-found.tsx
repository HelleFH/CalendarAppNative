import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';


import { ThemedView } from '@/styles/ThemedView';
import { ThemedText } from '@/styles/ThemedText';
import { ThemeProvider } from '@/styles/ThemeProvider';

export default function NotFoundScreen() {
  return (
    <>
    <ThemeProvider>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText variant="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
      </ThemeProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});