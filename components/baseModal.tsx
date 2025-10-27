import React from 'react';
import { Modal } from 'react-native';

import { ThemedText } from '../styles/ThemedText';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true} >
      {/* Overlay */}
      <ThemedView variant="modalOverlay">
        {/* Modal Content */}
        {/* Title */}

        {/* Children */}
        <ThemedView variant='cardLarge'>
     <ThemedButton onPress={onClose} variant="Tertiary" label='' icon="close"/>


          {children}
        </ThemedView>
        {/* Cancel Button */}
      </ThemedView>
    </Modal>
  );
};
