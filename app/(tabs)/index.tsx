import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Images from '../../assets/images';

export default function IndexScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={Images.HomeScreenBG} style={styles.image} />

      <Text style={styles.title}>Grow Better, Together 🌱</Text>
      <Text style={styles.subtitle}>
        Plant Calendar helps you care for your plants with ease. Set reminders, track growth, and never forget to water again.
      </Text>

      <Text style={styles.benefits}>
        ✔️ Smart reminders{'\n'}
        ✔️ Growth tracking & notes{'\n'}
        ✔️ Personalized plant care
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b4b4b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefits: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  registerButton: {
    backgroundColor: '#66bb6a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
