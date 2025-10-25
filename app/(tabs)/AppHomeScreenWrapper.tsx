import { ThemeProvider } from '@/styles/ThemeProvider';
import React from 'react';
import HomeScreen from './Calendar';

const AppHomeScreenWrapper = () => (
  <ThemeProvider>
    <HomeScreen />
  </ThemeProvider>
);

export default AppHomeScreenWrapper;
