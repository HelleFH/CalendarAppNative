import React from 'react';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import { ThemedText } from '../../styles/ThemedText';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.4}
      useNativeDriver
    >
      <ThemedView
        variant="modalContent"
        style={{
        
          borderRadius: 20,
          padding: theme.spacing.md,
          width: '100%',
          maxWidth: 400,
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.sm,
            position: 'relative',
          }}
        >
          <ThemedText
            variant="title"
            style={{ textAlign: 'center', flex: 1 }}
          >
            {title}
          </ThemedText>

          <View
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
          >
            <ThemedButton
              onPress={onClose}
              variant="Tertiary"
              icon="close"
              label=""
              style={{margin:0, padding:0, top:0, right:0,}}
            />
          </View>
        </View>

        <View style={{ width: '100%' }}>{children}</View>
      </ThemedView>
    </Modal>
  );
};
