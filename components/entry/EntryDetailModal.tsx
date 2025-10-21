import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { EntryDisplay } from './EntryDisplay';
import { commonStyles } from '@/styles/SharedStyles';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

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

interface EntryDetailModalProps {
  visible: boolean;
  entry: EntryProps | null;
  onClose: () => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
  onEditEntry: (entry: EntryProps) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEditUpdate,
  onDeleteUpdate,
  onEditEntry,
  onDeleteEntry,

}) => {
  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!entry?._id) return;
      try {
        const response = await fetch(`http://localhost:5000/updates/${entry._id}`);
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
        <ScrollView contentContainerStyle={[
          commonStyles.modalContainer,
          { top: 50,
           }
        ]}>
      <TouchableOpacity
  testID="close-button"
  
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

<EntryDisplay
  testID="entry-display"
  key={entry._id}
  entry={entry}
  onEditUpdate={onEditUpdate}
  onDeleteUpdate={onDeleteUpdate}
  onDeleteEntry={onDeleteEntry}
  onEditEntry={onEditEntry}
  showUpdatesInline={false}
  disableDetailModal={true}
  onRequestCloseModal={onClose}
    updateEntries={updateEntries}
/>
        </ScrollView>
      </View>
    </Modal>
  );
};