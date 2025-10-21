import React from 'react';
import { Modal, View, Text } from 'react-native';
import { AppIconButton } from './AppIconButton';
import { useTheme } from '@/styles/ThemeProvider';

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
              fontSize: theme.fontSize.lg,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
            }}
          >
            Are you sure you want to delete this {itemType}?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              gap: theme.spacing.sm,
            }}
          >
            <AppIconButton
              icon="close"
              label="Cancel"
              onPress={onCancel}
              variant="Tertiary"
              style={{ flex: 1 }}
            />
            <AppIconButton
              icon="trash"
              label="Delete"
              onPress={onConfirm}
              variant="Delete"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
