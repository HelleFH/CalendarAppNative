import React from 'react';
import { Modal } from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
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
      <ThemedView variant="modalOverlay" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ThemedView variant="modalContent">
          <ThemedText variant="body" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
            Are you sure you want to delete this {itemType}?
          </ThemedText>

          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm }}>
            <ThemedButton icon="close" label="Cancel" onPress={onCancel} variant="Tertiary" />
            <ThemedButton icon="trash" label="Delete" onPress={onConfirm} variant="Delete" />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};
