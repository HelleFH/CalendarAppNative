import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { commonStyles } from '@/SharedStyles';
import { Ionicons } from '@expo/vector-icons';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDetailModalProps {
  visible: boolean;
  entry: EntryProps | null;
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
  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!entry?._id) return;
      try {
        const response = await fetch(`https://calendarappnative.onrender.com/updates/${entry._id}`);
        const data: UpdateEntryProps[] = await response.json();
        setUpdateEntries(data);
      } catch (err) {
        console.error('Failed to fetch updates:', err);
      }
    };
    fetchUpdates();
  }, [entry]);

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
            parentEntryName={entry.name}
          />
        </View>
      </View>
    </Modal>
  );
};
