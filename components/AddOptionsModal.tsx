import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { formStyles } from '@/styles/FormStyles';

interface AddOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddEntry: () => void;
  onAddUpdate: () => void;
  onAddReminder: () => void;
}
const BUTTON_WIDTH = 200;


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
          <Text style={formStyles.title}>What would you like to add?</Text>

        
<AppIconButton
  icon="document-text-outline"
  variant="secondary"
  label="New Plant"
  onPress={onAddEntry}
  style={{ width: BUTTON_WIDTH }}
/>

<AppIconButton
  icon="document-text-outline"
  variant="primary"
  label="+ Plant Update"
  onPress={onAddUpdate}
  style={{ width: BUTTON_WIDTH }}
/>

<AppIconButton
  icon="alarm-outline"
  variant="edit"
  label="Reminder"
  onPress={onAddReminder}
  style={{ width: BUTTON_WIDTH }}
/>

          <TouchableOpacity onPress={onClose} style={commonStyles.cancelButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
