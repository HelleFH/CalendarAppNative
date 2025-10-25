import { ThemedScrollView } from '@/styles/ThemedScrollView';
import React from 'react';
import { ScrollView, ViewProps } from 'react-native';

export const ScreenContainer: React.FC<ViewProps> = ({ style, ...props }) => {
  return <ThemedScrollView {...props} />;
};
