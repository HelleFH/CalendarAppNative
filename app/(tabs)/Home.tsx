import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Images from '../../assets/images';
import { commonStyles } from '@/styles/SharedStyles';
import { AppIconButton } from '@/components/AppIconButton';
import { getImageStyle } from '@/styles/ThemeHelpers';
import { useTheme } from '@/styles/ThemeProvider';
type RootStackParamList = {
  LoginScreen: undefined;
  Calendar: undefined;
  AllEntriesScreen: undefined;
  IndexScreen: undefined;
};

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent:'center',
        height:'100%',
        gap:theme.spacing.lg,
      }}
    >
      <Image
        source={Images.HomeScreenBG}
        style={[getImageStyle(theme, 'large'), { marginBottom: theme.spacing.md }]}
      />

      <Text
        style={{
          fontSize: theme.fontSize.xl,
          color: theme.colors.text,
          fontWeight: 'bold',
          marginBottom: theme.spacing.sm,
          textAlign: 'center',
        }}
      >
        The Plant Calendar 🌱
      </Text>

      <Text
        style={{
          fontSize: theme.fontSize.lg,
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        Plant Calendar helps you care for your plants with ease. Upload images, track growth, and never forget to water again.
      </Text>

      <Text
        style={{
          fontSize: theme.fontSize.lg,
          color: '#2e7d32',
          textAlign: 'center',
          marginBottom: theme.spacing.lg,
          lineHeight: 22,
        }}
      >
        ✔️ Smart reminders{'\n'}✔️ Growth tracking & notes{'\n'}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap:20,
          marginBottom: theme.spacing.lg,
        }}
      >
        <AppIconButton
          icon="log-in"
          label="Login"
          onPress={() => navigation.navigate('LoginScreen')}
          disabled={false}
          variant="Primary"
        />

        <AppIconButton
          icon="add"
          label="Get Started"
          onPress={() => navigation.navigate('LoginScreen')}
          disabled={false}
          variant="Secondary"
        />
      </View>
    </ScrollView>
  );
};