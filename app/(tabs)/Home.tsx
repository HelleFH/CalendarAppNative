import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Images from '../../assets/images';

import { getImageStyle } from '@/styles/ThemeHelpers';
;
import { ThemedText } from '@/components/ThemedText';
import { useTheme

 } from '@/styles/ThemeProvider';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScrollView } from '@/styles/ThemedScrollView';
import { ThemedButton } from '@/styles/ThemedTouchable';
type RootStackParamList = {
  LoginScreen: undefined;
  Calendar: undefined;
  AllEntriesScreen: undefined;
  IndexScreen: undefined;
};

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const {theme} = useTheme();


  return (
    <ThemedScrollView

    >
      <Image
        source={Images.HomeScreenBG}
        style={[getImageStyle(theme, 'large')]}
      />

      <ThemedText
  
      >
        The Plant Calendar 🌱
      </ThemedText>

      <ThemedText

      >
        Plant Calendar helps you care for your plants with ease. Upload images, track growth, and never forget to water again.
      </ThemedText>

      <ThemedText

      >
        ✔️ Smart reminders{'\n'}✔️ Growth tracking & notes{'\n'}
      </ThemedText>

      <ThemedView
 
 
      >
        <ThemedButton
          icon="log-in"
          label="Login"
          onPress={() => navigation.navigate('LoginScreen')}
          disabled={false}
          variant="Primary"
        />

        <ThemedButton
          icon="add"
          label="Get Started"
          onPress={() => navigation.navigate('LoginScreen')}
          disabled={false}
          variant="Secondary"
        />
      </ThemedView>
    </ThemedScrollView>
  );
};