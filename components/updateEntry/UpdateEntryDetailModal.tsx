import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { commonStyles } from '@/styles/SharedStyles';
import { Ionicons } from '@expo/vector-icons';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDetailModalProps {
  visible: boolean;
  entry: UpdateEntryProps | null;
  onClose: () => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
}

export const UpdateEntryDetailModal: React.FC<UpdateEntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEditUpdate,
  onDeleteUpdate,
}) => {
  if (!entry) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              padding: 8,
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <UpdateEntryDisplay
            key={entry._id}
            entry={entry}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
            disableDetailModal={true}
            onRequestCloseModal={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};
