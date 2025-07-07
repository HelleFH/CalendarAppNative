import React from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Images from '../../assets/images';
import { commonStyles } from '@/styles/SharedStyles';
import { AppIconButton } from '@/components/AppIconButton';


type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  AllEntriesScreen: undefined;
  IndexScreen:undefined;
};

export default function IndexScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={commonStyles.container}>
      <Image source={Images.HomeScreenBG} style={commonStyles.image} />

      <Text style={commonStyles.title}>the Plant Calendar 🌱</Text>
      <Text style={commonStyles.subtitle}>
        Plant Calendar helps you care for your plants with ease. Upload images, track growth, and never forget to water again.
      </Text>

      <Text style={styles.benefits}>
        ✔️ Smart reminders{'\n'}
        ✔️ Growth tracking & notes{'\n'}
      </Text>



        <AppIconButton
          icon="log-in"
          label="Login"
          onPress={() => navigation.navigate('LoginScreen')} 
          disabled={false}
          variant="primary"
        />
 
 
        <AppIconButton
          icon="add"
          label="Get Started"
          onPress={() => navigation.navigate('LoginScreen')} 
          disabled={false}
          variant="secondary"
        />

    </View>
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
