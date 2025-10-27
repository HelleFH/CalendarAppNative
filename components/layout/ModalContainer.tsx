import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedView } from '@/styles/ThemedView';

export const ModalContainer: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <ThemedView  {...props}>
      {children}
    </ThemedView>
  );
};
