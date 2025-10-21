import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';
import { AppIconButton } from './AppIconButton';

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
            maxWidth: 400,
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
            {title}
          </Text>

          <View style={{ marginBottom: theme.spacing.md }}>{children}</View>

          <AppIconButton
            icon="save"
            label={saveLabel}
            onPress={onSave}
            style={{ marginBottom: theme.spacing.sm }}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{
              alignItems: 'center',
              paddingVertical: theme.spacing.sm,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.md }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
