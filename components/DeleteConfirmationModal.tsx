import React from 'react';
import { Modal } from 'react-native';

import { ThemedText } from '../styles/ThemedText';
import { ThemedView } from '../styles/ThemedView';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedButton } from '@/styles/ThemedTouchable';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itemType?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  itemType = 'entry',
}) => {
  const { theme } = useTheme();

  return (
   <Modal visible={visible} transparent animationType="fade">
  <ThemedView variant="modalOverlay">
    <ThemedView variant="modalContent">
      <ThemedText variant="body">
        Are you sure you want to delete this {itemType}?
      </ThemedText>

      <ThemedView variant="buttonRow">
        <ThemedButton
          icon="close"
          label="Cancel"
          onPress={onCancel}
          variant="Tertiary"
        />
        <ThemedButton
          icon="trash"
          label="Delete"
          onPress={onConfirm}
          variant="Delete"
        />
      </ ThemedView>
    </ThemedView>
  </ThemedView>
</Modal>
  );
};
