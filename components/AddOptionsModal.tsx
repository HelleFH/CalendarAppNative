import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../styles/ThemedText';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { ThemedView } from '@/styles/ThemedView';
import { useTheme } from '@/styles/ThemeProvider';
import { BaseModal } from './baseModal';

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

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="What would you like to add?"
      onSave={() => {}} // not used in this modal
    >
      {/* 👇 Modal content (children) */}
      <ThemedView variant="flexColumnSmall">
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
        </TouchableOpacity>
      </ThemedView>
    </BaseModal>
  );
};
