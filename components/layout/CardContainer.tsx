import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedView } from '@/styles/ThemedView';

export const CardContainer: React.FC<ViewProps> = ({ style, children, ...props }) => {
  return (
    <ThemedView {...props}>
      {children}
    </ThemedView>
  );
};
