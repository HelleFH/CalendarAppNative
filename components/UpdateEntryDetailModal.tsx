import React from 'react';
import { Modal, ScrollView, Text, Image, View } from 'react-native';
import { AppIconButton } from './AppIconButton';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { commonStyles } from '@/SharedStyles'; // Import commonStyles here

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDetailModalProps {
  visible: boolean;
  entry: UpdateEntryProps;
  onClose: () => void;
  onEdit: (entry: UpdateEntryProps) => void;
  onDelete: (id: string) => void;
}

export const UpdateEntryDetailModal: React.FC<UpdateEntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <ScrollView contentContainerStyle={commonStyles.modalContent}>
          <Text style={sharedEntryStyles.title}>{`Update Entry for ${entry.date}`}</Text>
          <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>

          <ScrollView horizontal>
            {(entry.images ?? []).map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={sharedEntryStyles.image} />
            ))}
          </ScrollView>

          <View style={sharedEntryStyles.buttonWrapper}>
            <AppIconButton icon="pencil" label="Edit" onPress={() => onEdit(entry)} variant="edit" />
            <AppIconButton icon="remove" label="Delete" onPress={() => onDelete(entry._id)} variant="delete" />
            <AppIconButton icon="close" label="Close" onPress={onClose} variant="close" />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
