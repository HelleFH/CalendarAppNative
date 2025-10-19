// jest.setup.js
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props) => {
      const { name, testID } = props;
      return <Text testID={testID}>{name}</Text>;
    },
  };
});

global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.env.EXPO_OS = 'ios';
global.alert = jest.fn();

import 'react-native-gesture-handler/jestSetup';

// Firebase mocks
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));
