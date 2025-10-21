import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Images from '../../assets/images';
import { commonStyles } from '@/styles/SharedStyles';
import { AppIconButton } from '@/components/AppIconButton';


type RootStackParamList = {
  LoginScreen: undefined;
  Calendar: undefined;
  AllEntriesScreen: undefined;
  IndexScreen: undefined;
};

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.container}>
      <Image source={Images.HomeScreenBG} style={commonStyles.image} />

      <Text style={commonStyles.title}>The Plant Calendar 🌱</Text>
      <Text style={commonStyles.subtitle}>
        Plant Calendar helps you care for your plants with ease. Upload images, track growth, and never forget to water again.
      </Text>

      <Text style={styles.benefits}>
        ✔️ Smart reminders{'\n'}
        ✔️ Growth tracking & notes{'\n'}
      </Text>


      <View style={commonStyles.buttonWrapper}>
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
}

const styles = StyleSheet.create({

  benefits: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },


});
