import React from 'react';
import { Modal } from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  saveLabel: string;
  onSave: () => void;
  children: React.ReactNode;
  saveVariant?: 'Primary' | 'Secondary' | 'Edit';
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  saveLabel,
  onSave,
  children,
  saveVariant = 'Primary',
}) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Overlay */}
      <ThemedView variant="modalOverlay">
        {/* Modal Content */}
        <ThemedView variant="modalContent">
          {/* Title */}
          <ThemedText variant="title">{title}</ThemedText>

          {/* Children */}
          <ThemedView>{children}</ThemedView>

          {/* Save Button */}
          <ThemedButton
            icon="save"
            label={saveLabel}
            onPress={onSave}
          />

          {/* Cancel Button */}
          <ThemedButton onPress={onClose} variant="Tertiary">
            <ThemedText variant="body">Cancel</ThemedText>
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};
