import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';

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
      <View>
        <View >
          <TouchableOpacity
   
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
