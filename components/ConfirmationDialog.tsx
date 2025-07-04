import { commonStyles } from '@/SharedStyles';
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface ConfirmationDialogProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.container}>
          <Text>{message}</Text>
          <View style={commonStyles.buttonWrapper}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Confirm" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
