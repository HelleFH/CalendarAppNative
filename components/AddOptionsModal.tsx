import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { useTheme } from '@/styles/ThemeProvider';

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
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.md,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            width: '100%',
            maxWidth: 350,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSize.xl,
              fontWeight: '700',
              marginBottom: theme.spacing.md,
              color: theme.colors.text,
              textAlign: 'center',
            }}
          >
            What would you like to add?
          </Text>

          <AppIconButton
            icon="document-text-outline"
            variant="Secondary"
            label="New Plant"
            onPress={onAddEntry}
            style={{ width: BUTTON_WIDTH, marginBottom: theme.spacing.sm }}
          />

          <AppIconButton
            icon="add"
            variant="Primary"
            label="Plant Update"
            onPress={onAddUpdate}
            style={{ width: BUTTON_WIDTH, marginBottom: theme.spacing.sm }}
          />

          <AppIconButton
            icon="alarm-outline"
            variant="Tertiary"
            label="Reminder"
            onPress={onAddReminder}
            style={{ width: BUTTON_WIDTH, marginBottom: theme.spacing.md }}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.md }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
