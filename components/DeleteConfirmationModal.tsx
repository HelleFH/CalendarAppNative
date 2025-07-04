import { commonStyles } from '@/SharedStyles';
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

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
  itemType = "entry",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <Text>
            Are you sure you want to delete?
          </Text>
          <View style={commonStyles.buttonWrapper}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Delete" onPress={onConfirm} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};
