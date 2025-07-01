import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { commonStyles } from '@/SharedStyles';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <Text style={commonStyles.modalTitle}>What would you like to add?</Text>

          <AppIconButton
            icon="document-text-outline"
            variant="secondary"
            label="Entry"
            onPress={onAddEntry}
          />

          <AppIconButton
            icon="create-outline"
            variant="primary"
            label="Update Entry"
            onPress={onAddUpdate}
          />

          <AppIconButton
            icon="alarm-outline"
            variant="edit"
            label="Reminder"
            onPress={onAddReminder}
          />

          <TouchableOpacity onPress={onClose} style={commonStyles.cancelButton}>
            <Text style={commonStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
