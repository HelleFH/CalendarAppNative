import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';

import { ThemedText } from './ThemedText';
import { useTheme } from '@/styles/ThemeProvider';
import  { ThemedButton } from '@/styles/ThemedTouchable';

interface AddOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddEntry: () => void;
  onAddUpdate: () => void;
  onAddReminder: () => void;
}

export const AddOptionsModal: React.FC<AddOptionsModalProps> = ({
  visible,
  onClose,
  onAddEntry,
  onAddUpdate,
  onAddReminder,
}) => {
  const { theme } = useTheme();
  const BUTTON_WIDTH = 200;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View style={theme.layout.screenContainer as any}>
        <View
          style={{
            ...theme.layout.card,
            maxWidth: 350,
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ ...theme.textVariants.title, marginBottom: theme.spacing.md }}>
            What would you like to add?
          </ThemedText>

          <ThemedButton
            icon="document-text-outline"
            variant="Secondary"
            label="New Plant"
            onPress={onAddEntry}
          />

          <ThemedButton
            icon="add"
            variant="Primary"
            label="Plant Update"
            onPress={onAddUpdate}
          />

          <ThemedButton
            icon="alarm-outline"
            variant="Tertiary"
            label="Reminder"
            onPress={onAddReminder}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <ThemedText style={{ ...theme.textVariants.body }}>
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
