// components/ActionMenu.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  onView,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 28,
        right: 0,
        backgroundColor: theme.colors.surface || 'white',
        borderRadius: 8,
        paddingVertical: 6,
        minWidth: 130,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 9999,
      }}
    >
      {onView && (
        <TouchableOpacity
          onPress={() => {
            onView();
            onClose();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="eye" size={18} color={theme.colors.text} />
          <Text style={{ color: theme.colors.text, marginLeft: 8 }}>View</Text>
        </TouchableOpacity>
      )}

      {onEdit && (
        <TouchableOpacity
          onPress={() => {
            onEdit();
            onClose();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="pencil" size={18} color={theme.colors.text} />
          <Text style={{ color: theme.colors.text, marginLeft: 8 }}>Edit</Text>
        </TouchableOpacity>
      )}

      {onDelete && (
        <TouchableOpacity
          onPress={() => {
            onDelete();
            onClose();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="trash" size={18} color={theme.colors.error} />
          <Text style={{ color: theme.colors.error, marginLeft: 8 }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
